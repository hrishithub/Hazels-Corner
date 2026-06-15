import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import type { WeeklyReportAnalytics, WeeklyReportData } from "@/lib/reports";

export const runtime = "nodejs";

type WeeklyReportRequest = {
  analytics?: WeeklyReportAnalytics;
};

const reportModels = ["gemini-2.5-flash", "gemini-2.0-flash"];

function isString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isReportData(value: unknown): value is WeeklyReportData {
  if (!value || typeof value !== "object") return false;
  const report = value as Partial<WeeklyReportData>;
  return Boolean(
    report.overview &&
      typeof report.overview === "object" &&
      typeof report.overview.totalTasks === "number" &&
      typeof report.overview.completedTasks === "number" &&
      typeof report.overview.completionRate === "number" &&
      isString(report.overview.summary) &&
      isString(report.overview.consistencyAnalysis) &&
      Array.isArray(report.strengths) &&
      Array.isArray(report.improvements) &&
      Array.isArray(report.subjectAnalysis) &&
      report.studyPatterns &&
      typeof report.studyPatterns === "object" &&
      Array.isArray(report.studyPatterns.strongestDays) &&
      Array.isArray(report.studyPatterns.weakerDays) &&
      Array.isArray(report.studyPatterns.observations) &&
      Array.isArray(report.recommendations)
  );
}

function isAnalyticsPayload(value: unknown): value is WeeklyReportAnalytics {
  if (!value || typeof value !== "object") return false;
  const analytics = value as Partial<WeeklyReportAnalytics>;
  return Boolean(
    analytics.weekRange &&
      typeof analytics.weekRange === "object" &&
      isString(analytics.weekRange.weekStart) &&
      isString(analytics.weekRange.weekEnd) &&
      typeof analytics.totalTasksCreated === "number" &&
      typeof analytics.totalTasksCompleted === "number" &&
      typeof analytics.completionPercentage === "number" &&
      Array.isArray(analytics.dailyBreakdown) &&
      Array.isArray(analytics.allTasks)
  );
}

function extractText(response: unknown) {
  if (!response || typeof response !== "object") return "";
  const maybeText = (response as { text?: unknown }).text;
  if (typeof maybeText === "string") return maybeText.trim();
  if (typeof maybeText === "function") {
    try {
      const text = maybeText.call(response);
      return typeof text === "string" ? text.trim() : "";
    } catch {
      return "";
    }
  }
  return "";
}

function parseJsonReport(text: string) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(cleaned) as unknown;
}

function getErrorStatus(error: unknown) {
  if (!error || typeof error !== "object") return undefined;
  const maybeError = error as { status?: unknown; statusCode?: unknown; code?: unknown };
  const status = maybeError.status ?? maybeError.statusCode ?? maybeError.code;
  return typeof status === "number" || typeof status === "string" ? String(status) : undefined;
}

function isTemporaryGeminiFailure(error: unknown) {
  const status = getErrorStatus(error);
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  return (
    status === "503" ||
    status === "429" ||
    message.includes("503") ||
    message.includes("unavailable") ||
    message.includes("overloaded") ||
    message.includes("overload") ||
    message.includes("high demand") ||
    message.includes("temporarily") ||
    message.includes("try again")
  );
}

function buildPrompt(analytics: WeeklyReportAnalytics) {
  return `
Analyze this student's weekly study performance.

Tone:
- professional study mentor
- analytical
- calm
- constructive

Avoid:
- generic motivation
- toxic productivity
- cute messages
- Pokemon or companion references
- markdown

Base every observation only on the provided data. Infer subjects and topics from task titles and notes. If data is limited, say so professionally.

Return ONLY valid JSON in this exact shape:
{
  "overview": {
    "totalTasks": number,
    "completedTasks": number,
    "completionRate": number,
    "summary": string,
    "consistencyAnalysis": string
  },
  "strengths": [
    { "title": string, "description": string }
  ],
  "improvements": [
    { "issue": string, "suggestion": string }
  ],
  "subjectAnalysis": [
    { "topic": string, "observation": string }
  ],
  "studyPatterns": {
    "strongestDays": string[],
    "weakerDays": string[],
    "observations": string[]
  },
  "recommendations": [
    { "action": string, "reason": string }
  ]
}

Planner analytics JSON:
${JSON.stringify(analytics, null, 2)}
`.trim();
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API key is not configured on the server." }, { status: 500 });
  }

  let body: WeeklyReportRequest;

  try {
    body = (await request.json()) as WeeklyReportRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  if (!isAnalyticsPayload(body.analytics)) {
    return NextResponse.json({ error: "Invalid analytics payload." }, { status: 400 });
  }

  if (body.analytics.totalTasksCreated === 0) {
    return NextResponse.json({ error: "Planner is empty. Add tasks before generating a report." }, { status: 400 });
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(body.analytics);
  let lastTemporaryError: unknown;

  for (const model of reportModels) {
    try {
      console.log(`Trying model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = extractText(response);
      if (!text) {
        return NextResponse.json({ error: "Gemini returned an empty response." }, { status: 502 });
      }

      let parsed: unknown;
      try {
        parsed = parseJsonReport(text);
      } catch {
        return NextResponse.json({ error: "Gemini returned invalid JSON." }, { status: 502 });
      }

      if (!isReportData(parsed)) {
        return NextResponse.json({ error: "Gemini response did not match the expected report format." }, { status: 502 });
      }

      return NextResponse.json({ reportData: parsed, model });
    } catch (error) {
      if (!isTemporaryGeminiFailure(error)) {
        console.error("Weekly report generation failed:", error);
        return NextResponse.json({ error: "Failed to generate weekly report." }, { status: 502 });
      }

      lastTemporaryError = error;
      console.log(`Fallback triggered: ${model}`);
    }
  }

  console.error("Weekly report generation failed after fallback:", lastTemporaryError);
  return NextResponse.json(
    { error: "Gemini is temporarily unavailable. Please try generating the weekly report again later." },
    { status: 503 }
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BarChart3, CalendarDays, CheckCircle2, Loader2, Lock, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useJourneyProgress } from "@/components/journey/JourneyProgressContext";
import { useLocalStorage } from "@/lib/storage";
import {
  buildWeeklyAnalytics,
  getCurrentIstWeekRange,
  StoredWeeklyReport,
  WeeklyReportData
} from "@/lib/reports";
import {
  LineChart,
  AreaChart ,
  Area,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
 
} from "recharts";

function createReportId(weekEnd: string) {
  return `weekly-report-${weekEnd}`;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong while generating the report.";
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-[1.25rem] border border-white/55 bg-white/38 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-ink/55">{label}</p>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-lilac/35 text-plum">{icon}</span>
      </div>
      <p className="font-display text-4xl text-ink">{value}</p>
    </div>
  );
}

function ListCard({
  title,
  children,
  tone = "neutral"
}: {
  title: string;
  children: React.ReactNode;
  tone?: "neutral" | "green" | "orange";
}) {
  const toneClass =
    tone === "green" ? "border-[#b7d9b4] bg-[#f3fbef]/55" : tone === "orange" ? "border-[#f0c4ad] bg-[#fff4eb]/60" : "border-white/55 bg-white/38";
  return (
    <section className={`rounded-[1.5rem] border p-5 shadow-soft ${toneClass}`}>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function ReportView({ report }: { report: StoredWeeklyReport }) {
  const data = report.reportData;
  const completionRate = Math.max(
    0,
    Math.min(100, data.overview.completionRate)
  );

  const dailyChartData = report.plannerSnapshot.map((day) => {
    const total = day.tasks.length;
    const completed = day.tasks.filter((task) => task.done).length;

    return {
      day: day.day.slice(0, 3),
      completion: total
        ? Math.round((completed / total) * 100)
        : 0
    };
  });
const COLORS = [
  "#b48ead",
  "#88c0d0",
  "#a3be8c",
  "#ebcb8b",
  "#d08770",
  "#81a1c1"
];
 const subjectChartData = data.subjectAnalysis.map((item, index) => {
  const count = report.plannerSnapshot
    .flatMap((day) => day.tasks)
    .filter((task) =>
      (task.title + task.note)
        .toLowerCase()
        .includes(item.topic.toLowerCase().split(" ")[0])
    ).length;

return {
    name: item.topic,
    value: count || 1,
    fill: COLORS[index % COLORS.length]
  };
});



  return (
    <div className="space-y-5">

      <section className="glass rounded-[2rem] p-5 sm:p-6">

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-plum/70">
              weekly overview
            </p>

            <h2 className="font-display text-3xl text-ink">
              {report.weekStart} to {report.weekEnd}
            </h2>
          </div>

          <p className="rounded-full bg-white/45 px-4 py-2 text-sm text-ink/62">
            Generated {new Date(report.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>


        <div className="grid gap-4 md:grid-cols-3">

          <StatCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="tasks planned"
            value={String(data.overview.totalTasks)}
          />

          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="tasks completed"
            value={String(data.overview.completedTasks)}
          />

          <StatCard
            icon={<BarChart3 className="h-5 w-5" />}
            label="completion rate"
            value={`${completionRate}%`}
          />

        </div>


        <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/48">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-rose via-lilac to-plum"
            animate={{ width: `${completionRate}%` }}
          />
        </div>

      </section>


      <section className="grid gap-5 xl:grid-cols-3">

        <ListCard title="Performance Summary">

          <p className="text-sm leading-7 text-ink/70">
            {data.overview.summary}
          </p>

          <p className="rounded-2xl bg-white/45 p-4 text-sm leading-7 text-ink/70">
            {data.overview.consistencyAnalysis}
          </p>

        </ListCard>


        <ListCard title="Strong Areas" tone="green">

          {data.strengths.map((item) => (
            <div key={item.title}
              className="flex gap-3 text-sm leading-6 text-ink/72">

              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#3f8b4b]" />

              <p>
                <span className="font-medium text-ink">
                  {item.title}:
                </span>{" "}
                {item.description}
              </p>

            </div>
          ))}

        </ListCard>


        <ListCard title="Needs Attention" tone="orange">

          {data.improvements.map((item) => (
            <div key={item.issue}
              className="flex gap-3 text-sm leading-6 text-ink/72">

              <AlertTriangle className="mt-0.5 h-4 w-4 text-[#d66a3d]" />

              <p>
                <span className="font-medium text-ink">
                  {item.issue}:
                </span>{" "}
                {item.suggestion}
              </p>

            </div>
          ))}

        </ListCard>

      </section>


      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">


        {/* SUBJECT + PIE */}

        <ListCard title="Subject Analysis">

          {data.subjectAnalysis.map((item) => (

            <div
              key={item.topic}
              className="rounded-2xl bg-white/42 p-4 text-sm leading-6 text-ink/72"
            >

              <p className="font-medium text-ink">
                {item.topic}
              </p>

              <p className="mt-1">
                {item.observation}
              </p>

            </div>

          ))}


          <div className="mt-6 h-72 rounded-2xl bg-white/42 p-4">

            <ResponsiveContainer width="100%" height={280}>

              <PieChart>

<Pie
  data={subjectChartData}
  dataKey="value"
  nameKey="name"
  outerRadius={80}
  label={(props:any)=>{
    const percent = props.percent ?? 0;
    return `${(percent * 100).toFixed(0)}%`;
  }}
/>

                <Tooltip />

         <Legend
  verticalAlign="bottom"
  wrapperStyle={{
    fontSize: "12px"
  }}
/>

              </PieChart>

            </ResponsiveContainer>

          </div>


        </ListCard>



        {/* STUDY PATTERN + LINE */}

        <ListCard title="Study Pattern">


          <div className="grid gap-3 sm:grid-cols-2">

            <div className="rounded-2xl bg-[#f3fbef]/70 p-4">

              <p className="text-xs uppercase tracking-[0.16em] text-[#3f8b4b]">
                strongest days
              </p>

              <p className="mt-2 text-sm text-ink/72">
                {data.studyPatterns.strongestDays.join(", ") ||
                  "Not enough data"}
              </p>

            </div>


            <div className="rounded-2xl bg-[#fff4eb]/75 p-4">

              <p className="text-xs uppercase tracking-[0.16em] text-[#d66a3d]">
                weaker days
              </p>

              <p className="mt-2 text-sm text-ink/72">
                {data.studyPatterns.weakerDays.join(", ") ||
                  "Not enough data"}
              </p>

            </div>

          </div>


          {data.studyPatterns.observations.map((observation) => (

            <p
              key={observation}
              className="rounded-2xl bg-white/42 p-4 text-sm leading-6 text-ink/72"
            >

              {observation}

            </p>

          ))}


          <div className="mt-6 h-72 rounded-2xl bg-white/42 p-4">

            <ResponsiveContainer width="100%" height="100%">

             <AreaChart  data={dailyChartData}>

<XAxis
  dataKey="day"
  label={{
    value: "Day",
    position: "insideBottom",
    offset: -5
  }}
/>

<YAxis
  domain={[0,100]}
  label={{
    value: "Completion %",
    angle: -90,
    position: "insideLeft"
  }}
/>

<Tooltip
  formatter={(value) => [`${value}%`, "Completion"]}
/>

<Area
  type="monotone"
  dataKey="completion"
  stroke="#b48ead"
  fill="#b48ead"
  fillOpacity={0.25}
/>

</AreaChart >

            </ResponsiveContainer>

          </div>


        </ListCard>


      </section>


      <ListCard title="Next Week Recommendations">

        {data.recommendations.map((item,index)=>(

          <div
            key={item.action}
            className="flex gap-3 text-sm leading-6 text-ink/72"
          >

            <span className="grid h-7 w-7 place-items-center rounded-full bg-plum text-xs text-white">
              {index+1}
            </span>

            <p>
              <span className="font-medium text-ink">
                {item.action}:
              </span>{" "}
              {item.reason}
            </p>

          </div>

        ))}

      </ListCard>


    </div>
  );
}

export function WeeklyReports() {
  const { days } = useJourneyProgress();
  const [reports, setReports] = useLocalStorage<StoredWeeklyReport[]>("hazel:weekly-reports", []);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const weekRange = useMemo(() => getCurrentIstWeekRange(), []);
  const analytics = useMemo(() => buildWeeklyAnalytics(days, weekRange), [days, weekRange]);
  const currentReportId = createReportId(weekRange.weekEnd);
  const hasCurrentReport = reports.some((report) => report.id === currentReportId);
  const selectedReport = reports.find((report) => report.id === selectedId) ?? reports[0];
  const canGenerate = weekRange.isSunday && !hasCurrentReport && analytics.totalTasksCreated > 0 && !loading;

  useEffect(() => {
    if (!selectedId && reports.length > 0) {
      setSelectedId(reports[0].id);
    }
  }, [reports, selectedId]);

  async function generateReport() {
    if (!canGenerate) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/weekly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analytics })
      });

      const payload = (await response.json()) as { reportData?: WeeklyReportData; error?: string };
      if (!response.ok || !payload.reportData) {
        throw new Error(payload.error || "Report generation failed.");
      }

      const report: StoredWeeklyReport = {
        id: currentReportId,
        weekStart: weekRange.weekStart,
        weekEnd: weekRange.weekEnd,
        createdAt: new Date().toISOString(),
        plannerSnapshot: JSON.parse(JSON.stringify(days)) as typeof days,
        reportData: payload.reportData
      };

      setReports([report, ...reports.filter((item) => item.id !== report.id)]);
      setSelectedId(report.id);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setLoading(false);
    }
  }

  const lockedMessage = !weekRange.isSunday
    ? "Weekly report unlocks every Sunday"
    : hasCurrentReport
      ? "This Sunday report has already been generated"
      : analytics.totalTasksCreated === 0
        ? "Add planner tasks before generating a report"
        : "";

  return (
    <div className="space-y-5 pb-10 pt-4 sm:pt-8">
      <section className="glass rounded-[2rem] p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-plum/70">study analytics</p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-6xl">Weekly Study Report</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-ink/68">A detailed AI analysis of your weekly performance.</p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <span className="rounded-full bg-white/46 px-4 py-3 text-sm text-ink/66">{lockedMessage || "Report available today"}</span>
            <button
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-plum px-5 text-sm text-white shadow-soft transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/45 disabled:hover:translate-y-0"
              disabled={!canGenerate}
              onClick={generateReport}
              type="button"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : canGenerate ? <TrendingUp className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>
        {error && <p className="mt-4 rounded-2xl bg-rose/20 p-4 text-sm text-ink/70">{error}</p>}
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard icon={<Target className="h-5 w-5" />} label="planned this week" value={String(analytics.totalTasksCreated)} />
        <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="completed" value={String(analytics.totalTasksCompleted)} />
        <StatCard icon={<BarChart3 className="h-5 w-5" />} label="current rate" value={`${analytics.completionPercentage}%`} />
        <StatCard icon={<CalendarDays className="h-5 w-5" />} label="saved reports" value={String(reports.length)} />
      </section>

      {reports.length > 0 && (
        <section className="glass rounded-[2rem] p-4">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-plum/70">report history</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {reports.map((report) => (
              <button
                className={`min-w-44 rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  selectedReport?.id === report.id ? "border-plum bg-plum text-white shadow-soft" : "border-white/55 bg-white/38 text-ink/70 hover:bg-white/58"
                }`}
                key={report.id}
                onClick={() => setSelectedId(report.id)}
                type="button"
              >
                <span className="block font-medium">Week ending</span>
                <span className="mt-1 block">{report.weekEnd}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {selectedReport ? (
        <ReportView report={selectedReport} />
      ) : (
        <section className="glass rounded-[2rem] p-8 text-center">
          <BarChart3 className="mx-auto mb-4 h-10 w-10 text-plum" />
          <h2 className="font-display text-3xl text-ink">No reports yet</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink/66">The first report can be generated on Sunday after you are done for the week.
</p>
        </section>
      )}
    </div>
  );
}

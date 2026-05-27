import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { JourneyProgressProvider } from "@/components/journey/JourneyProgressContext";

export const metadata: Metadata = {
  title: "Hazel's Corner",
  description: "A small comforting corner for Hazel during NEET PG preparation.",
  icons: {
    icon: "/coffe.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <JourneyProgressProvider>
          <AppShell>{children}</AppShell>
        </JourneyProgressProvider>
        <Analytics />
      </body>
    </html>
  );
}

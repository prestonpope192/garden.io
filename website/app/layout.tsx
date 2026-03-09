import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Garden.io | The Living Notebook for Growing",
  description:
    "Garden.io is a planning, memory, and intelligence system for growers managing real complexity across beds, zones, and seasons.",
  openGraph: {
    title: "Garden.io | The Living Notebook for Growing",
    description:
      "Plan by space and time with calm, context-aware guidance for gardens, farms, and homesteads.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Garden.io | The Living Notebook for Growing",
    description:
      "Plan by space and time with calm, context-aware guidance for gardens, farms, and homesteads."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Caveat, EB_Garamond, Ibarra_Real_Nova } from "next/font/google";
import "./globals.css";

const bodyFont = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

const labelFont = Ibarra_Real_Nova({
  subsets: ["latin"],
  variable: "--font-label",
  weight: ["400", "500", "600", "700"]
});

const scriptFont = Caveat({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["400", "500", "600", "700"]
});

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
      <body className={`${bodyFont.variable} ${labelFont.variable} ${scriptFont.variable}`}>
        {children}
      </body>
    </html>
  );
}

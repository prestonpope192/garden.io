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
  title: "Garden.io | Your Garden, Smarter",
  description:
    "Save what you notice. Get care advice that remembers your plants.",
  openGraph: {
    title: "Garden.io | Your Garden, Smarter",
    description:
      "Save what you notice. Get care advice that remembers your plants.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Garden.io | Your Garden, Smarter",
    description:
      "Save what you notice. Get care advice that remembers your plants."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${bodyFont.variable} ${labelFont.variable} ${scriptFont.variable}`}>
        {children}
      </body>
    </html>
  );
}

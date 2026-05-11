import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FETech Analytics — Retail Business Intelligence Platform",
  description: "Turn your sales CSV into actionable business insights. Revenue trends, customer segmentation, AI-powered forecasting, and more.",
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="bg-white text-slate-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

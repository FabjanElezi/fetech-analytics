import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FETech Analytics — Project Report",
  description: "Full technical and functional project report for the FETech Analytics BI platform.",
};

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="bg-white text-slate-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

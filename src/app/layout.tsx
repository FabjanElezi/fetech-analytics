import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FETech Analytics — Retail BI Platform",
  description: "Business intelligence dashboard for retail sales analytics.",
};

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkConfigured = clerkKey.startsWith("pk_") && !clerkKey.includes("REPLACE_ME");

const htmlClass = `${geistSans.variable} ${geistMono.variable}`;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={htmlClass}>
      <body className="bg-slate-50 dark:bg-slate-950 min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return clerkConfigured ? (
    <ClerkProvider>
      <Shell>{children}</Shell>
    </ClerkProvider>
  ) : (
    <Shell>{children}</Shell>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Sidebar from "@/components/layout/Sidebar";
import ChatBot from "@/components/ui/ChatBot";
import { DataProvider } from "@/context/DataContext";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FETech Analytics — Retail BI Platform",
  description: "Business intelligence dashboard for retail sales analytics.",
};

// Detect whether real Clerk keys have been provided.
// When keys are missing we render without ClerkProvider so the app
// works in local dev before the user has set up their accounts.
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkConfigured = clerkKey.startsWith("pk_") && !clerkKey.includes("REPLACE_ME");

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <Sidebar />
      <main className="ml-64 min-h-screen flex flex-col">{children}</main>
      <ChatBot />
    </DataProvider>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return clerkConfigured ? (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="bg-slate-50 min-h-screen">
          <AppShell>{children}</AppShell>
        </body>
      </html>
    </ClerkProvider>
  ) : (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-slate-50 min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

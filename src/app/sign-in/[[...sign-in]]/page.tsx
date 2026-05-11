import { SignIn } from "@clerk/nextjs";
import { BarChart3 } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-8 px-4">
      {/* Brand header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-lg font-bold text-white leading-tight">FETech Analytics</p>
          <p className="text-xs text-slate-400 leading-tight">Retail BI Platform</p>
        </div>
      </div>

      <SignIn
        appearance={{
          elements: {
            card: "shadow-2xl",
            headerTitle: "Sign in to FETech Analytics",
          },
        }}
      />
    </div>
  );
}

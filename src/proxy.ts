import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

const CLERK_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkConfigured =
  CLERK_KEY.startsWith("pk_") && !CLERK_KEY.includes("REPLACE_ME");

// Only initialise Clerk's middleware when real keys are present.
// Importing clerkMiddleware without valid keys can throw at module load time
// in production (Vercel), so we gate behind the clerkConfigured flag.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let handler: (req: NextRequest, evt: NextFetchEvent) => any;

if (clerkConfigured) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { clerkMiddleware, createRouteMatcher } = require("@clerk/nextjs/server");
  const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
  handler = clerkMiddleware(
    async (auth: { protect: () => Promise<void> }, request: NextRequest) => {
      if (!isPublicRoute(request)) await auth.protect();
    }
  );
} else {
  handler = () => NextResponse.next();
}

export default handler;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

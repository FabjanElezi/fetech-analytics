import { auth } from "@clerk/nextjs/server";
import { getSql } from "@/lib/db";
import type { DashboardData } from "@/types";

const clerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("REPLACE_ME") &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_");

async function getUserId(): Promise<string | null> {
  if (!clerkConfigured) return null;
  try {
    const { userId } = await auth();
    return userId;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return Response.json({ data: null });

    const sql = getSql();
    if (!sql) return Response.json({ data: null });

    const rows = await sql`
      SELECT data FROM user_dashboards WHERE user_id = ${userId} LIMIT 1
    `;
    return Response.json({ data: rows.length > 0 ? rows[0].data : null });
  } catch {
    return Response.json({ data: null });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const sql = getSql();
    if (!sql) return Response.json({ error: "DB not configured" }, { status: 503 });

    const body: DashboardData = await req.json();

    await sql`
      INSERT INTO user_dashboards (user_id, data, company_name, file_name, updated_at)
      VALUES (
        ${userId},
        ${JSON.stringify(body) as unknown as object},
        ${body.companyName ?? null},
        ${body.fileName ?? null},
        NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        data         = EXCLUDED.data,
        company_name = EXCLUDED.company_name,
        file_name    = EXCLUDED.file_name,
        updated_at   = NOW()
    `;
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const userId = await getUserId();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const sql = getSql();
    if (!sql) return Response.json({ error: "DB not configured" }, { status: 503 });

    await sql`DELETE FROM user_dashboards WHERE user_id = ${userId}`;
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

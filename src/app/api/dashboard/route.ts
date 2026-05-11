import { auth } from "@clerk/nextjs/server";
import { getSql } from "@/lib/db";
import type { DashboardData } from "@/types";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sql = getSql();
    const rows = await sql`
      SELECT data FROM user_dashboards WHERE user_id = ${userId}
    `;
    return Response.json({ data: rows.length > 0 ? rows[0].data : null });
  } catch {
    // DB not configured yet — tell the client to use demo data
    return Response.json({ data: null });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body: DashboardData = await req.json();
  const sql = getSql();

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
}

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getSql();
  await sql`DELETE FROM user_dashboards WHERE user_id = ${userId}`;
  return Response.json({ success: true });
}

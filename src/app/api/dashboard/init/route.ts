import { initDb } from "@/lib/db";

export async function GET() {
  try {
    await initDb();
    return Response.json({ success: true, message: "Table created (or already exists)." });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const SYSTEM_PROMPT = `You are the FETech Analytics assistant — a helpful, concise AI built into a retail Business Intelligence platform.

Your role is to:
- Help users understand their sales, product, customer, and forecast data
- Explain what business metrics mean and why they matter
- Suggest actions based on what the data shows
- Answer technical questions about how the platform works
- Guide users through features (CSV import, insight engine, health score, PDF export, forecasting)

Platform pages:
- Overview: KPI summary, revenue chart, category/region breakdown
- Sales: monthly trends, daily sales, channel & region analysis
- Products: category performance, margin analysis, top products table
- Customers: RFM segmentation, cohort retention heatmap, acquisition trends
- Forecasting: 12-month ETS projection with confidence bands
- Insights: auto-generated report with prioritised recommendations + PDF export
- Import: upload a CSV of orders to replace demo data with real business data

Keep answers short and practical — 2–4 sentences unless a longer explanation is needed.
If the user asks about their specific data, refer to the dashboard context provided.
Never make up numbers that aren't in the context.`;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured. Add it to your environment variables." },
      { status: 503 }
    );
  }

  try {
    const { messages, context } = await req.json();

    const systemWithContext = context
      ? `${SYSTEM_PROMPT}\n\n--- Current Dashboard Data ---\n${context}`
      : SYSTEM_PROMPT;

    const result = streamText({
      model: anthropic("claude-haiku-4-5-20251001"),
      system: systemWithContext,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

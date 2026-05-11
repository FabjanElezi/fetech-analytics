"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Bot, Loader2, Key, ExternalLink, Trash2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import type { DashboardData } from "@/types";
import { cn } from "@/lib/utils";

const LS_KEY = "fetech_anthropic_key";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function buildContext(data: DashboardData): string {
  const totalRevenue = data.monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalPrev = data.monthlyRevenue.reduce((s, m) => s + m.prevYearRevenue, 0);
  const revenueGrowth = totalPrev > 0
    ? (((totalRevenue - totalPrev) / totalPrev) * 100).toFixed(1) : "N/A";
  const totalOrders = data.monthlyRevenue.reduce((s, m) => s + m.orders, 0);
  const totalCustomers = data.customerSegments.reduce((s, c) => s + c.count, 0);
  const atRisk = data.customerSegments.find((s) => s.segment === "At-Risk");
  const topCat = [...data.categoryPerformance].sort((a, b) => b.revenue - a.revenue)[0];
  const topRegion = [...data.salesByRegion].sort((a, b) => b.growth - a.growth)[0];
  const avgMargin = data.categoryPerformance.length > 0
    ? (data.categoryPerformance.reduce((s, c) => s + c.avgMargin, 0) / data.categoryPerformance.length).toFixed(1)
    : "N/A";

  return [
    `Period: ${data.period}`,
    `Company: ${data.isCustomData ? (data.companyName ?? "Custom") : "Demo Data"}`,
    `Total Revenue: $${(totalRevenue / 1_000_000).toFixed(2)}M (${revenueGrowth}% YoY)`,
    `Total Orders: ${totalOrders.toLocaleString()}`,
    `Total Customers: ${totalCustomers.toLocaleString()}`,
    atRisk ? `At-Risk Customers: ${atRisk.count.toLocaleString()}` : null,
    topCat ? `Top Category: ${topCat.category} ($${(topCat.revenue / 1_000_000).toFixed(2)}M, ${topCat.avgMargin}% margin)` : null,
    topRegion ? `Fastest-Growing Region: ${topRegion.region} (+${topRegion.growth}% YoY)` : null,
    `Avg Gross Margin: ${avgMargin}%`,
    `Forecast Next Year: $${(data.forecastSummary.projectedNextAnnual / 1_000_000).toFixed(2)}M`,
    `Forecast MAPE: ${data.forecastMetrics.mape}%`,
  ].filter(Boolean).join("\n");
}

const SUGGESTIONS = [
  "What should I do about at-risk customers?",
  "Which category has the best margin?",
  "How do I upload my own data?",
  "What does the health score measure?",
  "How accurate is the revenue forecast?",
];

function KeySetupScreen({ onSave }: { onSave: (key: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed.startsWith("sk-ant-")) {
      setError("Key must start with sk-ant-");
      return;
    }
    onSave(trimmed);
  }

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
          <Key className="h-4 w-4 text-indigo-600" />
        </div>
        <p className="text-sm font-semibold text-slate-800">Connect your Anthropic key</p>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        The AI assistant uses Claude AI. Paste your own API key — it is saved only in your browser and never shared.
      </p>

      <a
        href="https://console.anthropic.com/settings/keys"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline"
      >
        <ExternalLink className="h-3 w-3" />
        Get a free key at console.anthropic.com
      </a>

      <form onSubmit={submit} className="space-y-2">
        <input
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(""); }}
          placeholder="sk-ant-..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={!value.trim()}
          className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
        >
          Save & Start Chatting
        </button>
      </form>

      <p className="text-[10px] text-slate-400 leading-relaxed">
        Your key is stored in your browser&apos;s localStorage. Usage is billed directly to your Anthropic account at ~$0.001 per conversation.
      </p>
    </div>
  );
}

export default function ChatBot() {
  const { data } = useData();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKeyReset, setShowKeyReset] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load saved key on mount
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) setApiKey(saved);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function saveKey(key: string) {
    localStorage.setItem(LS_KEY, key);
    setApiKey(key);
    setShowKeyReset(false);
  }

  function clearKey() {
    localStorage.removeItem(LS_KEY);
    setApiKey(null);
    setMessages([]);
    setShowKeyReset(false);
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming || !apiKey) return;

    const context = buildContext(data);
    const history: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(history);
    setInput("");
    setStreaming(true);
    setMessages([...history, { role: "assistant", content: "" }]);

    try {
      abortRef.current = new AbortController();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, context, apiKey }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        if (err.error === "NO_KEY") {
          // Key was rejected server-side — clear it so user can re-enter
          clearKey();
          return;
        }
        setMessages([...history, { role: "assistant", content: `Error: ${err.error ?? "Something went wrong."}` }]);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: accumulated }]);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setMessages([...history, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  const showSetup = !apiKey || showKeyReset;

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        data-print-hide
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200",
          open ? "bg-slate-700 hover:bg-slate-600" : "bg-indigo-600 hover:bg-indigo-700"
        )}
        aria-label="Toggle AI assistant"
      >
        {open
          ? <X className="h-6 w-6 text-white" />
          : <MessageCircle className="h-6 w-6 text-white" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          data-print-hide
          className="fixed bottom-24 right-6 z-50 flex flex-col w-[360px] max-h-[560px] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight">FETech Assistant</p>
              <p className="text-[11px] text-indigo-200 leading-tight">Powered by Claude AI</p>
            </div>
            {apiKey && !showKeyReset && (
              <button
                onClick={() => setShowKeyReset(true)}
                title="Change API key"
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5 text-indigo-200" />
              </button>
            )}
          </div>

          {/* Key setup screen */}
          {showSetup ? (
            <div className="flex-1 overflow-y-auto">
              {showKeyReset && (
                <div className="px-5 pt-4 pb-0">
                  <button
                    onClick={() => setShowKeyReset(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    ← Back to chat
                  </button>
                </div>
              )}
              <KeySetupScreen onSave={saveKey} />
              {apiKey && (
                <div className="px-5 pb-5">
                  <button
                    onClick={clearKey}
                    className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                  >
                    Remove saved key
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="h-7 w-7 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                        <Bot className="h-3.5 w-3.5 text-indigo-600" />
                      </div>
                      <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-slate-700 max-w-[260px]">
                        Hi! I can explain your dashboard data, answer questions about business metrics, or guide you through the platform.
                      </div>
                    </div>
                    <div className="pl-9 flex flex-col gap-1.5">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="text-left text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-full px-3 py-1.5 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {m.role === "assistant" && (
                      <div className="h-7 w-7 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                        <Bot className="h-3.5 w-3.5 text-indigo-600" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2.5 text-sm max-w-[260px] leading-relaxed whitespace-pre-wrap break-words",
                        m.role === "user"
                          ? "bg-indigo-600 text-white rounded-tr-sm"
                          : "bg-slate-100 text-slate-700 rounded-tl-sm"
                      )}
                    >
                      {m.content || (
                        streaming && i === messages.length - 1
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                          : null
                      )}
                    </div>
                  </div>
                ))}

                <div ref={bottomRef} />
              </div>

              {/* Input bar */}
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex items-center gap-2 px-3 py-3 border-t border-slate-100 shrink-0"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about your data…"
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={streaming || !input.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

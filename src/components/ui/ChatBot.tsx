"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useData } from "@/context/DataContext";
import { getChatResponse } from "@/lib/chatEngine";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What should I improve first?",
  "How are my customers segmented?",
  "Which category has the best margin?",
  "What does my forecast look like?",
  "How do I upload my own data?",
];

export default function ChatBot() {
  const { data } = useData();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    const userMsg: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    // Small delay so the UI feels responsive rather than instant
    setTimeout(() => {
      const reply = getChatResponse(trimmed, data);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setThinking(false);
    }, 400);
  }

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
          className="fixed bottom-24 right-6 z-50 flex flex-col w-[360px] max-h-[560px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">FETech Assistant</p>
              <p className="text-[11px] text-indigo-200 leading-tight">Ask about your data or the platform</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {/* Welcome + suggestions */}
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="h-7 w-7 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-200 max-w-[260px]">
                    Hi! Ask me about your revenue, customers, margins, forecast — or how to use any part of the platform.
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

            {/* Message history */}
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
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm"
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {thinking && (
              <div className="flex gap-2">
                <div className="h-7 w-7 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-3.5 py-3">
                  <span className="flex gap-1 items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 px-3 py-3 border-t border-slate-100 dark:border-slate-700 shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your data…"
              className="flex-1 rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-600 transition-colors"
            />
            <button
              type="submit"
              disabled={thinking || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

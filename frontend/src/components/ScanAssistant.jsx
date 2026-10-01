import { useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { sendChatMessage } from "../api/client.js";

const MODES = [
  ["simple", "Simple"],
  ["technical", "Technical"],
  ["clinical_research", "Clinical / Research"],
];

const MODE_HELP = {
  simple: "Easy explanation with minimal ML/XAI jargon.",
  technical: "Deeper ML/XAI explanation using model, attribution, gradient and feature terminology.",
  clinical_research: "Research-oriented interpretation focused on evidence, uncertainty and limitations — not diagnosis or treatment.",
};

const SUGGESTIONS = [
  "Explain this scan result.",
  "What does the confidence mean?",
  "Explain the Grad-CAM result.",
  "How do Integrated Gradients and SHAP differ?",
];

export default function ScanAssistant({ scanId }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("simple");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!scanId) return null;

  async function ask(question) {
    const text = question.trim();
    if (!text || loading) return;

    const previous = messages.slice(-6);
    const nextUser = { role: "user", content: text };
    setMessages((items) => [...items, nextUser]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const data = await sendChatMessage(scanId, text, mode, previous);
      setMessages((items) => [
        ...items,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources || [],
        },
      ]);
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.message ||
          data?.error ||
          "The NeuroScan XAI Assistant is temporarily unavailable."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    ask(input);
  }

  return (
    <section className="rounded-2xl border border-brand-400/15 bg-[#07131c]/90">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-400/20 bg-brand-500/[0.07]">
            <Bot size={19} className="text-brand-400" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-brand-400">
              Scan-Aware Assistant
            </p>
            <h2 className="mt-1 text-base font-semibold text-slate-100">
              Ask NeuroScan XAI
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Explore this model prediction and its XAI outputs.
            </p>
          </div>
        </div>
        {open ? <X size={18} className="text-slate-500" /> : <Sparkles size={18} className="text-brand-400" />}
      </button>

      {open && (
        <div className="border-t border-sky-400/10 p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {MODES.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  mode === value
                    ? "border-brand-400/30 bg-brand-500/10 text-brand-300"
                    : "border-white/[0.08] text-slate-500 hover:text-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mb-4 rounded-xl border border-brand-400/10 bg-brand-500/[0.025] px-3.5 py-2.5">
            <p className="text-xs leading-5 text-slate-400">
              <span className="font-semibold text-brand-300">
                {MODES.find(([value]) => value === mode)?.[1]} mode:
              </span>{" "}
              {MODE_HELP[mode]}
            </p>
          </div>

          {messages.length === 0 && (
            <div className="mb-4 grid gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => ask(question)}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-left text-xs leading-5 text-slate-400 transition hover:border-brand-400/20 hover:text-slate-200"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {messages.length > 0 && (
            <div className="mb-4 max-h-[360px] space-y-3 overflow-y-auto rounded-xl border border-white/[0.06] bg-[#041018]/70 p-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[90%] rounded-xl px-3.5 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "ml-auto bg-brand-500/10 text-slate-200"
                      : "border border-white/[0.06] bg-white/[0.025] text-slate-300"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.role === "assistant" && message.sources?.length > 0 && (
                    <p className="mt-2 text-[10px] text-slate-600">
                      Available evidence: {message.sources.join(" · ")}
                    </p>
                  )}
                </div>
              ))}
              {loading && (
                <div className="text-xs text-slate-500">
                  NeuroScan XAI Assistant is interpreting the available evidence...
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mb-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] px-3 py-2.5 text-xs leading-5 text-amber-200/80">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={4000}
              disabled={loading}
              placeholder="Ask about this prediction or its XAI evidence..."
              className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-[#041018] px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-brand-400/30 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary px-4"
              aria-label="Send question"
            >
              <Send size={17} />
            </button>
          </form>

          <p className="mt-3 text-[10px] leading-4 text-slate-600">
            Explains model and XAI outputs for research use. It does not provide an independent clinical diagnosis or treatment recommendation.
          </p>
        </div>
      )}
    </section>
  );
}

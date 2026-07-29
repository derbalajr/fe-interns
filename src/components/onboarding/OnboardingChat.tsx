import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, RotateCcw, X } from "lucide-react";

import { startNewChat, streamChat } from "@/api/onboarding-agent";
import type { ChatMessage, FloorMap } from "@/types/onboarding-agent";

const SUGGESTIONS = [
  "Where is HR?",
  "How do I get to Finance?",
  "Where are the meeting rooms?",
];

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

export function OnboardingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  const patchMessage = (id: string, patch: Partial<ChatMessage>) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );
  };

  const send = async (prompt: string) => {
    const text = prompt.trim();
    if (!text || isStreaming) return;

    setError(null);
    setInput("");

    const assistantId = newId();
    setMessages((prev) => [
      ...prev,
      { id: newId(), role: "user", content: text },
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setIsStreaming(true);

    try {
      await streamChat(text, {
        onToken: (content) =>
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + content } : m,
            ),
          ),
        onFloorMap: (map: FloorMap) =>
          patchMessage(assistantId, { floorMap: map }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      // Drop the empty assistant bubble if nothing streamed in.
      setMessages((prev) =>
        prev.filter((m) => !(m.id === assistantId && m.content === "")),
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleNewChat = async () => {
    if (isStreaming) return;
    try {
      await startNewChat();
    } catch {
      // Even if the server call fails, clear the local view.
    }
    setMessages([]);
    setError(null);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open onboarding assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:bg-slate-700"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[560px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <p className="text-sm font-bold text-slate-900">
            Onboarding Assistant
          </p>
          <p className="text-xs text-slate-500">
            Ask about floors & departments
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleNewChat}
            disabled={isStreaming}
            aria-label="Start a new chat"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
      >
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500">
              Hi! Ask me where to find a team or a room in the building.
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:bg-slate-100"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            <div
              className={`max-w-[85%] space-y-2 rounded-2xl px-3 py-2 text-sm ${
                m.role === "user"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              {m.floorMap && (
                <img
                  src={m.floorMap.url}
                  alt={`Route to ${m.floorMap.destination}`}
                  className="w-full rounded-lg border border-slate-200 bg-white"
                />
              )}
              {m.content ? (
                <p className="whitespace-pre-wrap">{m.content}</p>
              ) : (
                m.role === "assistant" && (
                  <p className="text-slate-400">Thinking…</p>
                )
              )}
            </div>
          </div>
        ))}

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-slate-200 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          disabled={isStreaming}
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 disabled:bg-slate-50"
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          aria-label="Send"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-700 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

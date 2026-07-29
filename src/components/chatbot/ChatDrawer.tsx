import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, User, X } from "lucide-react";

import { streamChat } from "@/api/chat-agent";
import type { FloorMap } from "@/types/chat-agent";

type ChatDrawerProps = {
  open: boolean;
  onClose: () => void;
};

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  floorMap?: FloorMap;
};

const suggestedPrompts = [
  "Show today's deals",
  "Create a new lead",
  "Summarize my pipeline",
  "What follow-ups are overdue?",
];

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

export function ChatDrawer({ open, onClose }: ChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || isStreaming) return;

    const assistantId = newId();
    setMessages((prev) => [
      ...prev,
      { id: newId(), role: "user", content: value },
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setIsStreaming(true);

    try {
      await streamChat(value, {
        onToken: (content) =>
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + content } : m,
            ),
          ),
        onFloorMap: (map: FloorMap) =>
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, floorMap: map } : m,
            ),
          ),
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Sorry, something went wrong. Please try again.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: m.content || message } : m,
        ),
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[90] bg-black/20 backdrop-blur-[2px] transition-all duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-4 top-4 bottom-4 z-[100] flex w-[420px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[28px] border border-[#e7e7e7] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.18)] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-[110%]"
        }`}
      >
        {/* Header */}
        <header className="flex h-[72px] items-center justify-between border-b border-[#efefef] px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ece7dc]">
              <Sparkles className="h-5 w-5 text-[#8d7550]" />
            </div>

            <div>
              <h2 className="font-semibold text-[#202020]">Ask Keystone</h2>
              <p className="text-xs text-[#777]">AI CRM Assistant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-[#f5f5f5]"
          >
            <X size={18} />
          </button>
        </header>

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5">
            {messages.length === 0 ? (
              <>
                <div className="mt-8 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f6f3ed]">
                    <Bot className="text-[#8d7550]" size={30} />
                  </div>

                  <h3 className="text-xl font-semibold">
                    Welcome to Keystone AI
                  </h3>

                  <p className="mt-2 text-sm text-[#777]">
                    Ask anything about your CRM.
                  </p>
                </div>

                <div className="mt-10">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#999]">
                    Suggested prompts
                  </p>

                  <div className="space-y-3">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="w-full rounded-2xl border border-[#ececec] p-4 text-left text-sm transition hover:border-[#d6d6d6] hover:bg-[#fafafa]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[85%] gap-3 ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ececec]">
                        {message.role === "assistant" ? (
                          <Bot size={18} />
                        ) : (
                          <User size={18} />
                        )}
                      </div>

                      <div
                        className={`space-y-2 rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          message.role === "assistant"
                            ? "bg-[#f5f5f5]"
                            : "bg-[#1c2541] text-white"
                        }`}
                      >
                        {message.floorMap && (
                          <img
                            src={message.floorMap.url}
                            alt={`Route to ${message.floorMap.destination}`}
                            className="w-full rounded-lg border border-[#e5e5e5] bg-white"
                          />
                        )}
                        {message.content ? (
                          <p className="whitespace-pre-wrap">
                            {message.content}
                          </p>
                        ) : (
                          message.role === "assistant" && (
                            <p className="text-[#999]">Thinking…</p>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[#efefef] bg-white p-5">
            <div className="flex items-center gap-3 rounded-2xl border border-[#e5e5e5] bg-[#fafafa] px-4 py-3">
              <input
                ref={inputRef}
                value={input}
                disabled={isStreaming}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder={isStreaming ? "Thinking..." : "Ask Keystone..."}
                className="flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />

              <button
                onClick={() => sendMessage()}
                disabled={isStreaming || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1c2541] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

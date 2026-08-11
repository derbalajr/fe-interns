import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, User, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { IntelApiError, postChat } from "@/api/intelApi";

type ChatDrawerProps = {
  open: boolean;
  onClose: () => void;
};

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const CHAT_TURNS_KEY = "intel-chat-turns";
const CHAT_CONVERSATION_KEY = "intel-chat-conversation-id";

const suggestedPrompts = [
  "What are the hottest market zones right now?",
  "Show recent launch activity",
  "What is the price trend in New Cairo?",
  "Summarize tomorrow's market news",
];

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

function readStoredChat<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function ChatDrawer({ open, onClose }: ChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>(() =>
    readStoredChat<Message[]>(CHAT_TURNS_KEY) ?? [],
  );
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>(() =>
    readStoredChat<string>(CHAT_CONVERSATION_KEY) ?? undefined,
  );
  const [intelAgentDown, setIntelAgentDown] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.localStorage.getItem("intel-agent-down"));
  });

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CHAT_TURNS_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (conversationId) {
      window.localStorage.setItem(CHAT_CONVERSATION_KEY, conversationId);
    } else {
      window.localStorage.removeItem(CHAT_CONVERSATION_KEY);
    }
  }, [conversationId]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "intel-agent-down") {
        setIntelAgentDown(Boolean(e.newValue));
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const chat = useMutation({
    mutationFn: (message: string) => postChat(message, conversationId),
    onSuccess: (res) => {
      try {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("intel-agent-down");
        }
      } catch {
        /* ignore */
      }
      setConversationId(res.conversation_id);
      setMessages((prev) => [...prev, { id: newId(), role: "assistant", content: res.reply }]);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      });
    },
    onError: (err) => {
      const status = err instanceof IntelApiError ? err.status : 0;
      const assistantMessage =
        status === 503
          ? "The assistant is currently unavailable. Please try again later."
          : status === 504
          ? "That question took too long. Try narrowing the request."
          : status === 502
          ? "The assistant hit an error. Please try again."
          : "Something went wrong reaching the assistant. Please try again.";

      if (status === 503) {
        setIntelAgentDown(true);
        try {
          if (typeof window !== "undefined") {
            window.localStorage.setItem("intel-agent-down", "1");
          }
        } catch {
          /* ignore */
        }
      }

      setMessages((prev) => [...prev, { id: newId(), role: "assistant", content: assistantMessage }]);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      });
    },
  });

  const sendMessage = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || chat.isPending || intelAgentDown) return;

    setMessages((prev) => [...prev, { id: newId(), role: "user", content: value }]);
    setInput("");
    chat.mutate(value);
  };

  return (
    <>
      <aside
        className={`fixed right-4 top-4 bottom-4 z-[100] flex w-[min(95vw,560px)] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[28px] border border-[#e7e7e7] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.18)] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-[110%]"
        } max-h-[calc(100vh-2rem)]`}
      >
        {/* Header */}
        <header className="flex h-[72px] items-center justify-between border-b border-[#efefef] px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ece7dc]">
              <Sparkles className="h-5 w-5 text-[#8d7550]" />
            </div>

            <div>
              <h2 className="font-semibold text-[#202020]">Ask the market</h2>
              <p className="text-xs text-[#777]">Market intelligence assistant</p>
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
          <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
            {intelAgentDown && (
              <div className="mb-4 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
                The market assistant is currently unavailable. Please try again later.
              </div>
            )}
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
                        disabled={intelAgentDown}
                        className={`w-full rounded-2xl border border-[#ececec] p-4 text-left text-sm transition hover:border-[#d6d6d6] hover:bg-[#fafafa] ${
                          intelAgentDown ? "opacity-50 pointer-events-none" : ""
                        }`}
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
                disabled={chat.isPending || intelAgentDown}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder={
                  intelAgentDown ? "Assistant offline" : chat.isPending ? "Thinking..." : "Ask the market..."
                }
                className="flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />

              <button
                onClick={() => sendMessage()}
                disabled={chat.isPending || !input.trim() || intelAgentDown}
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

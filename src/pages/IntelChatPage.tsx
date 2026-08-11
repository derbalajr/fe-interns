// Launch Intelligence — Assistant (MARQ tenant).
//
// Guide, section 8. Rules baked in:
//   - Echo `conversation_id` back on every follow-up or each turn starts fresh.
//   - No streaming; a turn takes several seconds (the assistant writes SQL, runs
//     it, then answers). Show a typing indicator.
//   - Failure modes are distinct: 504 = looped (suggest a narrower question,
//     retrying verbatim won't help), 502 = crashed (retry is reasonable),
//     503 = agent not loaded (disable the entry point).
//   - Replies are a research aid, not a figure to forward to a client unchecked.

import { useMutation } from "@tanstack/react-query";
import { SendHorizonal } from "lucide-react";
import { useRef, useState } from "react";

import { IntelApiError, postChat } from "@/api/intelApi";
import { IntelTabs } from "@/components/intel/IntelTabs";
import { PageHeader } from "@/components/PageHeader";

type Turn = { role: "user" | "assistant"; text: string };

const MAX_LEN = 2000;

export function IntelChatPage() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [agentDown, setAgentDown] = useState(false); // 503 → disable entry point.
  const scrollRef = useRef<HTMLDivElement>(null);

  const chat = useMutation({
    mutationFn: (message: string) => postChat(message, conversationId),
    onSuccess: (res) => {
      setConversationId(res.conversation_id);
      setTurns((t) => [...t, { role: "assistant", text: res.reply }]);
      scrollToEnd();
    },
    onError: (err) => {
      const status = err instanceof IntelApiError ? err.status : 0;
      let text: string;
      if (status === 503) {
        setAgentDown(true);
        text = "The assistant is currently unavailable. Please try again later.";
      } else if (status === 504) {
        text =
          "That question took too long to answer. Try narrowing it — asking the same thing again usually won’t help.";
      } else if (status === 502) {
        text = "The assistant hit an error. You can try sending that again.";
      } else {
        text = "Something went wrong reaching the assistant. Please try again.";
      }
      setTurns((t) => [...t, { role: "assistant", text }]);
      scrollToEnd();
    },
  });

  function scrollToEnd() {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }

  function send() {
    const message = input.trim();
    if (!message || chat.isPending || agentDown) return;
    setTurns((t) => [...t, { role: "user", text: message }]);
    setInput("");
    chat.mutate(message);
    scrollToEnd();
  }

  return (
    <section className="space-y-6">
      <IntelTabs />
      <PageHeader
        title="Ask the market"
        description="Natural-language questions over the tracked market. Answers are a research aid — verify before sharing with a client."
      />

      <div className="flex h-[60vh] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto p-5"
        >
          {turns.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-slate-400">
              <p>Ask about developers, zones, launches, or prices.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "Which developers launched in New Cairo this month?",
                  "Cheapest projects in El Sheikh Zayed?",
                  "Which zones have the most launches?",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={agentDown}
                    onClick={() => setInput(s)}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            turns.map((turn, i) => (
              <div
                key={i}
                className={`flex ${
                  turn.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                    turn.role === "user"
                      ? "bg-[#1c2541] text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {turn.text}
                </div>
              </div>
            ))
          )}

          {chat.isPending ? (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-400">
                <span className="inline-flex gap-1">
                  <Dot /> <Dot /> <Dot />
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-slate-100 p-3">
          {agentDown ? (
            <p className="py-2 text-center text-sm text-slate-400">
              The assistant is offline. The rest of the dashboard is unaffected.
            </p>
          ) : (
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_LEN))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Ask a question…"
                className="max-h-32 flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:border-[#8d7550] focus:outline-none"
              />
              <button
                type="button"
                onClick={send}
                disabled={!input.trim() || chat.isPending}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1c2541] text-white transition hover:opacity-90 disabled:opacity-40"
                aria-label="Send"
              >
                <SendHorizonal size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return (
    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" />
  );
}

// Streaming client for the AI chat agent (POST /chat/stream, SSE).
//
// Gotchas this file follows (from the AI team's integration guide):
//   - EventSource can't be used (POST + optional Authorization header), so we
//     stream with fetch + a ReadableStream reader.
//   - An SSE event can be split across network reads, so we buffer and only
//     parse complete events (separated by a blank line).
//   - credentials: "include" carries the httpOnly session/thread cookies that
//     hold the conversation — send it on every call, or each message starts a
//     brand-new conversation with no memory.

import type { ChatStreamEvent, FloorMap } from "@/types/chat-agent";

// Static default so production works with no env var. Override with
// VITE_CHAT_API_BASE only for local dev or a different deployment.
const DEFAULT_CHAT_API_BASE = "http://10.10.67.51:8000";

const API_BASE = (
  import.meta.env.VITE_CHAT_API_BASE || DEFAULT_CHAT_API_BASE
).replace(/\/$/, "");
const API_TOKEN = import.meta.env.VITE_CHAT_API_TOKEN;

// The bearer token is optional: local deployments run with
// ALLOW_UNAUTHENTICATED=true, so we only send Authorization when it's set.
function authHeaders(): Record<string, string> {
  return API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {};
}

type StreamHandlers = {
  onToken: (content: string) => void;
  onFloorMap: (map: FloorMap) => void;
  signal?: AbortSignal;
};

export type StreamResult = { session_id: string; thread_id: string };

/**
 * Stream a reply from POST /chat/stream. Resolves with the session/thread ids
 * on the "done" event; rejects on an "error" event or a non-2xx status. Tokens
 * and the (optional, at-most-once) floor map arrive via the handlers.
 */
export async function streamChat(
  prompt: string,
  { onToken, onFloorMap, signal }: StreamHandlers,
): Promise<StreamResult> {
  const base = API_BASE;

  const res = await fetch(`${base}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    credentials: "include", // REQUIRED — carries the conversation cookies
    body: JSON.stringify({ prompt }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`Chat failed: ${res.status}`);
  }
  if (!res.body) {
    throw new Error("Streaming is not supported in this browser.");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Events are separated by a blank line. Keep the trailing partial chunk
      // in the buffer — a network packet can split an event in half.
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const line = event.split("\n").find((l) => l.startsWith("data: "));
        if (!line) continue;

        const payload = JSON.parse(line.slice(6)) as ChatStreamEvent;

        if (payload.type === "token") {
          onToken(payload.content);
        } else if (payload.type === "floor_map") {
          onFloorMap({ type: "floor_map", ...payload });
        } else if (payload.type === "error") {
          throw new Error(payload.detail);
        } else if (payload.type === "done") {
          return {
            session_id: payload.session_id,
            thread_id: payload.thread_id,
          };
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  throw new Error("The stream ended before a 'done' event.");
}

/** Clear the conversation cookies so the next message starts a new thread. */
export async function startNewChat(): Promise<void> {
  const base = API_BASE;

  const res = await fetch(`${base}/new-chat`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to start a new chat: ${res.status}`);
  }
}

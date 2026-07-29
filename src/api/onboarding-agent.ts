// Client for the onboarding-agent API.
//
// Notes from the integration guide that this file deliberately follows:
//   - EventSource can't be used (POST + Authorization header), so we stream
//     with fetch + a ReadableStream reader.
//   - An SSE event can be split across network reads, so we buffer and only
//     parse complete events (separated by a blank line).
//   - credentials: "include" MUST be sent on every call — the conversation
//     lives in httpOnly session/thread cookies. Miss it and every message
//     starts a fresh, memoryless conversation.
//   - The shared bearer token is exposed to the browser. Fine for the internal
//     demo; do NOT ship it in a public build.

import type { ChatStreamEvent, FloorMap } from "@/types/onboarding-agent";

const API_BASE = import.meta.env.VITE_ONBOARDING_API_BASE?.replace(/\/$/, "");
const API_TOKEN = import.meta.env.VITE_ONBOARDING_API_TOKEN;

function requireConfig(): { base: string; token: string } {
  if (!API_BASE || !API_TOKEN) {
    throw new Error(
      "Onboarding agent is not configured. Set VITE_ONBOARDING_API_BASE and VITE_ONBOARDING_API_TOKEN.",
    );
  }
  return { base: API_BASE, token: API_TOKEN };
}

type StreamHandlers = {
  onToken: (content: string) => void;
  onFloorMap: (map: FloorMap) => void;
  signal?: AbortSignal;
};

export type StreamResult = { session_id: string; thread_id: string };

/**
 * Stream a reply from POST /chat/stream. Resolves with the session/thread ids
 * once the "done" event arrives; rejects on an "error" event or a non-2xx
 * status. Tokens and the (optional, at-most-once) floor map are delivered via
 * the handlers as they arrive.
 */
export async function streamChat(
  prompt: string,
  { onToken, onFloorMap, signal }: StreamHandlers,
): Promise<StreamResult> {
  const { base, token } = requireConfig();

  const res = await fetch(`${base}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
  const { base, token } = requireConfig();

  const res = await fetch(`${base}/new-chat`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to start a new chat: ${res.status}`);
  }
}

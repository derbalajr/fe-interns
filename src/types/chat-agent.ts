// Types for the AI chat agent (streaming chat + floor-map navigation).
// See the AI team's frontend integration guide for the contract.

export type FloorMap = {
  type: "floor_map";
  destination: string;
  url: string;
  route: string;
};

// One SSE event from POST /chat/stream.
export type ChatStreamEvent =
  | { type: "token"; content: string }
  | ({ type: "floor_map" } & Omit<FloorMap, "type">)
  | { type: "done"; session_id: string; thread_id: string }
  | { type: "error"; detail: string };

// A rendered chat message in the UI.
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  floorMap?: FloorMap;
};

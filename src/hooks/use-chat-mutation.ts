import { useMutation } from "@tanstack/react-query";

export type ChatRequest = {
  question: string;
};

export type ChatResponse = {
  answer: string;
};

export function useChatMutation() {
  return useMutation({
    mutationFn: async (
      request: ChatRequest
    ): Promise<ChatResponse> => {
      // TODO: Replace with AI team's chatbot endpoint.
      await new Promise((resolve) => setTimeout(resolve, 1200));

      return {
        answer:
          "This is a mock response. Once the AI chatbot endpoint is available, this hook will call it and return the real answer.",
      };
    },
  });
}
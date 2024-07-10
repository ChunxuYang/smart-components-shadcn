import { streamText } from "ai";

import { anthropic } from "@ai-sdk/anthropic";

export const runtime = "edge";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic("claude-3-haiku-20240307"),
    messages,
  });

  return result.toAIStreamResponse();
}

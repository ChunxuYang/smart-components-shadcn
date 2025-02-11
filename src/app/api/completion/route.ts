import { StreamingTextResponse, streamText } from "ai";

import { anthropic } from "@ai-sdk/anthropic";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = await streamText({
    model: anthropic("claude-3-haiku-20240307"),
    prompt,
  });

  return new StreamingTextResponse(result.toAIStream());
}

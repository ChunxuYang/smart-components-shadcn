import { generateObject, streamObject } from "ai";

import { anthropic } from "@ai-sdk/anthropic";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { schema, prompt } = await req.json();

  return await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema,
    prompt,
  });
}

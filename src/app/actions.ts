"use server";

import { generateObject } from "ai";
import { z } from "zod";
import { dezerialize, Zerialize } from "zodex";

import { anthropic } from "@ai-sdk/anthropic";

export async function smartFill(
  serialized_schema: Zerialize<z.ZodObject<any, any>>,
  text: string
) {
  const schema = dezerialize(serialized_schema);
  const { object } = await generateObject({
    schema,
    model: anthropic("claude-3-haiku-20240307"),
    system:
      "Fill the form with the data passed. If any field is missing, please leave it undefined.",
    prompt: text,
  });

  return object;
}

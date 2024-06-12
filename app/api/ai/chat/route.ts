import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, context } = await req.json();
console.log(context)
  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages: [...context, ...messages],
  });

  return result.toAIStreamResponse();
}

import { openai } from "@/clients/openai/openai-client";
import { IntelligentAnswer } from "@/state/types";
import { mapIntelligentAnswer } from "./openai-mappers";

export function storeOpenAIApiKey(apiKey: string | undefined): void {
  openai.apiKey = apiKey || "";
}

export function removeOpenAIApiKey(): void {
  storeOpenAIApiKey(undefined);
}

export async function testAndSetOpenAIApiKey(apiKey: string): Promise<boolean> {
  try {
    storeOpenAIApiKey(apiKey);
    await openai.models.list();
    return true;
  } catch {
    removeOpenAIApiKey();
    return false;
  }
}

export async function askAI(prompt: string): Promise<IntelligentAnswer[]> {
  if (!openai.apiKey) {
    throw new Error("OpenAI API key is not set");
  }
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 100, // TODO
  });

  // Filter out incomplete answers
  return mapIntelligentAnswer(response.choices.filter((c) => c.finish_reason === "stop"));
}

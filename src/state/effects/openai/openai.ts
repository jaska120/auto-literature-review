import { openai } from "@/clients/openai/openai-client";

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

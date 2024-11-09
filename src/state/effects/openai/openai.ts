import { openai } from "@/clients/openai/openai-client";
import {
  EvaluateLiteratureIntelligentAnswer,
  IntelligentAnswer,
  LiteratureMetadata,
  SearchStringIntelligentAnswer,
} from "@/state/types";
import {
  mapEvaluateLiteratureIntelligentAnswer,
  mapIntelligentAnswer,
  mapSearchStringIntelligentAnswer,
} from "./openai-mappers";
import { searchStringSystemPrompt } from "./search-string-system-prompt";
import { evaluateLiteratureSystemPrompt } from "./evaluate-literature-system-prompt";

export function registerOpenAIApiKey(apiKey: string | undefined): void {
  openai.apiKey = apiKey || "";
}

export function deRegisterOpenAIApiKey(): void {
  registerOpenAIApiKey(undefined);
}

export async function testAndRegisterOpenAIApiKey(apiKey: string): Promise<boolean> {
  try {
    registerOpenAIApiKey(apiKey);
    await openai.models.list();
    return true;
  } catch {
    deRegisterOpenAIApiKey();
    return false;
  }
}

async function askAI(systemPrompt: string, prompt: string): Promise<IntelligentAnswer[]> {
  if (!openai.apiKey) {
    throw new Error("OpenAI API key is not set");
  }
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    max_tokens: 1000,
  });

  // Filter out incomplete answers
  return mapIntelligentAnswer(response.choices.filter((c) => c.finish_reason === "stop"));
}

export async function askAIForSearchString(prompt: string): Promise<SearchStringIntelligentAnswer> {
  const results = await askAI(searchStringSystemPrompt, prompt);
  return mapSearchStringIntelligentAnswer(results);
}

export async function askAIForLiteratureEvaluation(
  prompt: string
): Promise<EvaluateLiteratureIntelligentAnswer> {
  const results = await askAI(evaluateLiteratureSystemPrompt, prompt);
  return mapEvaluateLiteratureIntelligentAnswer(results);
}

export function generateLiteratureEvaluationPrompt(
  metadata: LiteratureMetadata,
  prompt: string
): string {
  return `
    Given the following paper:

    Title: ${metadata.title}
    Authors: ${metadata.authors.join(",")}
    Keywords: ${metadata.keywords.join(",")}
    Abstract: ${metadata.abstract}
    Published: ${metadata.publishDate?.toLocaleDateString() || "Unknown"}
    Publication: ${metadata.publication}
    ---

    ${prompt}
  `;
}

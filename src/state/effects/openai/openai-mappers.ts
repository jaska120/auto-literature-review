import { IntelligentAnswer, SearchStringIntelligentAnswer } from "@/state/types";
import type { ChatCompletion } from "openai/resources/index.mjs";

export function mapIntelligentAnswer(results: ChatCompletion.Choice[]): IntelligentAnswer[] {
  return results.map((c) => ({ answer: c.message.content || "" }));
}

export function mapSearchStringIntelligentAnswer(
  results: IntelligentAnswer[]
): SearchStringIntelligentAnswer[] {
  return results.map((r) => {
    // Regular expression to find content within <S></S> tags
    const regex = /<S>(.*?)<\/S>/g;
    const matches = r.answer.match(regex);

    // Check if there are exactly one match
    if (!matches || matches.length !== 1) {
      throw new Error("Error: There must be exactly one <S>...</S> tag.");
    }

    // Extract the content, removing the tags
    const answer = r.answer.replace(/<\/?[^>]+>/g, "").trim();
    const searchString = matches[0].replace(/<\/?S>/g, "").trim();

    return { answer, searchString };
  });
}

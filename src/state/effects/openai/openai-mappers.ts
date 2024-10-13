import { IntelligentAnswer } from "@/state/types";
import type { ChatCompletion } from "openai/resources/index.mjs";

export function mapIntelligentAnswer(results: ChatCompletion.Choice[]): IntelligentAnswer[] {
  return results.map((c) => ({ answer: c.message.content || "" }));
}

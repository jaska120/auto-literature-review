import {
  EvaluateLiteratureIntelligentAnswer,
  IntelligentAnswer,
  SearchStringIntelligentAnswer,
} from "@/state/types";
import type { ChatCompletion } from "openai/resources/index.mjs";

/**
 * Extracts annotation from content
 * @param content Content to extract annotation from
 * @param annotation Annotation to extract
 * @returns Annotation content
 * @throws Error if there are no matches or more than one match
 * @example
 * extractAnnotation("<S>search string</S>", "S") // "search string"
 */
function extractAnnotation(content: string, annotation: string): string {
  const regex = new RegExp(`<${annotation}>(.*?)</${annotation}>`, "g");
  const matches = content.match(regex);

  if (!matches || matches.length !== 1) {
    throw new Error(`There must be exactly one <${annotation}>...</${annotation}> tag.`);
  }

  return matches[0].replace(new RegExp(`</?${annotation}>`, "g"), "").trim();
}

/**
 * Removes all annotations from content
 * @param content Content to remove annotations from
 * @returns Content without annotations
 * @example
 * removeAnnotations("<S>search string</S>") // "search string"
 */
function removeAnnotations(content: string): string {
  return content.replace(/<\/?[^>]+>/g, "").trim();
}

/**
 * Validates boolean string
 * @param boolStr Boolean string to validate
 * @returns Boolean value
 * @throws Error if boolean string is not "true" or "false"
 */
function validateBoolean(boolStr: string): boolean {
  if (boolStr !== "true" && boolStr !== "false") {
    throw new Error("oolean annotation must be either 'true' or 'false'.");
  }

  return boolStr === "true";
}

export function mapIntelligentAnswer(results: ChatCompletion.Choice[]): IntelligentAnswer[] {
  return results.map((c) => ({ answer: c.message.content || "" }));
}

export function mapSearchStringIntelligentAnswer(
  results: IntelligentAnswer[]
): SearchStringIntelligentAnswer {
  if (results.length === 0) {
    throw new Error("Failed to get complete answer from AI.");
  }

  const searchString = extractAnnotation(results[0].answer, "S");
  const justification = extractAnnotation(results[0].answer, "J");
  const answer = removeAnnotations(results[0].answer);

  return { searchString, justification, answer };
}

export function mapEvaluateLiteratureIntelligentAnswer(
  results: IntelligentAnswer[]
): EvaluateLiteratureIntelligentAnswer {
  if (results.length === 0) {
    throw new Error("Failed to get complete answer from AI.");
  }

  const boolStr = extractAnnotation(results[0].answer, "B");
  const inclusion = validateBoolean(boolStr);
  const justification = extractAnnotation(results[0].answer, "J");
  const answer = removeAnnotations(results[0].answer);

  return { inclusion, justification, answer };
}

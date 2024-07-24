import { Scopus } from "@/clients/elsevier/scopus";
import { LiteratureMetadata } from "@/state/types";
import { mapLiteratureResult } from "./scopus-mappers";

export const scopus = new Scopus({});

export function removeScopusApiKey(): void {
  scopus.setApiKey("");
}

export async function testAndSetScopusApiKey(apiKey: string): Promise<boolean> {
  return scopus.testAndSetApiKey(apiKey);
}

export async function searchScopus(query: string): Promise<LiteratureMetadata[]> {
  const response = await scopus.search({ query });
  return mapLiteratureResult(response);
}

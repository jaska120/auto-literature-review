import { Scopus } from "@/clients/elsevier/scopus";
import { LiteratureMetadata } from "@/state/types";
import { mapLiteratureResult } from "./scopus-mappers";

export const scopus = new Scopus({ apiKey: "" });

export async function testScopusApiKey(apiKey: string): Promise<boolean> {
  return scopus.testAndSetApiKey(apiKey);
}

export async function searchScopus(query: string): Promise<LiteratureMetadata[]> {
  const response = await scopus.search(query);
  return mapLiteratureResult(response);
}

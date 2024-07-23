import { Scopus } from "@/clients/elsevier/scopus";
import { ScopusSearchResponse } from "@/clients/elsevier/types";

export const scopus = new Scopus({ apiKey: "" });

export async function testScopusApiKey(apiKey: string): Promise<boolean> {
  return scopus.testAndSetApiKey(apiKey);
}

export async function searchScopus(query: string): Promise<ScopusSearchResponse> {
  return scopus.search(query);
}

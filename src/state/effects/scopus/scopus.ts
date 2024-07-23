import { Scopus } from "@/clients/elsevier/scopus";

export const scopus = new Scopus({ apiKey: "" });

export async function testScopusApiKey(apiKey: string): Promise<boolean> {
  return scopus.testAndSetApiKey(apiKey);
}

export async function searchScopus(query: string) {
  return scopus.search(query);
}

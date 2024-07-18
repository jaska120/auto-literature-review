import { Scopus } from "@/clients/elsevier/scopus";

const scopus = new Scopus({ apiKey: "" });

export async function testScopusApiKey(apiKey: string): Promise<boolean> {
  return scopus.testAndSetApiKey(apiKey);
}

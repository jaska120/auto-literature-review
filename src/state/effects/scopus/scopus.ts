import { LiteratureMetadata } from "@/state/types";
import { scopus } from "@/clients/scopus/scopus-client";
import { mapLiteratureResult } from "./scopus-mappers";

let SCOPUS_API_KEY: string | undefined;

export function storeScopusApiKey(apiKey: string | undefined): void {
  SCOPUS_API_KEY = apiKey;
}

export function removeScopusApiKey(): void {
  storeScopusApiKey(undefined);
}

export async function testAndSetScopusApiKey(apiKey: string): Promise<boolean> {
  try {
    await scopus.search({
      headers: { "X-ELS-APIKey": apiKey },
      queries: { query: "test-api-key", count: 1 },
    });
    storeScopusApiKey(apiKey);
    return true;
  } catch {
    return false;
  }
}

export async function searchScopus(query: string): Promise<LiteratureMetadata[]> {
  if (!SCOPUS_API_KEY) {
    throw new Error("Scopus API key is not set");
  }
  const response = await scopus.search({
    headers: { "X-ELS-APIKey": SCOPUS_API_KEY },
    queries: { query, sort: "citedby-count" },
  });
  return mapLiteratureResult(response);
}

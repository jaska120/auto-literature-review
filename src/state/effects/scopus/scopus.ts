import { scopus } from "@/clients/scopus/scopus-client";
import { LiteratureMetadata, Pagination } from "@/state/types";
import { mapLiteratureResult } from "./scopus-mappers";

let SCOPUS_API_KEY: string | undefined;
let SCOPUS_INSTITUTIONAL_TOKEN: string | undefined;

export function registerScopusApiKeys(
  apiKey: string | undefined,
  institutionalToken: string | undefined
): void {
  SCOPUS_API_KEY = apiKey;
  SCOPUS_INSTITUTIONAL_TOKEN = institutionalToken;
}

export function deRegisterScopusApiKeys(): void {
  registerScopusApiKeys(undefined, undefined);
}

function generateHeaders(apiKey: string, institutionalToken: string) {
  return { "X-ELS-APIKey": apiKey, "X-ELS-Insttoken": institutionalToken };
}

export async function testAndRegisterScopusApiKeys(
  apiKey: string,
  institutionalToken: string
): Promise<boolean> {
  try {
    await scopus.search({
      headers: generateHeaders(apiKey, institutionalToken),
      queries: { query: "test-api-key", count: 1, view: "STANDARD" },
    });
    registerScopusApiKeys(apiKey, institutionalToken);
    return true;
  } catch {
    return false;
  }
}

export async function searchScopus(
  queryOrLink: string,
  isPaginationLink: boolean
): Promise<ReturnType<typeof mapLiteratureResult>> {
  if (!SCOPUS_API_KEY) {
    throw new Error("Scopus API key is not set");
  }
  if (!SCOPUS_INSTITUTIONAL_TOKEN) {
    throw new Error("Scopus institutional token is not set");
  }
  let queries = { query: queryOrLink, sort: "citedby-count" as const };
  if (isPaginationLink) {
    const url = new URL(queryOrLink);
    queries = Object.fromEntries(url.searchParams.entries()) as any;
  }
  const headers = generateHeaders(SCOPUS_API_KEY, SCOPUS_INSTITUTIONAL_TOKEN);
  const response = await scopus.search({ headers, queries });
  return mapLiteratureResult(response);
}

export function getMaxTotalResults(results: Pagination<LiteratureMetadata[]>[]): number {
  return Math.max(...results.map((r) => r.totalResults));
}

export function hasAllResults(results: Pagination<LiteratureMetadata[]>[]): boolean {
  const maxResults = Math.max(...results.map((r) => r.totalResults));
  const totalResults = results.reduce((acc, r) => acc + r.result.length, 0);
  return maxResults === totalResults;
}

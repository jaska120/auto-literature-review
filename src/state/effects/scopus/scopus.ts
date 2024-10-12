import { scopus } from "@/clients/scopus/scopus-client";
import { mapLiteratureResult } from "./scopus-mappers";

let SCOPUS_API_KEY: string | undefined;
let SCOPUS_INSTITUTIONAL_TOKEN: string | undefined;

export function storeScopusApiKeys(
  apiKey: string | undefined,
  institutionalToken: string | undefined
): void {
  SCOPUS_API_KEY = apiKey;
  SCOPUS_INSTITUTIONAL_TOKEN = institutionalToken;
}

export function removeScopusApiKeys(): void {
  storeScopusApiKeys(undefined, undefined);
}

function generateHeaders(apiKey: string, institutionalToken: string) {
  return { "X-ELS-APIKey": apiKey, "X-ELS-Insttoken": institutionalToken };
}

export async function testAndSetScopusApiKeys(
  apiKey: string,
  institutionalToken: string
): Promise<boolean> {
  try {
    await scopus.search({
      headers: generateHeaders(apiKey, institutionalToken),
      queries: { query: "test-api-key", count: 1, view: "STANDARD" },
    });
    storeScopusApiKeys(apiKey, institutionalToken);
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
  const headers = generateHeaders(SCOPUS_API_KEY, SCOPUS_INSTITUTIONAL_TOKEN);
  if (isPaginationLink) {
    const response = await scopus.axios.get(queryOrLink, { headers });
    return mapLiteratureResult(response.data);
  }
  const response = await scopus.search({
    headers,
    queries: { query: queryOrLink, sort: "citedby-count" },
  });
  return mapLiteratureResult(response);
}

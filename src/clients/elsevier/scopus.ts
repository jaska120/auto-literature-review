import {
  ZodScopusSearchResponse,
  ZodScopusSearchParams,
  ZodScopusConfig,
  ScopusSearchResponse,
  ScopusConfig,
  ScopusSearchParams,
  ZodScopusErrorResponse,
} from "./types";

export class Scopus {
  private host: string;

  private apiKey: string;

  constructor(props: ScopusConfig) {
    ZodScopusConfig.parse(props);
    this.host = "https://api.elsevier.com";
    this.apiKey = props.apiKey || "";
  }

  /**
   * Make a request to the Scopus API.
   * @param path The path to request.
   * @param params The query parameters.
   * @param parse The parser for the response.
   * @returns The parsed response.
   */
  private async request<T>(
    path: string,
    params: Record<string, string>,
    parse: (data: unknown) => T
  ) {
    const url = `${this.host}${path}?${new URLSearchParams(params)}`;
    const response = await fetch(url, {
      headers: { Accept: "application/json", "X-ELS-APIKey": this.apiKey },
    });
    const data = await response.json();
    if (response.status !== 200) {
      const errorResponse = ZodScopusErrorResponse.parse(data);
      throw new Error(errorResponse["service-error"].status.statusText);
    }
    return parse(data);
  }

  /**
   * Search the Scopus database.
   * @param query The search query parameters.
   * @returns The search results.
   */
  async search(params: ScopusSearchParams): Promise<ScopusSearchResponse> {
    return this.request(
      "/content/search/scopus",
      ZodScopusSearchParams.parse({
        count: "25",
        sort: "citedby-count",
        ...params,
      } satisfies ScopusSearchParams),
      ZodScopusSearchResponse.parse
    );
  }

  /**
   * Set the Scopus API key to use for requests.
   * @param apiKey The API key to set.
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Test the Scopus API key validity by making a test request.
   * Valid API key is stored in the instance and used for future requests.
   * @returns Boolean indicating whether the API key is valid.
   */
  async testAndSetApiKey(apiKey: string): Promise<boolean> {
    const previousApiKey = this.apiKey;
    this.setApiKey(apiKey);
    try {
      await this.search({ query: "test-api-key", count: "1" });
      return true;
    } catch {
      this.setApiKey(previousApiKey);
      return false;
    }
  }
}

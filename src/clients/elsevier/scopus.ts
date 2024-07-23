import { z } from "zod";
import { ScopusSearchResponse, ScopusSearchParams, ScopusConfig } from "./types";

export class Scopus {
  private host: string;

  private apiKey: string;

  constructor(props: z.infer<typeof ScopusConfig>) {
    ScopusConfig.parse(props);
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
      headers: { "X-ELS-APIKey": this.apiKey },
    });
    if (response.status !== 200) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    return parse(data);
  }

  /**
   * Search the Scopus database.
   * @param query The search query.
   * @returns The search results.
   */
  async search(query: string): Promise<z.infer<typeof ScopusSearchResponse>> {
    return this.request(
      "/content/search/scopus",
      ScopusSearchParams.parse({ query }),
      ScopusSearchResponse.parse
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
      await this.search("test-api-key");
      return true;
    } catch {
      this.setApiKey(previousApiKey);
      return false;
    }
  }
}

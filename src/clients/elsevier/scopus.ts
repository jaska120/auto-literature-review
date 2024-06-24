import { z } from "zod";
import { ScopusSearchResponse, ScopusSearchParams, ScopusConfig } from "./types";

export class Scopus {
  private host: string;

  private apiKey: string;

  constructor(props: z.infer<typeof ScopusConfig>) {
    ScopusConfig.parse(props);
    this.host = "https://api.elsevier.com";
    this.apiKey = props.apiKey;
  }

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

  async search(query: string): Promise<z.infer<typeof ScopusSearchResponse>> {
    return this.request(
      "/content/search/scopus",
      ScopusSearchParams.parse({ query }),
      ScopusSearchResponse.parse
    );
  }
}

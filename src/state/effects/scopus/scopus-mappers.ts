import { ScopusSearchResponse } from "@/clients/scopus/types";
import { LiteratureMetadata } from "../../types";

export function mapLiteratureResult(result: ScopusSearchResponse): LiteratureMetadata[] {
  return result["search-results"].entry.map((e) => ({
    title: e["dc:title"] || "Missing title",
    publication: e["prism:publicationName"] || "Missing publication",
    citedByCount: e["citedby-count"],
  }));
}

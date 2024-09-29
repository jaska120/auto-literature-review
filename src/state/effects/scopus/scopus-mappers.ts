import { ScopusSearchResponse } from "@/clients/scopus/types";
import { LiteratureMetadata, Pagination } from "../../types";

function mapLinks(links: ScopusSearchResponse["search-results"]["link"]): Pagination["links"] {
  return links.reduce(
    (acc, link) => {
      acc[link["@ref"]] = link["@href"];
      return acc;
    },
    {} as Pagination["links"]
  );
}

export function mapLiteratureResult(
  result: ScopusSearchResponse
): Pagination<LiteratureMetadata[]> {
  return {
    totalResults: result["search-results"]["opensearch:totalResults"],
    totalPages: Math.ceil(
      result["search-results"]["opensearch:totalResults"] /
        result["search-results"]["opensearch:itemsPerPage"]
    ),
    links: mapLinks(result["search-results"].link),
    page:
      Math.ceil(
        result["search-results"]["opensearch:startIndex"] /
          result["search-results"]["opensearch:itemsPerPage"]
      ) + 1,
    result: result["search-results"].entry.map((e) => ({
      title: e["dc:title"] || "Missing title",
      publication: e["prism:publicationName"] || "Missing publication",
      citedByCount: e["citedby-count"],
    })),
  };
}

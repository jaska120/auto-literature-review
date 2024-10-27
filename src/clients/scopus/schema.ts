import { apiBuilder } from "@zodios/core";
import {
  ZodScopusSearchParams,
  ZodScopusSearchResponse,
  ZodScopusErrorResponse,
  ZodScopusHeaders,
} from "./types";

export const api = apiBuilder({
  method: "get",
  path: "/content/search/scopus",
  alias: "search",
  description: "Search the Scopus database.",
  parameters: [
    {
      name: "Accept",
      description: "The content type to accept.",
      type: "Header",
      schema: ZodScopusHeaders.shape.Accept,
    },
    {
      name: "X-ELS-APIKey",
      description: "The API key for the request.",
      type: "Header",
      schema: ZodScopusHeaders.shape["X-ELS-APIKey"],
    },
    {
      name: "X-ELS-Insttoken",
      description: "The institution token for the request.",
      type: "Header",
      schema: ZodScopusHeaders.shape["X-ELS-Insttoken"],
    },
    {
      name: "query",
      description: "The search query.",
      type: "Query",
      schema: ZodScopusSearchParams.shape.query,
    },
    {
      name: "view",
      description: "The search view to use.",
      type: "Query",
      schema: ZodScopusSearchParams.shape.view,
    },
    {
      name: "count",
      description: "Number of results to return.",
      type: "Query",
      schema: ZodScopusSearchParams.shape.count,
    },
    {
      name: "sort",
      description: "Sort order for the results.",
      type: "Query",
      schema: ZodScopusSearchParams.shape.sort,
    },
    {
      name: "field",
      description: "Fields to include in the response. Multiple fields can be separated by commas.",
      type: "Query",
      schema: ZodScopusSearchParams.shape.field,
    },
  ],
  response: ZodScopusSearchResponse,
  errors: [{ status: "default", schema: ZodScopusErrorResponse }],
}).build();

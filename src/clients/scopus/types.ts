import { z } from "zod";

/**
 * headers for Scopus Search API.
 * @see {@link https://dev.elsevier.com/documentation/ScopusSearchAPI.wadl}
 */
export const ZodScopusHeaders = z.object({
  Accept: z.literal("application/json").optional().default("application/json"),
  "X-ELS-APIKey": z.string(),
});

export type ScopusHeaders = z.infer<typeof ZodScopusHeaders>;

/**
 * Query parameters for Scopus Search API.
 * @see {@link https://dev.elsevier.com/documentation/ScopusSearchAPI.wadl}
 */
export const ZodScopusSearchParams = z.object({
  /**
   * The search query, e.g. "TITLE-ABS-KEY ( "artificial intelligence" )".
   */
  query: z.string(),
  /**
   * The search view to use.
   * See {@link https://dev.elsevier.com/sc_search_views.html} for more details.
   */
  view: z.union([z.literal("STANDARD"), z.literal("COMPLETE")]).optional(),
  /**
   * Numeric value representing the maximum number of results to be returned for the search.
   * If not provided this will be set to a system default based on service level.
   * In addition the number cannot exceed the maximum system default - if it does an error will be returned.
   */
  count: z
    .number()
    .int()
    .min(1)
    .max(25)
    .transform((v) => v.toString())
    .optional()
    .default(25),
  /**
   * Represents the sort field name in descending (DESC) order.
   */
  sort: z
    .union([
      z.literal("artnum"),
      z.literal("citedby-count"),
      z.literal("coverDate"),
      z.literal("creator"),
      z.literal("orig-load-date"),
      z.literal("pagecount"),
      z.literal("pagefirst"),
      z.literal("pageRange"),
      z.literal("publicationName"),
      z.literal("pubyear"),
      z.literal("relevancy"),
      z.literal("volume"),
    ])
    .optional(),
});

export type ScopusSearchParams = z.infer<typeof ZodScopusSearchParams>;

/**
 * Response from Scopus Search API.
 * @see {@link https://dev.elsevier.com/documentation/ScopusSearchAPI.wadl}
 */
export const ZodScopusSearchResponse = z.object({
  "search-results": z.object({
    "opensearch:totalResults": z.string().transform((x) => Number(x)),
    "opensearch:startIndex": z.string().transform((x) => Number(x)),
    "opensearch:itemsPerPage": z.string().transform((x) => Number(x)),
    "opensearch:Query": z.object({
      "@role": z.string(),
      "@searchTerms": z.string(),
      "@startPage": z.string().transform((x) => Number(x)),
    }),
    link: z.array(
      z.object({
        "@_fa": z.string().transform((x) => Boolean(x)),
        "@ref": z.union([
          z.literal("self"),
          z.literal("first"),
          z.literal("next"),
          z.literal("last"),
        ]),
        "@href": z.string(),
        "@type": z.string(),
      })
    ),
    entry: z.array(
      z.object({
        "@_fa": z.string().transform((x) => Boolean(x)),
        link: z
          .array(
            z.object({
              "@_fa": z.string().transform((x) => Boolean(x)),
              "@ref": z.union([
                z.literal("self"),
                z.literal("author-affiliation"),
                z.literal("scopus"),
                z.literal("scopus-citedby"),
                z.literal("full-text"),
              ]),
              "@href": z.string(),
            })
          )
          .optional(),
        "prism:url": z.string().optional(),
        "dc:identifier": z.string().optional(),
        eid: z.string().optional(),
        "dc:title": z.string().optional(),
        "dc:creator": z.string().optional(),
        "prism:publicationName": z.string().optional(),
        "prism:eIssn": z.string().optional(),
        "prism:volume": z.string().optional(),
        "prism:issueIdentifier": z.string().optional(),
        "prism:pageRange": z.unknown().optional(),
        "prism:coverDate": z.string().optional(),
        "prism:coverDisplayDate": z.string().optional(),
        "prism:doi": z.string().optional(),
        "citedby-count": z
          .string()
          .optional()
          .transform((x) => Number(x)),
        affiliation: z
          .array(
            z.object({
              "@_fa": z.string().transform((x) => Boolean(x)),
              affilname: z.string(),
              "affiliation-city": z.string().nullable(),
              "affiliation-country": z.string(),
            })
          )
          .optional(),
        "pubmed-id": z.string().optional(),
        "prism:aggregationType": z.string().optional(),
        subtype: z.string().optional(),
        subtypeDescription: z.string().optional(),
        "article-number": z.string().optional(),
        "source-id": z.string().optional(),
        openaccess: z
          .string()
          .optional()
          .transform((x) => Boolean(x)),
        openaccessFlag: z.boolean().optional(),
        freetoread: z
          .object({
            value: z.array(
              z.object({
                $: z.string(),
              })
            ),
          })
          .optional(),
        freetoreadLabel: z
          .object({
            value: z.array(
              z.object({
                $: z.string(),
              })
            ),
          })
          .optional(),
      })
    ),
  }),
});

export type ScopusSearchResponse = z.infer<typeof ZodScopusSearchResponse>;

/**
 * Error response from Scopus Search API.
 */
export const ZodScopusErrorResponse = z.object({
  "service-error": z.object({
    status: z.object({
      statusCode: z.string(),
      statusText: z.string(),
    }),
  }),
});

export type ScopusErrorResponse = z.infer<typeof ZodScopusErrorResponse>;
import { z } from "zod";

/**
 * Config for the Scopus client.
 * @note Request API key from {@link https://dev.elsevier.com/}.
 */
export const ScopusConfig = z.object({
  apiKey: z.string(),
});

/**
 * Query parameters for the Scopus Search API.
 * @see {@link https://dev.elsevier.com/documentation/ScopusSearchAPI.wadl}
 */
export const ScopusSearchParams = z.object({
  query: z.string().optional(),
});

/**
 * Response from the Scopus Search API.
 * @see {@link https://dev.elsevier.com/documentation/ScopusSearchAPI.wadl}
 */
export const ScopusSearchResponse = z.object({
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
        link: z.array(
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
        ),
        "prism:url": z.string(),
        "dc:identifier": z.string(),
        eid: z.string(),
        "dc:title": z.string(),
        "dc:creator": z.string(),
        "prism:publicationName": z.string(),
        "prism:eIssn": z.string().optional(),
        "prism:volume": z.string().optional(),
        "prism:issueIdentifier": z.string().optional(),
        "prism:pageRange": z.unknown(),
        "prism:coverDate": z.string(),
        "prism:coverDisplayDate": z.string(),
        "prism:doi": z.string(),
        "citedby-count": z.string().transform((x) => Number(x)),
        affiliation: z.array(
          z.object({
            "@_fa": z.string().transform((x) => Boolean(x)),
            affilname: z.string(),
            "affiliation-city": z.string().nullable(),
            "affiliation-country": z.string(),
          })
        ),
        "pubmed-id": z.string().optional(),
        "prism:aggregationType": z.string(),
        subtype: z.string(),
        subtypeDescription: z.string(),
        "article-number": z.string().optional(),
        "source-id": z.string(),
        openaccess: z.string().transform((x) => Boolean(x)),
        openaccessFlag: z.boolean(),
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

import { z } from "zod";

/**
 * Config for the Scopus client.
 * @note Request API key from {@link https://dev.elsevier.com/}.
 */
export const ScopusConfig = z.object({
  apiKey: z.string().optional(),
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

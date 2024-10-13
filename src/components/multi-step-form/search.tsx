import { useEffect } from "react";
import { Input } from "@/components/input/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/button/button";
import { useBoundStore } from "@/state/bound-store";
import { useShallow } from "zustand/react/shallow";
import { isSuccess, getValue, isError, getError } from "@/utils/operation";
import { Table } from "@/components/table/table";
import Link from "next/link";

const schema = z.object({
  query: z.string().min(3),
});

type Schema = z.infer<typeof schema>;

export function Search() {
  const search = useBoundStore(
    useShallow((s) => ({
      query: s.literatureQuery,
      result: s.literatureSearchResult.currentResult,
      run: s.searchLiterature,
      connection: s.connections.scopus.test,
    }))
  );
  const { register, handleSubmit, formState, setValue } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setValue("query", search.query || "");
  }, [setValue, search.query]);

  const onQuery = async (s: Schema) => {
    await search.run(s.query, false);
  };

  const onPaginate = async (link: string) => {
    await search.run(link, true);
  };

  const {
    result,
    page: currentPage,
    links,
    totalPages,
    totalResults,
  } = getValue(search.result) || {};

  return (
    <div className="flex flex-col gap-8">
      <form className="flex flex-col gap-4" name="search-form" onSubmit={handleSubmit(onQuery)}>
        {!isSuccess(search.connection) && (
          <Link
            href="/configuration"
            className="text-sm hover:underline text-red-600 hover:text-red-700"
          >
            Check your Scopus API key in configuration.
          </Link>
        )}
        <Input
          {...register("query")}
          id="query"
          label="Search query"
          placeholder="TITLE-ABS-KEY ( literature )"
          disabled={formState.isSubmitting || !isSuccess(search.connection)}
          error={!!formState.errors.query || isError(search.result)}
          helperText={formState.errors.query?.message || getError(search.result)?.message}
        />
        <Button
          fullWidth
          variant="primary"
          type="submit"
          disabled={!isSuccess(search.connection)}
          loading={formState.isSubmitting}
        >
          Search
        </Button>
      </form>
      {isSuccess(search.result) && (
        <div>
          <p className="block mb-1 text-xs font-medium text-gray-700">
            Total number of results: {totalResults}
          </p>
          <Table
            columns={["Title", "Publication", "Year", "Citation count"]}
            rows={
              result?.map((r) => {
                return [
                  r.title,
                  r.publication,
                  r.publishDate?.getFullYear().toString() || "?",
                  r.citedByCount?.toString() ?? "?",
                ];
              }) || []
            }
            collapse={{
              columns: ["Authors", "Keywords", "Abstract"],
              rows:
                result?.map((r) => [r.authors.join(", "), r.keywords.join(", "), r.abstract]) || [],
            }}
            pagination={
              currentPage
                ? {
                    currentPage: currentPage || -1,
                    totalPages: totalPages || -1,
                    hasNextPage: !!links?.next,
                    onPaginate: (page) => {
                      if (page === currentPage || !currentPage) return;
                      const link = page > currentPage ? links?.next : links?.prev;
                      if (!link) return;
                      handleSubmit(async () => onPaginate(link))();
                    },
                  }
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}

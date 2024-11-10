import { useEffect } from "react";
import { Textarea } from "@/components/textarea/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/button/button";
import { useBoundStore } from "@/state/bound-store";
import { useShallow } from "zustand/react/shallow";
import { isSuccess, getValue, isError, getError, isRunning } from "@/utils/operation";
import { Table } from "@/components/table/table";
import Link from "next/link";
import { ApiKeyWarning } from "./api-key-warning";
import { Form, FormContainer, FormResult } from "./form";
import { Card } from "../card/card";

const schema = z.object({
  query: z.string().min(3),
});

type Schema = z.infer<typeof schema>;

export function SearchTooltip() {
  return (
    <p>
      The current search is limited to{" "}
      <Link
        href="https://www.elsevier.com/products/scopus/search"
        target="_blank"
        className="text-blue-600 hover:underline"
      >
        Scopus Search
      </Link>{" "}
      only.
    </p>
  );
}

export function Search() {
  const state = useBoundStore(
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
    setValue("query", state.query || "");
  }, [setValue, state.query]);

  const onQuery = async (s: Schema) => {
    await state.run(s.query, false);
  };

  const onPaginate = async (link: string) => {
    await state.run(link, true);
  };

  const {
    result,
    page: currentPage,
    links,
    totalPages,
    totalResults,
  } = getValue(state.result) || {};

  return (
    <FormContainer>
      <Card body="Search from Scopus and skim the results for correctness. Tip: you can expand individual results for metadata." />
      <FormResult loading={isRunning(state.result)}>
        <ApiKeyWarning service="Scopus" connection={state.connection} />
        {isSuccess(state.result) && (
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
                    totalResults: totalResults || -1,
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
        )}
        {isError(state.result) && <p className="text-red-500">{getError(state.result)?.message}</p>}
      </FormResult>
      <Form name="search-form" onSubmit={handleSubmit(onQuery)}>
        <Textarea
          {...register("query")}
          id="query"
          label="Search query"
          placeholder="TITLE-ABS-KEY ( literature )"
          rows={3}
          disabled={formState.isSubmitting || !isSuccess(state.connection)}
          error={!!formState.errors.query}
          helperText={formState.errors.query?.message}
        />
        <Button
          fullWidth
          variant="primary"
          type="submit"
          disabled={!isSuccess(state.connection)}
          loading={formState.isSubmitting}
        >
          Search
        </Button>
      </Form>
    </FormContainer>
  );
}

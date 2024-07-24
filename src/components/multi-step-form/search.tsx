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
      result: s.literatureSearch,
      run: s.loadLiteratureSearch,
      connection: s.connections.scopus.test,
    }))
  );
  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onQuery = async (s: Schema) => {
    await search.run(s.query);
  };

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
        <Table
          columns={["Title", "Publication", "Citation count"]}
          rows={
            getValue(search.result)?.map((r) => [
              r.title,
              r.publication,
              r.citedByCount?.toString() ?? "",
            ]) || []
          }
        />
      )}
    </div>
  );
}

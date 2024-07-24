import { Input } from "@/components/input/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/button/button";
import { useBoundStore } from "@/state/bound-store";
import { useShallow } from "zustand/react/shallow";
import { isRunning, isSuccess, getValue } from "@/utils/operation";
import { Table } from "@/components/table/table";

const schema = z.object({
  query: z.string(),
});

type Schema = z.infer<typeof schema>;

export function Search() {
  const search = useBoundStore(
    useShallow((state) => ({ result: state.literatureSearch, run: state.loadLiteratureSearch }))
  );
  const { register, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onQuery = (s: Schema) => {
    search.run(s.query);
  };

  return (
    <div className="flex flex-col gap-8">
      <form className="flex flex-col gap-4" name="search-form" onSubmit={handleSubmit(onQuery)}>
        <Input
          {...register("query")}
          id="search-query"
          label="Search query"
          placeholder="TITLE-ABS-KEY ( literature )"
        />
        <Button fullWidth variant="primary" type="submit" loading={isRunning(search.result)}>
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

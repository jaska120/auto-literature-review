import { Input } from "@/components/input/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/button/button";

const schema = z.object({
  query: z.string(),
});

type Schema = z.infer<typeof schema>;

export function Search() {
  const { register, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onQuery = (s: Schema) => {
    // TODO
    console.log({ s });
  };

  return (
    <div>
      <form className="flex flex-col gap-4" name="search-form" onSubmit={handleSubmit(onQuery)}>
        <Input
          {...register("query")}
          id="search-query"
          label="Search query"
          placeholder="TITLE-ABS-KEY ( literature )"
        />
        <Button fullWidth variant="primary" type="submit">
          Search
        </Button>
      </form>
    </div>
  );
}

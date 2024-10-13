import { useEffect } from "react";
import { Textarea } from "@/components/textarea/textarea";
import { Button } from "@/components/button/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoundStore } from "@/state/bound-store";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import { getError, getValue, isError, isSuccess } from "@/utils/operation";

const schema = z.object({
  prompt: z.string().min(3),
});

type Schema = z.infer<typeof schema>;

export function SearchString() {
  const state = useBoundStore(
    useShallow((s) => ({
      prompt: s.searchStringPrompt,
      result: s.searchStringResult.currentResult,
      run: s.askAIForSearchString,
      connection: s.connections.openAI.test,
    }))
  );
  const { register, handleSubmit, formState, setValue } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setValue("prompt", state.prompt || "");
  }, [setValue, state.prompt]);

  const onQuery = async (s: Schema) => {
    await state.run(s.prompt);
  };

  return (
    <div className="flex flex-col gap-8">
      <form
        className="flex flex-col gap-4"
        name="search-string-form"
        onSubmit={handleSubmit(onQuery)}
      >
        {!isSuccess(state.connection) && (
          <Link
            href="/configuration"
            className="text-sm hover:underline text-red-600 hover:text-red-700"
          >
            Check your Scopus API key in configuration.
          </Link>
        )}
        <Textarea
          {...register("prompt")}
          id="prompt"
          label="AI Instructions"
          placeholder="Lorem ipsum dolor sit amet"
          rows={8}
          disabled={formState.isSubmitting || !isSuccess(state.connection)}
          error={!!formState.errors.prompt || isError(state.result)}
          helperText={formState.errors.prompt?.message || getError(state.result)?.message}
        />
        <Button
          fullWidth
          variant="primary"
          type="submit"
          disabled={!isSuccess(state.connection)}
          loading={formState.isSubmitting}
        >
          Generate
        </Button>
      </form>
      {isSuccess(state.result) && (
        <div>{getValue(state.result)?.map((r) => <p key={r.answer}>{r.answer}</p>)}</div>
      )}
    </div>
  );
}

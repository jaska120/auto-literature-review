import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/button/button";
import { useBoundStore } from "@/state/bound-store";
import { useShallow } from "zustand/react/shallow";
import { isSuccess, getValue, isError, getError } from "@/utils/operation";
import Link from "next/link";
import { Card } from "../card/card";
import { Textarea } from "../textarea/textarea";

const schema = z.object({
  prompt: z.string().min(3),
});

type Schema = z.infer<typeof schema>;

export function Evaluate() {
  const state = useBoundStore(
    useShallow((s) => ({
      prompt: s.evaluateLiteraturePrompt,
      result: s.evaluateLiteratureResult.currentResult,
      run: s.askAIForLiteratureEvaluation,
      connection: s.connections.scopus.test,
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
      <Card
        body={
          <>
            For more details, please refer to the{" "}
            <Link href="/system-prompts#search-string" className="text-blue-600 hover:underline">
              system prompt
            </Link>{" "}
            provided.
          </>
        }
      />
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
            Check your OpenAI API key in configuration.
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
        <div>
          <p>{getValue(state.result)?.answer}</p>
        </div>
      )}
    </div>
  );
}

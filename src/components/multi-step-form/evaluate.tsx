import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/button/button";
import { useBoundStore } from "@/state/bound-store";
import { useShallow } from "zustand/react/shallow";
import { isSuccess, getValue, isError, getError, isRunning } from "@/utils/operation";
import Link from "next/link";
import { Card } from "../card/card";
import { Textarea } from "../textarea/textarea";
import { ApiKeyWarning } from "./api-key-warning";

const schema = z.object({
  prompt: z.string().min(3),
});

type Schema = z.infer<typeof schema>;

export function Evaluate() {
  const state = useBoundStore(
    useShallow((s) => ({
      prompt: s.evaluateLiteraturePrompt,
      literatuResults: s.fullLiteratureSearchResult,
      result: s.evaluateLiteratureTestResult.currentResult,
      run: s.evaluateLiteratureTest,
      scopusConnection: s.connections.scopus.test,
      openAIConnection: s.connections.openAI.test,
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
        <ApiKeyWarning service="Scopus" connection={state.scopusConnection} />
        <ApiKeyWarning service="Open AI" connection={state.openAIConnection} />
        <Textarea
          {...register("prompt")}
          id="prompt"
          label="AI Instructions"
          placeholder="Lorem ipsum dolor sit amet"
          rows={8}
          disabled={formState.isSubmitting || !isSuccess(state.scopusConnection)}
          error={!!formState.errors.prompt || isError(state.result)}
          helperText={formState.errors.prompt?.message || getError(state.result)?.message}
        />
        <Button
          fullWidth
          variant="primary"
          type="submit"
          disabled={!isSuccess(state.scopusConnection) || !isSuccess(state.literatuResults)}
          loading={formState.isSubmitting}
        >
          {isRunning(state.literatuResults)
            ? "Fetching literature..."
            : (isSuccess(state.literatuResults) && "Evaluate") || "Apply literature search first"}
        </Button>
      </form>
      {isSuccess(state.result) && (
        <div>
          {getValue(state.result)?.map((r) => (
            <div key={r.prompt} className="mb-4">
              <p className="whitespace-pre-wrap mb-2">
                <strong>Prompt</strong>
                <br />
                {r.prompt}
              </p>
              <p className="whitespace-pre-wrap">
                <strong>Evaluation: {r.result.inclusion ? "include" : "exclude"}</strong>
                <br />
                {r.result.justification}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

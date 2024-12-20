import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/button/button";
import { useBoundStore } from "@/state/bound-store";
import { useShallow } from "zustand/react/shallow";
import { isSuccess, getValue, isError, getError, isRunning } from "@/utils/operation";
import { Textarea } from "../textarea/textarea";
import { ApiKeyWarning } from "./api-key-warning";
import { Form, FormContainer, FormResult } from "./form";
import { Card } from "../card/card";

const schema = z.object({
  prompt: z.string().min(3),
});

type Schema = z.infer<typeof schema>;

export function Evaluate() {
  const state = useBoundStore(
    useShallow((s) => ({
      prompt: s.evaluateLiteraturePrompt,
      result: s.evaluateLiteratureResults.currentResult,
      run: s.evaluateLiteratureTest,
      test: s.literatureSearchResult.results,
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

  const testPapers = state.test[0]?.result.slice(0, 3) || [];

  return (
    <FormContainer>
      <Card
        body={
          testPapers.length
            ? `Test evaluate inclusion of the first three papers: ${testPapers.map((p, i) => `${i + 1}) ${p.title}`).join(", ")}.`
            : "You need to search for papers first."
        }
      />
      <FormResult loading={isRunning(state.result)}>
        <ApiKeyWarning service="Open AI" connection={state.openAIConnection} />
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
        {isError(state.result) && <p className="text-red-500">{getError(state.result)?.message}</p>}
      </FormResult>
      <Form name="evaluate-form" onSubmit={handleSubmit(onQuery)}>
        <Textarea
          {...register("prompt")}
          id="prompt"
          label="AI Instructions"
          placeholder="Lorem ipsum dolor sit amet"
          rows={8}
          disabled={formState.isSubmitting || !isSuccess(state.openAIConnection)}
          error={!!formState.errors.prompt}
          helperText={formState.errors.prompt?.message}
        />
        <Button
          fullWidth
          variant="primary"
          type="submit"
          disabled={!isSuccess(state.openAIConnection)}
          loading={formState.isSubmitting}
        >
          Evaluate
        </Button>
      </Form>
    </FormContainer>
  );
}

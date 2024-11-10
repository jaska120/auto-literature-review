import { useEffect } from "react";
import { Textarea } from "@/components/textarea/textarea";
import { Button } from "@/components/button/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoundStore } from "@/state/bound-store";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import { getError, getValue, isError, isRunning, isSuccess } from "@/utils/operation";
import { ApiKeyWarning } from "./api-key-warning";
import { Form, FormContainer, FormResult } from "./form";
import { Card } from "../card/card";

const schema = z.object({
  prompt: z.string().min(3),
});

type Schema = z.infer<typeof schema>;

export function SearchStringTooltip() {
  return (
    <p>
      For more details, please refer to the{" "}
      <Link href="/system-prompts#search-string" className="text-blue-600 hover:underline">
        system prompt
      </Link>{" "}
      provided.
    </p>
  );
}

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
    <FormContainer>
      <Card body="Generate Scopus compatible with the help of artificial intelligence." />
      <FormResult loading={isRunning(state.result)}>
        <ApiKeyWarning service="Open AI" connection={state.connection} />
        {isSuccess(state.result) && <p>{getValue(state.result)?.answer}</p>}
        {isError(state.result) && <p className="text-red-500">{getError(state.result)?.message}</p>}
      </FormResult>
      <Form name="search-string-form" onSubmit={handleSubmit(onQuery)}>
        <Textarea
          {...register("prompt")}
          id="prompt"
          label="AI Instructions"
          placeholder="Lorem ipsum dolor sit amet"
          rows={8}
          disabled={formState.isSubmitting || !isSuccess(state.connection)}
          error={!!formState.errors.prompt}
          helperText={formState.errors.prompt?.message}
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
      </Form>
    </FormContainer>
  );
}

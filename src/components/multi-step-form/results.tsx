import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/button/button";
import { useBoundStore } from "@/state/bound-store";
import { useShallow } from "zustand/react/shallow";
import { isSuccess, getValue } from "@/utils/operation";
import { ApiKeyWarning } from "./api-key-warning";
import { Form, FormContainer, FormResult } from "./form";
import { Card } from "../card/card";

const schema = z.object({});

type Schema = z.infer<typeof schema>;

export function Results() {
  const state = useBoundStore(
    useShallow((s) => ({
      literatureQuery: s.literatureQuery,
      literatureResult: s.literatureSearchResult.currentResult,
      evaluateTestResult: s.evaluateLiteratureResults.currentResult,
      run: s.generateReport,
      scopusConnection: s.connections.scopus.test,
      openAIConnection: s.connections.openAI.test,
    }))
  );
  const { handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async () => {
    await state.run();
  };

  return (
    <FormContainer>
      <Card body="Generate and download full results with following config." />
      <FormResult>
        <ApiKeyWarning service="Scopus" connection={state.scopusConnection} />
        <ApiKeyWarning service="Open AI" connection={state.openAIConnection} />
        <div className="flex flex-col gap-4">
          <p>
            <strong>Search String</strong>
          </p>
          <p>{state.literatureQuery}</p>
          <p>
            <strong>Search</strong>
          </p>
          <p>{getValue(state.literatureResult)?.totalResults} results</p>
          <p>
            <strong>Literature Evaluation</strong>
          </p>
          {getValue(state.evaluateTestResult)?.map((r) => (
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
      </FormResult>
      <Form name="results-form" onSubmit={handleSubmit(onSubmit)}>
        <Button
          fullWidth
          variant="primary"
          type="submit"
          disabled={!isSuccess(state.scopusConnection) || !isSuccess(state.openAIConnection)}
          loading={formState.isSubmitting}
        >
          Generate Full Results
        </Button>
      </Form>
    </FormContainer>
  );
}

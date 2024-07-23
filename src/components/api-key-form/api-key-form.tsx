"use client";

import { useShallow } from "zustand/react/shallow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBoundStore } from "@/state/bound";
import { ExternalService } from "@/state/config/types";
import { isError, isRunning, isSuccess } from "@/utils/operation";
import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { useEffect } from "react";

const schema = z.object({
  apiKey: z.string(),
});

type Schema = z.infer<typeof schema>;

interface ApiKeyFormProps {
  service: ExternalService;
  label: string;
  placeholder: string;
  helperText: string;
}

export function ApiKeyForm({ service, label, placeholder, helperText }: ApiKeyFormProps) {
  const hydrated = useHasHydrated(useBoundStore);
  const config = useBoundStore(
    useShallow((state) => ({
      connection: state.connections[service],
      saveApiKey: state.saveApiKey,
    }))
  );
  const { register, handleSubmit, setValue, getValues } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setValue("apiKey", config.connection.apiKey || "");
  }, [setValue, config.connection.apiKey]);

  const onSave = (s: Schema) => {
    config.saveApiKey(service, s.apiKey);
  };

  const onRemove = () => {
    config.saveApiKey(service, undefined);
    setValue("apiKey", "");
  };

  if (!hydrated) {
    return <p>Loading...</p>;
  }

  const error = !!(getValues("apiKey") && isError(config.connection.test));

  return (
    <form
      className="flex flex-col gap-4"
      name={`${service}-api-key-form`}
      onSubmit={handleSubmit(config.connection.apiKey ? onRemove : onSave)}
    >
      <Input
        {...register("apiKey")}
        disabled={!!config.connection.apiKey}
        id={`${service}-api-key-input`}
        label={label}
        placeholder={placeholder}
        helperText={error ? "The API key is invalid" : helperText}
        error={error}
        icon={isSuccess(config.connection.test) ? "check" : undefined}
      />
      {config.connection.apiKey ? (
        <Button fullWidth variant="destructive" type="submit">
          Remove
        </Button>
      ) : (
        <Button
          fullWidth
          variant="primary"
          type="submit"
          loading={isRunning(config.connection.test)}
        >
          Save
        </Button>
      )}
    </form>
  );
}

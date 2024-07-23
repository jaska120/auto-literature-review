"use client";

import { useShallow } from "zustand/react/shallow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useConfigurationStore } from "@/state/configuration/configuration";
import { ExternalService } from "@/state/configuration/types";
import { isRunning, isSuccess } from "@/utils/operation";
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
}

export function ApiKeyForm({ service }: ApiKeyFormProps) {
  const hydrated = useHasHydrated(useConfigurationStore);
  const config = useConfigurationStore(
    useShallow((state) => ({
      connection: state.connections[service],
      saveApiKey: state.saveApiKey,
    }))
  );
  const { register, handleSubmit, setValue } = useForm<Schema>({
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
        label={service}
        placeholder="Enter Scopus API Key"
        icon={isSuccess(config.connection.test) ? "check" : undefined}
      />
      {config.connection.apiKey ? (
        <Button fullWidth variant="destructive" type="submit">
          Remove API Key
        </Button>
      ) : (
        <Button
          fullWidth
          variant="primary"
          type="submit"
          loading={isRunning(config.connection.test)}
        >
          Save API Key
        </Button>
      )}
    </form>
  );
}

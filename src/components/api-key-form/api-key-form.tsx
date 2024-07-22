"use client";

import { useShallow } from "zustand/react/shallow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useConfigurationStore } from "@/state/configuration/configuration";
import { ExternalService } from "@/state/configuration/types";
import { isRunning } from "@/utils/operation";
import { Button } from "@/components/button/button";

const schema = z.object({
  apiKey: z.string(),
});

type Schema = z.infer<typeof schema>;

interface ApiKeyFormProps {
  service: ExternalService;
}

export function ApiKeyForm({ service }: ApiKeyFormProps) {
  const config = useConfigurationStore(
    useShallow((state) => ({
      connection: state.connections[service],
      saveApiKey: state.saveApiKey,
    }))
  );
  const { register, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onSave = (s: Schema) => {
    config.saveApiKey(service, s.apiKey);
  };

  const onRemove = () => {
    config.saveApiKey(service, undefined);
  };

  return (
    <form name={`${service}-api-key`} onSubmit={handleSubmit(onSave)}>
      <input
        {...register("apiKey")}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        placeholder="Enter Scopus API Key"
      />
      <Button
        variant="primary"
        type="submit"
        loading={isRunning(config.connection.test)}
        disabled={!!config.connection.apiKey}
      >
        Save API Key
      </Button>
      {/* {status === "success" && <div className="mt-4 text-green-600">Connection successful!</div>}
      {status === "failure" && <div className="mt-4 text-red-600">Connection failed!</div>} */}
      <Button variant="destructive" type="submit" onClick={handleSubmit(onRemove)}>
        Remove API Key
      </Button>
    </form>
  );
}

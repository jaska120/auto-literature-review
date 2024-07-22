"use client";

import { useShallow } from "zustand/react/shallow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useConfigurationStore } from "@/state/configuration/configuration";
import { ExternalService } from "@/state/configuration/types";
import { isRunning } from "@/utils/operation";

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
    <form onSubmit={handleSubmit(onSave)}>
      <input
        {...register("apiKey")}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        placeholder="Enter Scopus API Key"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
        // disabled={!!config.apiKey}
      >
        {isRunning(config.connection.test) && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        Save API Key
      </button>
      {/* {status === "success" && <div className="mt-4 text-green-600">Connection successful!</div>}
      {status === "failure" && <div className="mt-4 text-red-600">Connection failed!</div>} */}
      <button
        type="submit"
        className="w-full mt-4 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
        onClick={handleSubmit(onRemove)}
      >
        Remove API Key
      </button>
    </form>
  );
}

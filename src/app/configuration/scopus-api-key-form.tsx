"use client";

import { useShallow } from "zustand/react/shallow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useConfigurationStore } from "../../state/configuration/configuration";

const schema = z.object({
  apiKey: z.string(),
});

type Schema = z.infer<typeof schema>;

export function ScopusApiKeyForm() {
  const config = useConfigurationStore(
    useShallow((state) => ({
      apiKey: state.scopusApiKey,
      saveApiKey: state.saveScopusApiKey,
    }))
  );
  const { register, handleSubmit, setValue } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setValue("apiKey", config.apiKey || "");
  }, [setValue, config.apiKey]);

  const onSave = (s: Schema) => {
    config.saveApiKey(s.apiKey);
  };

  const onRemove = () => {
    config.saveApiKey(undefined);
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
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        // disabled={!!config.apiKey}
      >
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

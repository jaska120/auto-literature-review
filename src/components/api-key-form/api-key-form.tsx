"use client";

import { useShallow } from "zustand/react/shallow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBoundStore } from "@/state/bound-store";
import { ExternalService } from "@/state/config/types";
import { isError, isRunning, isSuccess } from "@/utils/operation";
import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";
import { useEffect } from "react";

const schema = z.object({
  apiKeys: z.union([z.array(z.string()), z.undefined()]),
});

type Schema = z.infer<typeof schema>;

interface ApiKeyFormProps {
  service: ExternalService;
  keys: {
    label: string;
    placeholder: string;
    helperText: string;
  }[];
}

export function ApiKeyForm({ service, keys }: ApiKeyFormProps) {
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
    setValue(
      "apiKeys",
      config.connection.apiKeys?.map((k) => k || "")
    );
  }, [setValue, config.connection.apiKeys]);

  const onSave = (s: Schema) => {
    config.saveApiKey(service, s.apiKeys);
  };

  const onRemove = () => {
    config.saveApiKey(service, undefined);
    setValue("apiKeys", []);
  };

  const error = !!(
    getValues("apiKeys")?.every((k) => typeof k === "string") && isError(config.connection.test)
  );

  const success = !!(
    config.connection.apiKeys?.length &&
    config.connection.apiKeys.every((k) => typeof k === "string")
  );

  return (
    <form
      className="flex flex-col gap-4"
      name={`${service}-api-key-form`}
      onSubmit={handleSubmit(success ? onRemove : onSave)}
    >
      {keys.map(({ label, placeholder, helperText }, i) => (
        <Input
          {...register(`apiKeys.${i}`)}
          key={`${service}-api-key-input-${label}`}
          disabled={!!config.connection.apiKeys?.[i]}
          id={`${service}-api-key-input`}
          label={label}
          placeholder={placeholder}
          helperText={error ? "The API key is invalid" : helperText}
          error={error}
          icon={isSuccess(config.connection.test) ? "check" : undefined}
        />
      ))}

      {success ? (
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

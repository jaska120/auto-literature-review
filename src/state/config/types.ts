import { Operation } from "@/utils/operation";

/**
 * External services that require an API key.
 */
export type ExternalService = "scopus" | "openAI";

type ApiKey = {
  /**
   * API keys to related service.
   */
  apiKeys: string[] | undefined;
  /**
   * The result of testing the API keys.
   */
  test: Operation;
};

export interface ConfigState {
  /**
   * The API keys for external services.
   */
  connections: {
    [service in ExternalService]: ApiKey;
  };
}

export interface ConfigActions {
  /**
   * Save API keys for a service and test the connection.
   * You can observe the connection status by checking the `test` field of the related {@link ConfigState.connections} service.
   * @param service The service to save the API keys for.
   * @param apiKey The API keys to save.
   */
  saveApiKey: (service: ExternalService, apiKeys: ApiKey["apiKeys"]) => Promise<void>;
}

export type ConfigSlice = ConfigState & ConfigActions;

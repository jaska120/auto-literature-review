import { Operation } from "@/utils/operation";

/**
 * External services that require an API key.
 */
export type ExternalService = "scopus" | "openAI";

type ApiKey = {
  /**
   * The API key to related service.
   */
  apiKey: string | undefined;
  /**
   * The result of testing the API key.
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
   * Save an API key for a service and test the connection.
   * You can observe the connection status by checking the `test` field of the related {@link ConfigState.connections} service.
   * @param service The service to save the API key for.
   * @param apiKey The API key to save.
   */
  saveApiKey: (service: ExternalService, apiKey: string | undefined) => Promise<void>;
}

export type ConfigSlice = ConfigState & ConfigActions;

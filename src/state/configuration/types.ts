/**
 * External services that require an API key.
 */
export type ExternalService = "scopus" | "openAI";

export type ApiKey = {
  /** The API key to related service. */
  apiKey: string | undefined;
  /**  Whether the API key is valid. */
  valid: boolean;
};

export interface ConfigurationState {
  /** The API keys for external services. */
  connections: Record<ExternalService, ApiKey>;
}

export interface ConfigurationActions {
  /**
   * Save an API key for a service and test the connection.
   * @param service The service to save the API key for.
   * @param apiKey The API key to save.
   * @returns Whether the connection was successful, and the API key was saved.
   */
  saveApiKey: (service: ExternalService, apiKey: string | undefined) => Promise<boolean>;
}

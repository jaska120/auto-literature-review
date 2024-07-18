export interface ConfigurationState {
  /**
   * The Scopus API key currently in use.
   */
  scopusApiKey: string | undefined;
}

export interface ConfigurationActions {
  /**
   * Test a connection to the Scopus API using the provided API key, and save it if successful.
   * @param apiKey The Scopus API key to save.
   * @returns Whether the connection was successful, and the API key was saved.
   */
  saveScopusApiKey: (apiKey: string | undefined) => Promise<boolean>;
}

export type ProviderConnectionStatus = {
  connected: boolean;
  mcpServerUrl: string;
};

export type ConnectionStatus = {
  linkedin: ProviderConnectionStatus;
  google: ProviderConnectionStatus;
};

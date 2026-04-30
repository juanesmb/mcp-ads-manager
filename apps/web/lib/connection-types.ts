export type ProviderConnectionStatus = {
  connected: boolean;
};

export type ConnectionStatus = {
  linkedin: ProviderConnectionStatus;
  google: ProviderConnectionStatus;
  /** Single Jumon MCP facade URL (include `/mcp` path for remote connectors). */
  jumonMcpServerUrl: string;
};

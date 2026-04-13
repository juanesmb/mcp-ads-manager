import { getLinkedinConnectionByUserId } from "@jumon/domain/connections";

export type ConnectionStatus = {
  connected: boolean;
  mcpServerUrl: string;
};

export async function getConnectionStatus(userId: string): Promise<ConnectionStatus> {
  const connection = await getLinkedinConnectionByUserId(userId);
  return {
    connected: Boolean(connection),
    mcpServerUrl: process.env.LINKEDIN_MCP_SERVER_URL ?? "https://mcp-server.us-central1.run.app/mcp"
  };
}

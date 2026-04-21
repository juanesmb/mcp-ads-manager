import { getConnectionByUserIdAndProvider } from "@jumon/domain/connections";
import type { ConnectionStatus } from "@/lib/connection-types";

export async function getConnectionStatus(userId: string): Promise<ConnectionStatus> {
  const [linkedin, google] = await Promise.all([
    getConnectionByUserIdAndProvider(userId, "linkedin"),
    getConnectionByUserIdAndProvider(userId, "google")
  ]);

  return {
    linkedin: {
      connected: Boolean(linkedin),
      mcpServerUrl: process.env.LINKEDIN_MCP_SERVER_URL ?? "https://mcp-server.us-central1.run.app/mcp"
    },
    google: {
      connected: Boolean(google),
      mcpServerUrl: process.env.GOOGLE_ADS_MCP_SERVER_URL ?? "https://google-ads-mcp.example.com/mcp"
    }
  };
}

import { getConnectionByUserIdAndProvider } from "@jumon/domain/connections";
import type { ConnectionStatus } from "@/lib/connection-types";

const DEFAULT_JUMON_MCP_URL =
  "https://jumon-mcp-server-570915368000.us-central1.run.app/mcp";

export async function getConnectionStatus(userId: string): Promise<ConnectionStatus> {
  const [linkedin, google] = await Promise.all([
    getConnectionByUserIdAndProvider(userId, "linkedin"),
    getConnectionByUserIdAndProvider(userId, "google")
  ]);

  const jumonMcpServerUrl =
    process.env.JUMON_MCP_SERVER_URL?.trim() || DEFAULT_JUMON_MCP_URL;

  return {
    linkedin: {
      connected: Boolean(linkedin)
    },
    google: {
      connected: Boolean(google)
    },
    jumonMcpServerUrl
  };
}

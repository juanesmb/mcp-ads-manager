import { CopyButton } from "@/components/copy-button";
import type { ConnectionStatus } from "@/server/connection-status";

type Props = {
  status: ConnectionStatus["google"];
};

export function GoogleConnectionCard({ status }: Props) {
  const connected = status.connected;

  return (
    <article className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#4285f4] text-sm font-bold text-white">
            G
          </span>
          <h2 className="text-3xl font-semibold text-[var(--card-foreground)]">Google Ads</h2>
        </div>
        {connected ? (
          <div className="group">
            <span className="rounded-full border border-[var(--success)] px-3 py-1 text-sm font-semibold text-[var(--success)] transition group-hover:hidden group-focus-within:hidden">
              Connected
            </span>
            <form
              action="/api/oauth/google/disconnect"
              method="post"
              className="hidden group-hover:block group-focus-within:block"
            >
              <button
                type="submit"
                className="rounded-full border border-[#dc2626] px-3 py-1 text-sm font-semibold text-[#dc2626] transition hover:bg-[#dc2626] hover:text-white"
              >
                Disconnect
              </button>
            </form>
          </div>
        ) : null}
      </div>

      {connected ? (
        <div className="mt-4 space-y-3">
          <p className="text-lg text-[var(--muted-foreground)]">
            Add the Google Ads MCP connector URL to your preferred agent (Claude, ChatGPT, etc.)
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-3 py-2">
            <p className="truncate text-sm text-[#4285f4]">{status.mcpServerUrl}</p>
            <CopyButton value={status.mcpServerUrl} />
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <a
            href="/api/oauth/google/connect"
            className="inline-flex rounded-xl border border-[#4285f4] px-5 py-2 text-sm font-semibold text-[#4285f4] transition hover:bg-[#4285f4] hover:text-white"
          >
            Connect
          </a>
        </div>
      )}
    </article>
  );
}

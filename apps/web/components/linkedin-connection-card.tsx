import { CopyButton } from "@/components/copy-button";
import type { ConnectionStatus } from "@/server/connection-status";

type Props = {
  status: ConnectionStatus["linkedin"];
};

export function LinkedinConnectionCard({ status }: Props) {
  const connected = status.connected;

  return (
    <article className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0a66c2] text-sm font-bold text-white">
            in
          </span>
          <h2 className="text-3xl font-semibold text-[var(--card-foreground)]">LinkedIn Ads</h2>
        </div>
        {connected ? (
          <div className="group">
            <span className="rounded-full border border-[var(--success)] px-3 py-1 text-sm font-semibold text-[var(--success)] transition group-hover:hidden group-focus-within:hidden">
              Connected
            </span>
            <form
              action="/api/oauth/linkedin/disconnect"
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
            Add the custom connector to your preferred agent (Claude, ChatGPT, etc...)
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-3 py-2">
            <p className="min-w-0 flex-1 truncate text-sm text-[#0a66c2]">{status.mcpServerUrl}</p>
            <div className="flex shrink-0 items-center gap-2">
              <CopyButton value={status.mcpServerUrl} />
              <a
                href="https://claude.ai/customize/connectors"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--border)]/50"
              >
                Add to Claude
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <a
            href="/api/oauth/linkedin/connect"
            className="inline-flex rounded-xl border border-[#0a66c2] px-5 py-2 text-sm font-semibold text-[#0a66c2] transition hover:bg-[#0a66c2] hover:text-white"
          >
            Connect
          </a>
        </div>
      )}
    </article>
  );
}

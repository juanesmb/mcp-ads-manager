"use client";

import { useCallback } from "react";
import { UserButton } from "@clerk/nextjs";
import { GoogleConnectionCard, LinkedinConnectionCard } from "@/components/provider-connection-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { ConnectionStatus } from "@/lib/connection-types";

type Props = {
  status: ConnectionStatus;
};

export function ConnectionsView({ status }: Props) {
  const { jumonMcpServerUrl } = status;

  const onCopyMcpUrl = useCallback(async () => {
    const { toast } = await import("sonner");
    try {
      await navigator.clipboard.writeText(jumonMcpServerUrl);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  }, [jumonMcpServerUrl]);

  return (
    <div className="min-h-screen bg-background">
      <nav
        className="flex h-[52px] shrink-0 items-center justify-between px-8"
        style={{ backgroundColor: "var(--j-deep-teal)" }}
      >
        <div className="rounded-[var(--j-radius-sm)] border border-[var(--j-ember)] px-3.5 py-1.5 text-sm font-medium tracking-[0.12em] text-[var(--j-mist)]">
          JUMON
        </div>
        <UserButton
          appearance={{
            variables: {
              colorPrimary: "#c8601a",
              colorNeutral: "#ffffff"
            },
            elements: {
              userButtonAvatarBox:
                "rounded-full border border-transparent ring-0 bg-[var(--j-ember)] text-[var(--j-mist)]"
            }
          }}
        />
      </nav>
      <div className="h-px bg-[var(--j-canopy)]" />

      <main className="mx-auto max-w-[860px] px-8 pb-12 pt-10">
        <section className="space-y-2">
          <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
            Connect your tools
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Two quick steps: link your ad accounts, then add the Jumon MCP server to your agent.
          </p>
          <div className="my-[var(--j-space-xl)] h-[0.5px] w-full bg-[var(--j-sage)]" aria-hidden />
        </section>

        <section className="mt-10 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium tracking-tight text-foreground">
              1. Connect your accounts
            </h2>
            <p className="text-muted-foreground">
              Link LinkedIn Ads and Google Ads so Jumon can run reports and tools on your behalf.
            </p>
          </div>
          <div className="flex w-full flex-col gap-[var(--j-space-md)] md:flex-row md:items-stretch">
            <LinkedinConnectionCard status={status.linkedin} />
            <GoogleConnectionCard status={status.google} />
          </div>
        </section>

        <section className="mt-12 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium tracking-tight text-foreground">
              2. Add the MCP server
            </h2>
            <p className="text-muted-foreground">
              Add this URL as a remote MCP connector in your preferred agent (Claude, ChatGPT, etc.).
            </p>
          </div>
          <Card className="max-w-md gap-0 overflow-hidden py-0">
            <CardHeader className="border-b-[0.5px] border-border px-5 pb-3 pt-4 [.border-b]:pb-3">
              <CardTitle className="text-lg">Jumon MCP</CardTitle>
              <CardDescription className="text-sm">
                One connector for LinkedIn Ads, Google Ads, and future platforms you connect in step 1.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex-col items-stretch gap-3 border-t-[0.5px] border-border bg-muted px-5 py-3.5">
              <div className="flex min-h-10 min-w-0 flex-wrap items-center justify-between gap-2">
                <p
                  className="min-w-0 flex-1 truncate font-mono text-[13px] text-muted-foreground"
                  title={jumonMcpServerUrl}
                >
                  {jumonMcpServerUrl}
                </p>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-[var(--j-radius-md)] px-3.5 py-1.5 text-[13px] font-medium text-foreground"
                    onClick={onCopyMcpUrl}
                  >
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-[var(--j-radius-md)] text-[13px] font-medium" asChild>
                    <a
                      href="https://claude.ai/customize/connectors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Add to Claude
                    </a>
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </section>
      </main>
    </div>
  );
}

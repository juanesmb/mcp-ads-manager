"use client";

import { useCallback } from "react";
import { UserButton } from "@clerk/nextjs";
import { GoogleConnectionCard, LinkedinConnectionCard } from "@/components/provider-connection-card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
    <main className="min-h-screen px-6 py-3 md:px-10 md:py-5">
      <header className="mb-10 flex items-center justify-between border-b border-border pb-4">
        <div className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold">
          JUMON
        </div>
        <UserButton />
      </header>

      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Connect your tools</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Two quick steps: link your ad accounts, then add the Jumon MCP server to your agent.
        </p>
        <Separator className="mt-4 max-w-6xl" />
      </section>

      <section className="mx-auto mt-10 max-w-6xl space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">1. Connect your accounts</h2>
          <p className="text-muted-foreground">
            Link LinkedIn Ads and Google Ads so Jumon can run reports and tools on your behalf.
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 md:flex-row md:items-stretch">
          <LinkedinConnectionCard status={status.linkedin} />
          <GoogleConnectionCard status={status.google} />
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">2. Add the MCP server</h2>
          <p className="text-muted-foreground">
            Add this URL as a remote MCP connector in your preferred agent (Claude, ChatGPT, etc.).
          </p>
        </div>
        <Card className="max-w-md gap-3 py-4">
          <CardHeader className="border-b px-4 pb-3 [.border-b]:pb-3">
            <CardTitle className="text-lg font-semibold">Jumon MCP</CardTitle>
            <CardDescription className="text-sm">
              One connector for LinkedIn Ads, Google Ads, and future platforms you connect in step 1.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/80 bg-muted/40 p-2">
              <p className="min-w-0 flex-1 truncate text-sm font-medium text-primary">{jumonMcpServerUrl}</p>
              <div className="flex shrink-0 items-center gap-2">
                <Button type="button" variant="outline" size="sm" className="text-xs" onClick={onCopyMcpUrl}>
                  Copy
                </Button>
                <Button variant="outline" size="sm" asChild>
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
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

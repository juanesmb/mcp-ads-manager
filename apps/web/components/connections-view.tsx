"use client";

import { UserButton } from "@clerk/nextjs";
import { GoogleConnectionCard, LinkedinConnectionCard } from "@/components/provider-connection-card";
import { Separator } from "@/components/ui/separator";
import type { ConnectionStatus } from "@/lib/connection-types";

type Props = {
  status: ConnectionStatus;
};

export function ConnectionsView({ status }: Props) {
  return (
    <main className="min-h-screen p-6 md:p-10">
      <header className="mb-10 flex items-center justify-between border-b border-border pb-4">
        <div className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold">
          JUMON
        </div>
        <UserButton />
      </header>

      <section className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Connect your accounts</h1>
        <p className="text-lg text-muted-foreground">
          Connect to get instant analysis, performance summaries, creative insights and more.
        </p>
        <Separator className="mt-6 max-w-6xl" />
      </section>

      <section className="mx-auto mt-8 flex w-full max-w-6xl flex-col gap-6 md:flex-row md:items-stretch">
        <LinkedinConnectionCard status={status.linkedin} />
        <GoogleConnectionCard status={status.google} />
      </section>
    </main>
  );
}

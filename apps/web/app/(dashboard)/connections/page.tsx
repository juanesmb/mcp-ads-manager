import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { GoogleConnectionCard } from "@/components/google-connection-card";
import { LinkedinConnectionCard } from "@/components/linkedin-connection-card";
import { getConnectionStatus } from "@/server/connection-status";

export default async function ConnectionsPage() {
  const { userId } = await auth();
  if (!userId) notFound();

  const status = await getConnectionStatus(userId);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <header className="mb-10 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div className="rounded-full border border-[var(--border)] px-4 py-2 font-semibold">
          JUMON
        </div>
        <UserButton />
      </header>

      <section className="space-y-3">
        <h1 className="text-4xl font-semibold">Connect your accounts</h1>
        <p className="text-lg text-[var(--muted-foreground)]">
          Connect to get instant analysis, performance summaries, creative insights and more.
        </p>
      </section>

      <section className="mt-8 flex flex-col gap-6">
        <LinkedinConnectionCard status={status.linkedin} />
        <GoogleConnectionCard status={status.google} />
      </section>
    </main>
  );
}

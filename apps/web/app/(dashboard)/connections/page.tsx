import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { ConnectionsView } from "@/components/connections-view";
import { getConnectionStatus } from "@/server/connection-status";

export default async function ConnectionsPage() {
  const { userId } = await auth();
  if (!userId) notFound();

  const status = await getConnectionStatus(userId);

  return <ConnectionsView status={status} />;
}

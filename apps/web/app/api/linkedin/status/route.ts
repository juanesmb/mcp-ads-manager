import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getConnectionStatus } from "@/server/connection-status";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = await getConnectionStatus(userId);
  return NextResponse.json(status);
}

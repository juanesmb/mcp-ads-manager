"use client";

import { useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { ProviderConnectionStatus } from "@/lib/connection-types";
import { cn } from "@/lib/utils";

type ProviderConfig = {
  id: "linkedin" | "google";
  displayName: string;
  shortLabel: string;
  connectedDescription: string;
};

const PROVIDERS: Record<"linkedin" | "google", ProviderConfig> = {
  linkedin: {
    id: "linkedin",
    displayName: "LinkedIn Ads",
    shortLabel: "in",
    connectedDescription: "Your LinkedIn Ads account is connected."
  },
  google: {
    id: "google",
    displayName: "Google Ads",
    shortLabel: "G",
    connectedDescription: "Your Google Ads account is connected."
  }
};

type Props = {
  provider: "linkedin" | "google";
  status: ProviderConnectionStatus;
};

function ProviderConnectionCard({ provider, status }: Props) {
  const config = PROVIDERS[provider];
  const { connected } = status;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <Card className="w-full min-w-0 max-w-md flex-1 gap-0 overflow-hidden bg-card py-0">
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 border-b-[0.5px] border-border px-5 pb-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "inline-flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-normal",
                connected
                  ? "bg-[var(--j-dusk)] text-[var(--j-ember)]"
                  : "bg-[var(--j-sage)] text-[var(--j-slate)]"
              )}
            >
              {config.shortLabel}
            </span>
            <CardTitle className="text-lg text-card-foreground">{config.displayName}</CardTitle>
          </div>
          {connected ? (
            <CardAction>
              <div className="flex items-center gap-2">
                <Badge className="h-6 gap-1.5 rounded-[20px] border-0 bg-[var(--j-sage)] px-2.5 text-[11px] font-medium text-[var(--j-moss)]">
                  <span className="size-1.5 shrink-0 rounded-full bg-[var(--j-moss)]" aria-hidden />
                  Connected
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon-sm" className="shrink-0" aria-label="Connection options">
                      <MoreVertical className="size-4 text-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => {
                        setConfirmOpen(true);
                      }}
                    >
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardAction>
          ) : null}
        </CardHeader>
        <CardFooter
          className={cn(
            "flex-col items-stretch px-5 py-3.5",
            connected &&
              "border-t-[0.5px] border-border bg-[var(--j-mist)] text-muted-foreground [.border-t]:pt-3.5"
          )}
        >
          {connected ? (
            <p className="text-sm text-muted-foreground">{config.connectedDescription}</p>
          ) : (
            <Button asChild className="h-auto w-fit rounded-[var(--j-radius-md)] px-3.5 py-[7px] text-[13px] font-medium">
              <a href={`/api/oauth/${config.id}/connect`}>Connect</a>
            </Button>
          )}
        </CardFooter>
      </Card>

      <form ref={formRef} method="post" action={`/api/oauth/${config.id}/disconnect`} className="hidden" aria-hidden />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect {config.displayName}?</AlertDialogTitle>
            <AlertDialogDescription>
              You can reconnect at any time. Agents using this account will lose access until you connect again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                formRef.current?.requestSubmit();
                setConfirmOpen(false);
              }}
            >
              Disconnect
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function LinkedinConnectionCard({ status }: { status: ProviderConnectionStatus }) {
  return <ProviderConnectionCard provider="linkedin" status={status} />;
}

export function GoogleConnectionCard({ status }: { status: ProviderConnectionStatus }) {
  return <ProviderConnectionCard provider="google" status={status} />;
}

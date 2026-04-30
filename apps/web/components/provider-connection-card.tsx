"use client";

import { useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
  connectClass: string;
  iconClass: string;
  connectedDescription: string;
};

const PROVIDERS: Record<"linkedin" | "google", ProviderConfig> = {
  linkedin: {
    id: "linkedin",
    displayName: "LinkedIn Ads",
    shortLabel: "in",
    connectClass:
      "h-auto border-2 border-linkedin bg-transparent px-5 py-2 font-semibold text-linkedin shadow-none hover:bg-linkedin hover:text-primary-foreground",
    iconClass: "bg-linkedin",
    connectedDescription: "Your LinkedIn Ads account is connected."
  },
  google: {
    id: "google",
    displayName: "Google Ads",
    shortLabel: "G",
    connectClass:
      "h-auto border-2 border-google bg-transparent px-5 py-2 font-semibold text-google shadow-none hover:bg-google hover:text-primary-foreground",
    iconClass: "bg-google",
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
      <Card className="w-full min-w-0 max-w-md flex-1 gap-3 py-4">
        <CardHeader className="border-b px-4 pb-3 [.border-b]:pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground ${config.iconClass}`}
            >
              {config.shortLabel}
            </span>
            <CardTitle className="text-lg font-semibold text-card-foreground">{config.displayName}</CardTitle>
          </div>
          {connected ? (
            <CardAction>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-success/50 bg-background font-semibold text-success"
                >
                  Connected
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className="shrink-0"
                      aria-label="Connection options"
                    >
                      <MoreVertical className="size-4" />
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
        <CardContent className="px-4 pt-3">
          {connected ? (
            <CardDescription className="text-sm text-muted-foreground">
              {config.connectedDescription}
            </CardDescription>
          ) : (
            <Button variant="outline" asChild>
              <a
                className={cn("rounded-xl", config.connectClass)}
                href={`/api/oauth/${config.id}/connect`}
              >
                Connect
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      <form
        ref={formRef}
        method="post"
        action={`/api/oauth/${config.id}/disconnect`}
        className="hidden"
        aria-hidden
      />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect {config.displayName}?</AlertDialogTitle>
            <AlertDialogDescription>
              You can reconnect at any time. Agents using this account will lose access until you connect
              again.
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

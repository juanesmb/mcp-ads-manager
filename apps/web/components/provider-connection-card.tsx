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
  urlClass: string;
  connectClass: string;
  iconClass: string;
  connectedBlurb: string;
};

const PROVIDERS: Record<"linkedin" | "google", ProviderConfig> = {
  linkedin: {
    id: "linkedin",
    displayName: "LinkedIn Ads",
    shortLabel: "in",
    urlClass: "text-linkedin",
    connectClass:
      "h-auto border-2 border-linkedin bg-transparent px-5 py-2 font-semibold text-linkedin shadow-none hover:bg-linkedin hover:text-primary-foreground",
    iconClass: "bg-linkedin",
    connectedBlurb: "Add the custom connector to your preferred agent (Claude, ChatGPT, etc...)"
  },
  google: {
    id: "google",
    displayName: "Google Ads",
    shortLabel: "G",
    urlClass: "text-google",
    connectClass:
      "h-auto border-2 border-google bg-transparent px-5 py-2 font-semibold text-google shadow-none hover:bg-google hover:text-primary-foreground",
    iconClass: "bg-google",
    connectedBlurb: "Add the Google Ads MCP connector URL to your preferred agent (Claude, ChatGPT, etc.)"
  }
};

type Props = {
  provider: "linkedin" | "google";
  status: ProviderConnectionStatus;
};

function ProviderConnectionCard({ provider, status }: Props) {
  const config = PROVIDERS[provider];
  const { connected, mcpServerUrl } = status;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <Card className="w-full min-w-0 max-w-xl flex-1">
        <CardHeader className="border-b sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-primary-foreground ${config.iconClass}`}
            >
              {config.shortLabel}
            </span>
            <CardTitle className="text-3xl text-card-foreground">{config.displayName}</CardTitle>
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
        <CardContent className="pt-5">
          {connected ? (
            <div className="space-y-3">
              <CardDescription className="text-base">{config.connectedBlurb}</CardDescription>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/80 bg-muted/40 p-3">
                <p className={`min-w-0 flex-1 truncate text-sm font-medium ${config.urlClass}`}>
                  {mcpServerUrl}
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  <CopyMcpButton value={mcpServerUrl} />
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
            </div>
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

function CopyMcpButton({ value }: { value: string }) {
  async function onCopy() {
    const { toast } = await import("sonner");
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" className="text-xs" onClick={onCopy}>
      Copy
    </Button>
  );
}

export function LinkedinConnectionCard({ status }: { status: ProviderConnectionStatus }) {
  return <ProviderConnectionCard provider="linkedin" status={status} />;
}

export function GoogleConnectionCard({ status }: { status: ProviderConnectionStatus }) {
  return <ProviderConnectionCard provider="google" status={status} />;
}

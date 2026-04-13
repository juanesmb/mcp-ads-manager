"use client";

import { useState } from "react";

type Props = {
  value: string;
};

export function CopyButton({ value }: Props) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs font-medium hover:bg-slate-100"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

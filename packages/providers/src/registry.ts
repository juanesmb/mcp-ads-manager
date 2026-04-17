import { googleAdapter } from "./google-adapter";
import { linkedinAdapter } from "./linkedin-adapter";
import type { ProviderAdapter, ProviderId } from "./types";

const byId: Record<ProviderId, ProviderAdapter> = {
  linkedin: linkedinAdapter,
  google: googleAdapter
};

export function getProvider(id: string): ProviderAdapter | null {
  if (id === "linkedin" || id === "google") {
    return byId[id];
  }
  return null;
}

export function listProviders(): ProviderAdapter[] {
  return [linkedinAdapter, googleAdapter];
}

export function isProviderId(id: string): id is ProviderId {
  return id === "linkedin" || id === "google";
}

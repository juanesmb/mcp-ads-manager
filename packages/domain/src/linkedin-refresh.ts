import { refreshProviderTokenForUser } from "./provider-refresh";

export async function refreshLinkedinTokenForUser(userId: string) {
  return refreshProviderTokenForUser(userId, "linkedin");
}

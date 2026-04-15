import {
  deleteLinkedinConnectionByUserId,
  insertOrUpdateLinkedinConnection,
  selectLinkedinConnectionByUserId,
  type StoredLinkedinConnection
} from "@jumon/db/queries";

export type UpsertLinkedinConnectionInput = {
  userId: string;
  encryptedAccessToken: string;
  encryptedRefreshToken: string | null;
  scope: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date | null;
};

export async function upsertLinkedinConnection(input: UpsertLinkedinConnectionInput): Promise<void> {
  await insertOrUpdateLinkedinConnection(input);
}

export async function getLinkedinConnectionByUserId(
  userId: string
): Promise<StoredLinkedinConnection | null> {
  return selectLinkedinConnectionByUserId(userId);
}

export async function disconnectLinkedinConnectionByUserId(userId: string): Promise<void> {
  await deleteLinkedinConnectionByUserId(userId);
}

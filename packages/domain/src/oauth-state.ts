import { deleteOauthStateNonce, insertOauthStateNonce } from "@jumon/db/queries";

type SaveInput = {
  state: string;
  userId: string;
  provider: string;
};

export async function saveOauthStateNonce(input: SaveInput): Promise<void> {
  await insertOauthStateNonce(input);
}

export async function consumeOauthStateNonce(input: {
  state: string;
  provider: string;
}): Promise<{ userId: string } | null> {
  const nonce = await deleteOauthStateNonce(input);
  if (!nonce) return null;
  return { userId: nonce.userId };
}

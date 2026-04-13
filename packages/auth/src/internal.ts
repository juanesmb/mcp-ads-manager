export async function requireInternalGatewayAuth(request: Request): Promise<{ ok: boolean }> {
  const expected = process.env.GATEWAY_INTERNAL_SECRET;
  if (!expected) return { ok: false };

  const value = request.headers.get("x-gateway-secret");
  return { ok: value === expected };
}

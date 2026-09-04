export const INTERNAL_AUTH_COOKIE = "ghc_internal_auth";

function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Derive the httpOnly cookie value from the server-only password. */
export async function getInternalAuthToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`ghc-internal-v1:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toBase64Url(digest);
}

'use server';

import { createHash } from 'crypto';

function sha256(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * Receives the SHA-256 hash of what the user typed.
 * Compares it against the SHA-256 hash of the server-side env var.
 * The plaintext code never appears in the client bundle or network traffic.
 */
export async function verifyAccessCode(inputHash: string): Promise<boolean> {
  const code = process.env.CANDIDATES_CODE;
  if (!code) return false;
  const expectedHash = sha256(code);
  return inputHash === expectedHash;
}

/**
 * Cryptographic Utility for Secure Online Voting System
 * Implements SHA-256 Hashing, Zero-Knowledge Voter Token Separation,
 * and Tamper-Evident Merkle-style Audit Chains.
 */

// Generate SHA-256 hash using standard Web Crypto API
export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Synchronous fast fallback / display hash calculation
export function fastHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}${Math.abs(hash * 31).toString(16).padStart(8, '0')}`.slice(0, 18);
}

// Generate Secure Cryptographic Verification Receipt ID (e.g. VOTE-8F2A-94B1-C87E)
export function generateReceiptCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = (len: number) => {
    let s = '';
    const array = new Uint8Array(len);
    crypto.getRandomValues(array);
    for (let i = 0; i < len; i++) {
      s += chars[array[i] % chars.length];
    }
    return s;
  };
  return `VOTE-${segment(4)}-${segment(4)}-${segment(4)}`;
}

// Generate Anonymous Voter Blind Token (decouples Voter ID from Cast Ballot)
export async function generateBlindToken(voterId: string, electionId: string, salt?: string): Promise<string> {
  const randomSalt = salt || Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const raw = `${voterId}::${electionId}::${randomSalt}`;
  return sha256(raw);
}

// Generate Cryptographic Audit Log Hash chained with Previous Log Hash
export async function computeAuditLogHash(
  previousHash: string,
  timestamp: string,
  actorId: string,
  action: string,
  details: string
): Promise<string> {
  const payload = `${previousHash}|${timestamp}|${actorId}|${action}|${details}`;
  return sha256(payload);
}

// Verify integrity of an entire chain of audit logs
export async function verifyAuditChain(
  logs: Array<{ hash: string; previous_hash: string; timestamp: string; actor_id: string; action: string; details: string }>
): Promise<{ isValid: boolean; brokenAtIndex?: number; computedHashes?: string[] }> {
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    const expectedPrev = i === 0 ? 'GENESIS_BLOCK_00000000000000000000000000000000' : logs[i - 1].hash;
    
    if (log.previous_hash !== expectedPrev) {
      return { isValid: false, brokenAtIndex: i };
    }

    const computed = await computeAuditLogHash(
      log.previous_hash,
      log.timestamp,
      log.actor_id,
      log.action,
      log.details
    );

    if (computed !== log.hash) {
      return { isValid: false, brokenAtIndex: i };
    }
  }
  return { isValid: true };
}

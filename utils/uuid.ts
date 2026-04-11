// utils/uuid.ts
// ─────────────────────────────────────────────────────────────────────────────
// Generates a UUID v4 string. Uses the browser/Node crypto.randomUUID()
// where available (all modern environments), with a pure-JS fallback so
// the Apple Watch and older WebKit builds are covered.
//
// No external dependency needed — avoids adding uuid/nanoid to the bundle.
// ─────────────────────────────────────────────────────────────────────────────

export function generateUUID(): string {
  // Modern browsers, Node 14.17+, React Native 0.69+
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback: RFC 4122 v4 UUID using Math.random
  // Good enough for offline ID generation — not cryptographically secure
  // but collision probability is negligible for match IDs
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ISO 8601 timestamp — used as last_modified and created_at
export function nowISO(): string {
  return new Date().toISOString();
}

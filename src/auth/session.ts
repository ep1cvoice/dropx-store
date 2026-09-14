export const SESSION_MAX_AGE_SECONDS = {
  /** "Remember me" unchecked - one day */
  session: 60 * 60 * 24,
  /** "Remember me" checked - one week */
  remember: 60 * 60 * 24 * 7,
} as const;

export function parseRememberFlag(value: unknown): boolean {
  return value === true || value === "true" || value === "on" || value === "1";
}

export function sessionMaxAgeSeconds(remember: boolean): number {
  return remember
    ? SESSION_MAX_AGE_SECONDS.remember
    : SESSION_MAX_AGE_SECONDS.session;
}

export function isSessionExpired(
  loginAt: unknown,
  remember: unknown,
  now = Date.now(),
): boolean {
  if (typeof loginAt !== "number" || !Number.isFinite(loginAt)) {
    return true;
  }

  const maxMs = sessionMaxAgeSeconds(parseRememberFlag(remember)) * 1000;
  return now - loginAt >= maxMs;
}

import { describe, expect, it } from "vitest";

import {
  SESSION_MAX_AGE_SECONDS,
  isSessionExpired,
  parseRememberFlag,
  sessionMaxAgeSeconds,
} from "@/auth/session";

describe("parseRememberFlag", () => {
  it("accepts common truthy encodings", () => {
    expect(parseRememberFlag(true)).toBe(true);
    expect(parseRememberFlag("true")).toBe(true);
    expect(parseRememberFlag("on")).toBe(true);
    expect(parseRememberFlag("1")).toBe(true);
  });

  it("rejects everything else", () => {
    expect(parseRememberFlag(false)).toBe(false);
    expect(parseRememberFlag("false")).toBe(false);
    expect(parseRememberFlag(undefined)).toBe(false);
    expect(parseRememberFlag(null)).toBe(false);
  });
});

describe("isSessionExpired", () => {
  const loginAt = Date.UTC(2026, 0, 1, 12);

  it("expires legacy tokens that have no loginAt", () => {
    expect(isSessionExpired(undefined, true, loginAt)).toBe(true);
  });

  it("keeps a remembered session inside 7 days", () => {
    const now = loginAt + (SESSION_MAX_AGE_SECONDS.remember - 1) * 1000;
    expect(isSessionExpired(loginAt, true, now)).toBe(false);
  });

  it("ends a remembered session after 7 days", () => {
    const now = loginAt + SESSION_MAX_AGE_SECONDS.remember * 1000;
    expect(isSessionExpired(loginAt, true, now)).toBe(true);
  });

  it("ends a non-remembered session after 24 hours", () => {
    const now = loginAt + SESSION_MAX_AGE_SECONDS.session * 1000;
    expect(isSessionExpired(loginAt, false, now)).toBe(true);
  });

  it("does not slide past the original login", () => {
    expect(sessionMaxAgeSeconds(true)).toBe(SESSION_MAX_AGE_SECONDS.remember);
    expect(sessionMaxAgeSeconds(false)).toBe(SESSION_MAX_AGE_SECONDS.session);
  });
});

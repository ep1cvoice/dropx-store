import { describe, expect, it } from "vitest";

import { saltAndHashPassword, verifyPassword } from "@/utils/password";

describe("password hashing", () => {
  it("hashes and verifies a matching password", async () => {
    const hash = await saltAndHashPassword("DropxSeed123!");
    expect(hash).not.toBe("DropxSeed123!");
    expect(await verifyPassword("DropxSeed123!", hash)).toBe(true);
  });

  it("rejects a wrong password", async () => {
    const hash = await saltAndHashPassword("DropxSeed123!");
    expect(await verifyPassword("wrong-password", hash)).toBe(false);
  });
});

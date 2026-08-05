import { describe, expect, it } from "vitest";

import {
  checkoutInformationSchema,
  loginSchema,
  profileDataSchema,
  registerSchema,
} from "@/lib/validation";

describe("loginSchema", () => {
  it("accepts a valid login payload", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    password: "Password1",
    confirmPassword: "Password1",
    terms: true,
  };

  it("accepts a valid registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: "Password2",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when terms are not accepted", () => {
    const result = registerSchema.safeParse({ ...valid, terms: false });
    expect(result.success).toBe(false);
  });
});

describe("phoneField via profileDataSchema", () => {
  const base = {
    firstName: "Ada",
    lastName: "Lovelace",
    address: "123 Main Street",
    city: "Warsaw",
    postalCode: "00-001",
    country: "Poland",
  };

  it("accepts common phone formats", () => {
    for (const phone of ["+48 600 100 200", "600100200", "(22) 123-45-67"]) {
      expect(profileDataSchema.safeParse({ ...base, phone }).success).toBe(
        true,
      );
    }
  });

  it("rejects empty or too-short phones", () => {
    expect(profileDataSchema.safeParse({ ...base, phone: "" }).success).toBe(
      false,
    );
    expect(profileDataSchema.safeParse({ ...base, phone: "12" }).success).toBe(
      false,
    );
  });
});

describe("checkoutInformationSchema", () => {
  const valid = {
    email: "buyer@example.com",
    phone: "+48 600 100 200",
    firstName: "Ada",
    lastName: "Lovelace",
    address: "123 Main Street",
    city: "Warsaw",
    postalCode: "00-001",
    country: "Poland",
    shippingMethod: "inpost-paczkomat",
  };

  it("accepts a full checkout payload", () => {
    expect(checkoutInformationSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an unknown shipping method", () => {
    const result = checkoutInformationSchema.safeParse({
      ...valid,
      shippingMethod: "fedex",
    });
    expect(result.success).toBe(false);
  });
});

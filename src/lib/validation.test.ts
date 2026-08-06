import { describe, expect, it } from "vitest";

import {
  changeEmailSchema,
  changePasswordSchema,
  checkoutInformationSchema,
  forgotPasswordSchema,
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

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
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

  it("accepts Polish diacritics in names", () => {
    const result = registerSchema.safeParse({
      ...valid,
      firstName: "Łukasz",
      lastName: "Ziółkowski",
    });
    expect(result.success).toBe(true);
  });

  it("accepts hyphenated names", () => {
    const result = registerSchema.safeParse({
      ...valid,
      firstName: "Anna-Maria",
      lastName: "Nowak",
    });
    expect(result.success).toBe(true);
  });

  it("rejects names with digits", () => {
    const result = registerSchema.safeParse({
      ...valid,
      firstName: "Ada2",
    });
    expect(result.success).toBe(false);
  });

  it("rejects weak passwords", () => {
    expect(
      registerSchema.safeParse({
        ...valid,
        password: "short1",
        confirmPassword: "short1",
      }).success,
    ).toBe(false);
    expect(
      registerSchema.safeParse({
        ...valid,
        password: "password1",
        confirmPassword: "password1",
      }).success,
    ).toBe(false);
    expect(
      registerSchema.safeParse({
        ...valid,
        password: "Password",
        confirmPassword: "Password",
      }).success,
    ).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts a valid email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "user@example.com" }).success,
    ).toBe(true);
  });

  it("rejects empty or invalid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "" }).success).toBe(false);
    expect(forgotPasswordSchema.safeParse({ email: "nope" }).success).toBe(
      false,
    );
  });
});

describe("changeEmailSchema", () => {
  it("trims and accepts a valid email", () => {
    expect(
      changeEmailSchema.safeParse({ email: "  new@example.com  " }).success,
    ).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(changeEmailSchema.safeParse({ email: "bad" }).success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  const valid = {
    currentPassword: "OldPassword1",
    newPassword: "NewPassword2",
    confirmPassword: "NewPassword2",
  };

  it("accepts a valid password change", () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects when confirmation does not match", () => {
    expect(
      changePasswordSchema.safeParse({
        ...valid,
        confirmPassword: "NewPassword3",
      }).success,
    ).toBe(false);
  });

  it("rejects when the new password equals the current one", () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: "SamePassword1",
        newPassword: "SamePassword1",
        confirmPassword: "SamePassword1",
      }).success,
    ).toBe(false);
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

  it("accepts Polish names at checkout", () => {
    expect(
      checkoutInformationSchema.safeParse({
        ...valid,
        firstName: "Małgorzata",
        lastName: "Zając",
      }).success,
    ).toBe(true);
  });
});

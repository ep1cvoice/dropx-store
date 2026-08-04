import { z } from "zod";

const nameField = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .min(2, `${label} must be at least 2 characters`)
    .regex(/^[A-Za-z]+$/, `${label} must contain letters only`);

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    firstName: nameField("First name"),
    lastName: nameField("Last name"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: "You must accept the terms and privacy policy to continue",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const changeEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export type ChangeEmailValues = z.infer<typeof changeEmailSchema>;

const checkoutNameField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .min(2, `${label} must be at least 2 characters`);

const phoneField = z
  .string()
  .trim()
  .min(1, "Phone is required")
  .regex(/^[+\d\s()-]{6,20}$/, "Enter a valid phone number");

export const profileDataSchema = z.object({
  firstName: checkoutNameField("First name"),
  lastName: checkoutNameField("Last name"),
  phone: phoneField,
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .min(5, "Enter a full street address"),
  city: z.string().trim().min(1, "City is required"),
  postalCode: z
    .string()
    .trim()
    .min(1, "Postal code is required")
    .min(3, "Enter a valid postal code"),
  country: z.string().trim().min(1, "Country is required"),
});

export type ProfileDataValues = z.infer<typeof profileDataSchema>;

const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[0-9]/, "Must contain at least one number");

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current one",
    path: ["newPassword"],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const checkoutInformationSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: phoneField,
  firstName: checkoutNameField("First name"),
  lastName: checkoutNameField("Last name"),
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .min(5, "Enter a full street address"),
  city: z.string().trim().min(1, "City is required"),
  postalCode: z
    .string()
    .trim()
    .min(1, "Postal code is required")
    .min(3, "Enter a valid postal code"),
  country: z.string().trim().min(1, "Country is required"),
  shippingMethod: z.enum([
    "inpost-paczkomat",
    "inpost-kurier",
    "dpd",
    "dhl",
    "poczta",
  ]),
});

export type CheckoutInformationValues = z.infer<
  typeof checkoutInformationSchema
>;

/** Checkout form payload — draft fields + optional save-to-profile flag. */
export const checkoutInformationFormSchema = checkoutInformationSchema.extend({
  saveToProfile: z.boolean(),
});

export type CheckoutInformationFormValues = z.infer<
  typeof checkoutInformationFormSchema
>;


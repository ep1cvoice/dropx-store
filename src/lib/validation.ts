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

const checkoutNameField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .min(2, `${label} must be at least 2 characters`);

export const checkoutInformationSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .refine((val) => !val || /^[+\d\s()-]{6,20}$/.test(val), {
      message: "Enter a valid phone number",
    }),
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


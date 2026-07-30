"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { anton, inter } from "@/lib/fonts";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validation";

type ForgotPasswordFormProps = {
  className?: string;
};

export default function ForgotPasswordForm({
  className = "",
}: ForgotPasswordFormProps) {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    const timer = setTimeout(() => clearErrors(), 5000);
    return () => clearTimeout(timer);
  }, [errors, clearErrors]);

  async function onSubmit(data: ForgotPasswordFormValues) {
    // Mock only — no email is sent.
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmittedEmail(data.email.trim().toLowerCase());
  }

  if (submittedEmail) {
    return (
      <div className={className}>
        <h2
          className={`${anton.className} text-2xl uppercase tracking-wide text-gray-900 md:text-3xl lg:text-3xl`}
        >
          Check your inbox
        </h2>
        <p className={`${inter.className} mt-3 text-sm leading-relaxed text-gray-500`}>
          If an account exists for{" "}
          <span className="font-medium text-gray-800">{submittedEmail}</span>,
          we&apos;d send a reset link there.
        </p>
        <p
          className={`${inter.className} mt-4 border border-black/10 bg-[#f4f4f2] px-3 py-2.5 text-xs leading-relaxed text-[#666666]`}
        >
          Demo only — no email is sent.
        </p>
        <Link href="/login" className="mt-8 block">
          <Button
            type="button"
            variant="accent"
            className="w-full cursor-pointer py-3.5 text-sm uppercase tracking-wide"
          >
            Back to sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={className}>
      <h2
        className={`${anton.className} text-2xl uppercase tracking-wide text-gray-900 md:text-3xl lg:text-3xl`}
      >
        Forgot password
      </h2>
      <p className={`${inter.className} mt-2 text-sm text-gray-500`}>
        Enter your email and we&apos;ll send a reset link if that account
        exists.
      </p>

      <form
        className="mt-6 space-y-4 md:mt-8 md:space-y-5 lg:mt-5 lg:space-y-3.5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button
          type="submit"
          variant="accent"
          disabled={isSubmitting}
          className="mt-2 w-full cursor-pointer py-3.5 text-sm uppercase tracking-wide"
        >
          {isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p
        className={`${inter.className} mt-8 text-center text-sm text-gray-500 lg:pt-4`}
      >
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-[#e85d2a]">
          Sign in
        </Link>
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { changeEmail } from "@/actions/profile";
import Button from "@/components/ui/Button";
import { inter } from "@/lib/fonts";
import {
  changeEmailSchema,
  type ChangeEmailValues,
} from "@/lib/validation";

const labelClass = `${inter.className} mb-1.5 block text-sm text-[#666666]`;
const inputBaseClass = `${inter.className} w-full rounded-none border bg-white px-3.5 py-3 text-sm text-[#121212] placeholder:text-[#aaaaaa] focus:outline-none`;
const sectionHeadingClass = `${inter.className} text-xs font-bold uppercase tracking-[0.16em] text-[#121212]`;

function fieldClass(hasError: boolean) {
  return `${inputBaseClass} ${
    hasError
      ? "border-red-400 focus:border-red-400"
      : "border-black/15 focus:border-[#121212]"
  }`;
}

type ChangeEmailFormProps = {
  currentEmail: string;
};

export default function ChangeEmailForm({ currentEmail }: ChangeEmailFormProps) {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { email: currentEmail },
  });

  useEffect(() => {
    reset({ email: currentEmail });
  }, [currentEmail, reset]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 8000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  function onSubmit(data: ChangeEmailValues) {
    setServerError(null);
    setSuccessMessage(null);
    startTransition(async () => {
      const result = await changeEmail(data);
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [key, messages] of Object.entries(result.fieldErrors)) {
            setError(key as keyof ChangeEmailValues, {
              message: messages?.[0],
            });
          }
        }
        setServerError(result.error ?? null);
        return;
      }

      reset({ email: result.email });
      await update({ email: result.email });
      setSuccessMessage(
        `We've sent a confirmation link to ${result.email}. Your sign-in email has been updated.`,
      );
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="max-w-xl"
    >
      <section>
        <h2 className={sectionHeadingClass}>Account</h2>
        <div className="mt-4">
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            className={fieldClass(Boolean(errors.email))}
            aria-invalid={errors.email ? "true" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p role="alert" className="mt-1.5 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>
      </section>

      <div className="mt-6 space-y-3">
        {serverError && (
          <p role="alert" className={`${inter.className} text-sm text-red-500`}>
            {serverError}
          </p>
        )}
        {successMessage && (
          <p
            role="status"
            className={`${inter.className} text-sm font-medium text-[#1f9d55]`}
          >
            {successMessage}
          </p>
        )}
        <Button
          type="submit"
          variant="accent"
          disabled={isPending || !isDirty}
          className="h-12 w-full cursor-pointer rounded-none text-sm font-semibold uppercase tracking-[0.12em] sm:w-auto sm:min-w-[200px]"
        >
          {isPending ? "Updating…" : "Change email"}
        </Button>
      </div>
    </form>
  );
}

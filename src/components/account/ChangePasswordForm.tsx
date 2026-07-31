"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { changePassword } from "@/actions/profile";
import Button from "@/components/ui/Button";
import { inter } from "@/lib/fonts";
import {
  changePasswordSchema,
  type ChangePasswordValues,
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

export default function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(false), 4000);
    return () => clearTimeout(timer);
  }, [success]);

  function onSubmit(data: ChangePasswordValues) {
    setServerError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await changePassword(data);
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [key, messages] of Object.entries(result.fieldErrors)) {
            setError(key as keyof ChangePasswordValues, {
              message: messages?.[0],
            });
          }
        }
        setServerError(result.error ?? null);
        return;
      }
      reset();
      setSuccess(true);
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-10 max-w-xl border-t border-black/10 pt-10"
    >
      <section>
        <h2 className={sectionHeadingClass}>Change password</h2>
        <p className={`${inter.className} mt-2 text-sm text-[#888888]`}>
          Use at least 8 characters with one uppercase letter and one number.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className={labelClass} htmlFor="currentPassword">
              Current password
            </label>
            <input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={fieldClass(Boolean(errors.currentPassword))}
              aria-invalid={errors.currentPassword ? "true" : undefined}
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p role="alert" className="mt-1.5 text-xs text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="newPassword">
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className={fieldClass(Boolean(errors.newPassword))}
              aria-invalid={errors.newPassword ? "true" : undefined}
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p role="alert" className="mt-1.5 text-xs text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="confirmPassword">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className={fieldClass(Boolean(errors.confirmPassword))}
              aria-invalid={errors.confirmPassword ? "true" : undefined}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p role="alert" className="mt-1.5 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mt-6 space-y-3">
        {serverError && (
          <p role="alert" className={`${inter.className} text-sm text-red-500`}>
            {serverError}
          </p>
        )}
        {success && (
          <p
            role="status"
            className={`${inter.className} text-sm font-medium text-[#1f9d55]`}
          >
            Password updated.
          </p>
        )}
        <Button
          type="submit"
          variant="accent"
          disabled={isPending}
          className="h-12 w-full cursor-pointer rounded-none text-sm font-semibold uppercase tracking-[0.12em] sm:w-auto sm:min-w-[200px]"
        >
          {isPending ? "Updating…" : "Update password"}
        </Button>
      </div>
    </form>
  );
}

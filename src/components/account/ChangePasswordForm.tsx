"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { changePassword } from "@/actions/profile";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { inter } from "@/lib/fonts";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/lib/validation";

const sectionHeadingClass = `${inter.className} text-xs font-bold uppercase tracking-[0.16em] text-[#121212]`;

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
          <Input
            id="currentPassword"
            label="Current password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.currentPassword?.message}
            className="border-black/15 px-3.5 focus:border-[#121212]"
            {...register("currentPassword")}
          />

          <Input
            id="newPassword"
            label="New password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.newPassword?.message}
            className="border-black/15 px-3.5 focus:border-[#121212]"
            {...register("newPassword")}
          />

          <Input
            id="confirmPassword"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            className="border-black/15 px-3.5 focus:border-[#121212]"
            {...register("confirmPassword")}
          />
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

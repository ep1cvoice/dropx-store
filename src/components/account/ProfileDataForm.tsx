"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateProfileData } from "@/actions/profile";
import Button from "@/components/ui/Button";
import { inter } from "@/lib/fonts";
import {
  profileDataSchema,
  type ProfileDataValues,
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

export type ProfileDataFormDefaults = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type ProfileDataFormProps = {
  defaults: ProfileDataFormDefaults;
};

export default function ProfileDataForm({ defaults }: ProfileDataFormProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileDataValues>({
    resolver: zodResolver(profileDataSchema),
    defaultValues: {
      firstName: defaults.firstName,
      lastName: defaults.lastName,
      phone: defaults.phone,
      address: defaults.address,
      city: defaults.city,
      postalCode: defaults.postalCode,
      country: defaults.country || "Poland",
    },
  });

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(false), 4000);
    return () => clearTimeout(timer);
  }, [success]);

  function onSubmit(data: ProfileDataValues) {
    setServerError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateProfileData(data);
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [key, messages] of Object.entries(result.fieldErrors)) {
            setError(key as keyof ProfileDataValues, {
              message: messages?.[0],
            });
          }
        }
        setServerError(result.error ?? "Could not save profile.");
        return;
      }
      reset(data);
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
        <h2 className={sectionHeadingClass}>Personal details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              autoComplete="given-name"
              placeholder="Jan"
              className={fieldClass(Boolean(errors.firstName))}
              aria-invalid={errors.firstName ? "true" : undefined}
              {...register("firstName")}
            />
            {errors.firstName && (
              <p role="alert" className="mt-1.5 text-xs text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass} htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              autoComplete="family-name"
              placeholder="Kowalski"
              className={fieldClass(Boolean(errors.lastName))}
              aria-invalid={errors.lastName ? "true" : undefined}
              {...register("lastName")}
            />
            {errors.lastName && (
              <p role="alert" className="mt-1.5 text-xs text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <hr className="my-8 border-black/10" />

      <section>
        <h2 className={sectionHeadingClass}>Shipping address</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className={labelClass} htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+48 600 123 456"
              className={fieldClass(Boolean(errors.phone))}
              aria-invalid={errors.phone ? "true" : undefined}
              {...register("phone")}
            />
            {errors.phone && (
              <p role="alert" className="mt-1.5 text-xs text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="address">
              Address
            </label>
            <input
              id="address"
              autoComplete="street-address"
              placeholder="ul. Marszałkowska 1"
              className={fieldClass(Boolean(errors.address))}
              aria-invalid={errors.address ? "true" : undefined}
              {...register("address")}
            />
            {errors.address && (
              <p role="alert" className="mt-1.5 text-xs text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="city">
                City
              </label>
              <input
                id="city"
                autoComplete="address-level2"
                placeholder="Warszawa"
                className={fieldClass(Boolean(errors.city))}
                aria-invalid={errors.city ? "true" : undefined}
                {...register("city")}
              />
              {errors.city && (
                <p role="alert" className="mt-1.5 text-xs text-red-500">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass} htmlFor="postalCode">
                Postal Code
              </label>
              <input
                id="postalCode"
                autoComplete="postal-code"
                placeholder="00-001"
                className={fieldClass(Boolean(errors.postalCode))}
                aria-invalid={errors.postalCode ? "true" : undefined}
                {...register("postalCode")}
              />
              {errors.postalCode && (
                <p role="alert" className="mt-1.5 text-xs text-red-500">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="country">
              Country
            </label>
            <input
              id="country"
              autoComplete="country-name"
              placeholder="Poland"
              className={fieldClass(Boolean(errors.country))}
              aria-invalid={errors.country ? "true" : undefined}
              {...register("country")}
            />
            {errors.country && (
              <p role="alert" className="mt-1.5 text-xs text-red-500">
                {errors.country.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mt-8 space-y-3">
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
            Profile saved.
          </p>
        )}
        <Button
          type="submit"
          variant="accent"
          disabled={isPending || !isDirty}
          className="h-12 w-full cursor-pointer rounded-none text-sm font-semibold uppercase tracking-[0.12em] sm:w-auto sm:min-w-[200px]"
        >
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

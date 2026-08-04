"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { saveCheckoutInformation } from "@/actions/checkout-information";
import Button from "@/components/ui/Button";
import { SHIPPING_CARRIERS } from "@/lib/currency";
import { inter } from "@/lib/fonts";
import {
  checkoutInformationFormSchema,
  type CheckoutInformationFormValues,
  type CheckoutInformationValues,
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

type CheckoutInformationFormProps = {
  defaults?: Partial<CheckoutInformationValues> | null;
  /** True when returning from payment to edit saved information. */
  isEditing?: boolean;
};

export default function CheckoutInformationForm({
  defaults,
  isEditing = false,
}: CheckoutInformationFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CheckoutInformationFormValues>({
    resolver: zodResolver(checkoutInformationFormSchema),
    defaultValues: {
      email: defaults?.email ?? "",
      phone: defaults?.phone ?? "",
      firstName: defaults?.firstName ?? "",
      lastName: defaults?.lastName ?? "",
      address: defaults?.address ?? "",
      city: defaults?.city ?? "",
      postalCode: defaults?.postalCode ?? "",
      country: defaults?.country ?? "Poland",
      shippingMethod: defaults?.shippingMethod ?? "inpost-paczkomat",
      saveToProfile: false,
    },
  });

  function onSubmit(data: CheckoutInformationFormValues) {
    startTransition(async () => {
      const result = await saveCheckoutInformation(data);
      if (result && !result.ok) {
        if (result.fieldErrors) {
          for (const [key, messages] of Object.entries(result.fieldErrors)) {
            setError(key as keyof CheckoutInformationFormValues, {
              message: messages[0],
            });
          }
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <section>
        <h2 className={sectionHeadingClass}>Contact information</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="jan.kowalski@email.com"
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
        </div>
      </section>

      <hr className="my-8 border-black/10" />

      <section>
        <h2 className={sectionHeadingClass}>Shipping address</h2>
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
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

      <hr className="my-8 border-black/10" />

      <section>
        <h2 className={sectionHeadingClass}>Shipping</h2>
        <p className={`${inter.className} mt-2 text-sm text-[#666666]`}>
          Choose your carrier. Delivery is standard for all options.
        </p>
        <Controller
          name="shippingMethod"
          control={control}
          render={({ field }) => (
            <div className={`${inter.className} mt-4 space-y-3`}>
              {SHIPPING_CARRIERS.map((carrier) => {
                const active = field.value === carrier.id;
                return (
                  <label
                    key={carrier.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-none border px-4 py-4 transition-colors ${
                      active
                        ? "border-[#121212]"
                        : "border-black/15 hover:border-black/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={carrier.id}
                      checked={active}
                      onChange={() => field.onChange(carrier.id)}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-none border ${
                        active ? "border-[#121212]" : "border-black/30"
                      }`}
                    >
                      {active && (
                        <span className="h-2 w-2 rounded-none bg-[#121212]" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#121212]">
                        {carrier.label}
                      </span>
                      <span className="block text-xs text-[#888888]">
                        {carrier.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        />
        {errors.shippingMethod && (
          <p role="alert" className="mt-2 text-xs text-red-500">
            {errors.shippingMethod.message}
          </p>
        )}
      </section>

      <Button
        type="submit"
        variant="accent"
        disabled={isPending}
        className="mt-8 h-12 w-full cursor-pointer rounded-none text-sm font-semibold uppercase tracking-[0.12em]"
      >
        {isPending
          ? "Saving…"
          : isEditing
            ? "Save & continue to payment"
            : "Continue to payment"}
      </Button>

      <label
        className={`${inter.className} mt-4 flex cursor-pointer items-start gap-2.5 text-sm text-[#666666]`}
      >
        <input
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 rounded-none border-black/30 accent-[#121212]"
          {...register("saveToProfile")}
        />
        <span>
          Save my contact details and address to my profile for next time
        </span>
      </label>
    </form>
  );
}

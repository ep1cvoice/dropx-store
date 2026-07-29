"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { subscribeToNewsletter } from "@/actions/newsletter";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { inter } from "@/lib/fonts";

type NewsletterSubscribeFormProps = {
  /** Prefill when the visitor is already signed in. */
  defaultEmail?: string;
};

export default function NewsletterSubscribeForm({
  defaultEmail = "",
}: NewsletterSubscribeFormProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    email: string;
    isSignedIn: boolean;
    codeUnlocked: boolean;
    accountEmail: string | null;
    code: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await subscribeToNewsletter(email);
      if (!result.ok) {
        setSuccess(null);
        setError(result.error);
        return;
      }
      setSuccess({
        email: result.email,
        isSignedIn: result.isSignedIn,
        codeUnlocked: result.codeUnlocked,
        accountEmail: result.accountEmail,
        code: result.code,
      });
      setEmail("");
    });
  }

  if (success) {
    return (
      <div
        className={`${inter.className} mt-8 w-full max-w-xl space-y-3 text-left text-sm text-white/85 sm:mt-10`}
      >
        <p className="font-semibold text-white">You&apos;re on the drop list.</p>
        {success.codeUnlocked ? (
          <p>
            Your code{" "}
            <span className="font-bold text-[#c8f065]">{success.code}</span> is
            saved in{" "}
            <Link
              href="/account/discount-codes"
              className="underline decoration-white/40 underline-offset-2 transition-colors hover:text-white"
            >
              Discount Codes
            </Link>
            . Use it for 10% off when your order is €400+.
          </p>
        ) : success.isSignedIn ? (
          <p>
            You&apos;re signed in as{" "}
            <span className="font-medium text-white">
              {success.accountEmail}
            </span>
            . Subscribe with that email to unlock{" "}
            <span className="font-bold text-[#c8f065]">{success.code}</span>.
          </p>
        ) : (
          <p>
            Sign up or sign in with{" "}
            <span className="font-medium text-white">{success.email}</span> to
            unlock{" "}
            <span className="font-bold text-[#c8f065]">{success.code}</span> —
            10% off orders of €400 or more.
          </p>
        )}
        <div className="flex flex-wrap gap-3 pt-1">
          {success.codeUnlocked ? (
            <Link href="/account/discount-codes">
              <Button
                variant="accent"
                className="cursor-pointer rounded-none px-5 py-2.5 text-xs uppercase tracking-wide"
              >
                View code
              </Button>
            </Link>
          ) : !success.isSignedIn ? (
            <>
              <Link href="/register">
                <Button
                  variant="accent"
                  className="cursor-pointer rounded-none px-5 py-2.5 text-xs uppercase tracking-wide"
                >
                  Sign up
                </Button>
              </Link>
              <Link href="/login">
                <Button className="cursor-pointer rounded-none border border-white/25 bg-transparent px-5 py-2.5 text-xs uppercase tracking-wide text-white hover:bg-white/10">
                  Sign in
                </Button>
              </Link>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form
      className="mt-8 w-full max-w-xl sm:mt-10"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="flex flex-col gap-4 sm:flex-row md:gap-0">
        <label htmlFor="drop-list-email" className="sr-only">
          Email address
        </label>
        <input
          id="drop-list-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Enter your email"
          disabled={pending}
          className={`${inter.className} w-full flex-1 rounded-none border border-transparent bg-[#222222] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/20 disabled:opacity-60 sm:py-4 sm:text-base`}
        />
        <Button
          type="submit"
          variant="accent"
          disabled={pending}
          className="w-full shrink-0 cursor-pointer rounded-none px-8 py-3.5 text-sm uppercase tracking-wide disabled:cursor-not-allowed sm:w-auto sm:py-4"
        >
          {pending ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      {error && (
        <p className={`${inter.className} mt-3 text-left text-sm text-[#ff8a7a]`}>
          {error}
        </p>
      )}
    </form>
  );
}

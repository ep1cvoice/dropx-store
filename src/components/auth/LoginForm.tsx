import Link from "next/link";
import { AppleIcon, GoogleIcon } from "@/components/auth/social-icons";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { anton, inter } from "@/lib/fonts";

type LoginFormProps = {
  showSubtitle?: boolean;
  emailPlaceholder?: string;
  className?: string;
};

const socialButtonClassName =
  "w-full gap-2 py-3 font-medium text-gray-900 hover:text-gray-900";

export default function LoginForm({
  showSubtitle = false,
  emailPlaceholder = "you@example.com",
  className = "",
}: LoginFormProps) {
  return (
    <div className={className}>
      <h2
        className={`${anton.className} text-2xl uppercase tracking-wide text-gray-900 md:text-3xl lg:text-4xl`}
      >
        Sign in
      </h2>
      {showSubtitle && (
        <p
          className={`${inter.className} mt-2 hidden text-sm text-gray-500 md:block`}
        >
          Welcome back. Sign in to access your account.
        </p>
      )}

      <form className="mt-8 space-y-5 lg:mt-10" action="#" noValidate>
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder={emailPlaceholder}
        />

        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
        />

        <div className="flex items-center justify-between gap-4">
          <label
            className={`${inter.className} flex cursor-pointer items-center gap-2.5 text-sm text-gray-500`}
          >
            <input
              type="checkbox"
              name="remember"
              defaultChecked
              className="size-4 rounded border-gray-300 accent-gray-900"
            />
            Remember me
          </label>
          <span
            className={`${inter.className} shrink-0 text-sm text-[#e85d2a]`}
          >
            Forgot password?
          </span>
        </div>

        <Button
          type="submit"
          variant="accent"
          className="mt-2 w-full py-3.5 text-sm uppercase tracking-wide"
        >
          Sign in
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span
            className={`${inter.className} bg-white px-3 text-xs uppercase tracking-wider text-gray-400`}
          >
            Or
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className={`${socialButtonClassName} gap-2.5 lg:hidden`}
      >
        <GoogleIcon />
        Sign in with Google
      </Button>

      <div className="hidden grid-cols-2 gap-3 lg:grid">
        <Button type="button" variant="outline" className={socialButtonClassName}>
          <GoogleIcon />
          Google
        </Button>
        <Button type="button" variant="outline" className={socialButtonClassName}>
          <AppleIcon />
          Apple
        </Button>
      </div>

      <p
        className={`${inter.className} mt-auto pt-10 text-center text-sm text-gray-500 md:mt-10 md:pt-0`}
      >
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-[#e85d2a]">
          Create one
        </Link>
      </p>
    </div>
  );
}

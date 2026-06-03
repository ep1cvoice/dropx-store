import Link from "next/link";
import { GoogleIcon } from "@/components/footer/social-icons";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { anton, inter } from "@/lib/fonts";

type RegisterFormProps = {
  showSubtitle?: boolean;
  compact?: boolean;
  className?: string;
};

export default function RegisterForm({
  showSubtitle = false,
  compact = false,
  className = "",
}: RegisterFormProps) {
  return (
    <div className={className}>
      <h2
        className={`${anton.className} text-2xl uppercase tracking-wide text-gray-900 md:text-3xl ${compact ? "lg:text-3xl" : "lg:text-4xl"}`}
      >
        Create account
      </h2>
      {showSubtitle && (
        <p
          className={`${inter.className} mt-2 hidden text-sm text-gray-500 md:block`}
        >
          Sign up to access exclusive drops and releases.
        </p>
      )}

      <form
        className={`mt-6 space-y-4 md:mt-8 md:space-y-5 ${compact ? "lg:mt-5 lg:space-y-3" : "lg:mt-10"}`}
        action="#"
        noValidate
      >
        <div className={`grid grid-cols-2 gap-4 ${compact ? "lg:gap-3" : ""}`}>
          <Input
            id="firstName"
            name="firstName"
            label="First Name"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
          />
          <Input
            id="lastName"
            name="lastName"
            label="Last Name"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
          />
        </div>

        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />

        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
        />

        <label
          className={`${inter.className} flex cursor-pointer items-start gap-2.5 text-sm text-gray-500`}
        >
          <input
            type="checkbox"
            name="terms"
            className="mt-0.5 size-4 shrink-0 rounded border-gray-300 accent-gray-900"
          />
          I agree to the Terms of Service and Privacy Policy
        </label>

        <Button
          type="submit"
          variant="accent"
          className="mt-2 w-full cursor-pointer py-3.5 text-sm uppercase tracking-wide"
        >
          Create account
        </Button>
      </form>

      <div className={`relative ${compact ? "my-5 lg:my-4" : "my-8"}`}>
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
        className="w-full cursor-pointer gap-2 py-3 font-medium text-gray-900 hover:text-gray-900"
      >
        <GoogleIcon />
        Sign up with Google
      </Button>

      <p
        className={`${inter.className} pt-6 text-center text-sm text-gray-500 md:pt-0 ${compact ? "lg:pt-4" : "mt-auto md:mt-10"}`}
      >
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[#e85d2a]">
          Sign in
        </Link>
      </p>
    </div>
  );
}

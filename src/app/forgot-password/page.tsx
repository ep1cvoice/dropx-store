import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { isAuth } from "@/auth/auth";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password — DROPX",
  description: "Reset your DROPX account password.",
};

export default async function ForgotPasswordPage() {
  const authenticated = await isAuth();
  if (authenticated) {
    redirect("/");
  }

  return (
    <AuthSplitLayout heroSrc="/loginHero.jpg" tagline="Reset access.">
      <ForgotPasswordForm className="mx-auto flex w-full max-w-md flex-col md:max-h-full md:justify-center lg:max-w-lg" />
    </AuthSplitLayout>
  );
}

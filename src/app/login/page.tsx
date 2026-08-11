import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isAuth } from "@/auth/auth";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import LoginForm from "@/components/auth/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

function safeCallbackUrl(raw: string | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl: rawCallback } = await searchParams;
  const callbackUrl = safeCallbackUrl(rawCallback);

  const authenticated = await isAuth();
  if (authenticated) {
    redirect(callbackUrl);
  }

  return (
    <AuthSplitLayout
      heroSrc="/loginHero.jpg"
      tagline="Welcome back."
    >
      <Suspense fallback={null}>
        <LoginForm
          showSubtitle
          compact
          className="mx-auto flex w-full max-w-md flex-col md:max-h-full md:justify-center lg:max-w-lg"
        />
      </Suspense>
    </AuthSplitLayout>
  );
}

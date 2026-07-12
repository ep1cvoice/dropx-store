import { redirect } from "next/navigation";
import { isAuth } from "@/auth/auth";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const authenticated = await isAuth();
  if (authenticated) {
    redirect("/");
  }

  return (
    <AuthSplitLayout
      heroSrc="/loginHero.jpg"
      tagline="Welcome back."
    >
      <LoginForm
        showSubtitle
        compact
        className="mx-auto flex w-full max-w-md flex-col md:max-h-full md:justify-center lg:max-w-lg"
      />
    </AuthSplitLayout>
  );
}

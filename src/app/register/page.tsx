import { redirect } from "next/navigation";
import { isAuth } from "@/auth/auth";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  const authenticated = await isAuth();
  if (authenticated) {
    redirect("/");
  }

  return (
    <AuthSplitLayout
      heroSrc="/registerHero.jpg"
      tagline="Join the drop."
    >
      <RegisterForm
        showSubtitle
        compact
        className="mx-auto flex w-full max-w-md flex-col md:max-h-full md:justify-center lg:max-w-lg"
      />
    </AuthSplitLayout>
  );
}

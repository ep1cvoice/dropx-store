import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
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

import Loader from "@/components/ui/Loader";

/** Shared full-page auth loading state for /login and /register. */
export default function AuthLoading() {
  return (
    <div className="flex h-dvh items-center justify-center bg-white">
      <Loader />
    </div>
  );
}

import Loader from "@/components/ui/Loader";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-white">
      <Loader label="Processing..." />
    </div>
  );
}

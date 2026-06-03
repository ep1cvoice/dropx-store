import type { Metadata } from "next";
import NotFoundContent from "@/components/not-found/NotFoundContent";

export const metadata: Metadata = {
  title: "404 — Page Not Found | DropX Store",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return <NotFoundContent />;
}

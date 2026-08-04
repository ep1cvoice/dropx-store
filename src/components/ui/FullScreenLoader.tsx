"use client";

import { useEffect } from "react";

import Loader from "@/components/ui/Loader";

type FullScreenLoaderProps = {
  show: boolean;
  label?: string;
};

/** Fixed overlay for auth / checkout action moments. */
export default function FullScreenLoader({
  show,
  label = "Loading...",
}: FullScreenLoaderProps) {
  useEffect(() => {
    if (!show) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-white/92 backdrop-blur-[2px]"
      role="alertdialog"
      aria-busy="true"
      aria-live="assertive"
    >
      <Loader label={label} />
    </div>
  );
}

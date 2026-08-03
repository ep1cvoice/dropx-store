"use client";

import {
  createContext,
  useCallback,
  useContext,
  useTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { buildHref } from "./params";

type ListingNavContextValue = {
  isPending: boolean;
  navigate: (updates: Record<string, string | null>) => void;
};

const ListingNavContext = createContext<ListingNavContextValue | null>(null);

export function ListingNavProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (updates: Record<string, string | null>) => {
      startTransition(() => {
        router.push(buildHref(pathname, searchParams, { page: null, ...updates }), {
          scroll: false,
        });
      });
    },
    [router, pathname, searchParams],
  );

  return (
    <ListingNavContext.Provider value={{ isPending, navigate }}>
      {children}
    </ListingNavContext.Provider>
  );
}

export function useListingNav() {
  const ctx = useContext(ListingNavContext);
  if (!ctx) {
    throw new Error("useListingNav must be used within ListingNavProvider");
  }
  return ctx;
}

/** Dims listing results while a filter/sort navigation is in flight. */
export function ListingPendingFrame({ children }: { children: ReactNode }) {
  const { isPending } = useListingNav();
  return (
    <div
      aria-busy={isPending}
      className={`transition-opacity duration-150 ${
        isPending ? "pointer-events-none opacity-45" : "opacity-100"
      }`}
    >
      {children}
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  removeFromWishlist,
  toggleWishlist,
  type WishlistActionResult,
} from "@/actions/wishlist";

type StoreBagContextValue = {
  cartCount: number;
  wishlistCount: number;
  isWishlisted: (variantId: string) => boolean;
  toggleWishlistItem: (variantId: string) => Promise<WishlistActionResult>;
  removeWishlistItem: (variantId: string) => Promise<void>;
  bumpCartCount: (delta: number) => void;
  refreshBag: () => Promise<void>;
  isPending: boolean;
};

const StoreBagContext = createContext<StoreBagContextValue | null>(null);

type StoreBagProviderProps = {
  children: ReactNode;
};

type BagPayload = {
  cartCount: number;
  wishlistIds: string[];
};

async function fetchBag(): Promise<BagPayload> {
  const res = await fetch("/api/store-bag", { cache: "no-store" });
  if (!res.ok) return { cartCount: 0, wishlistIds: [] };
  const data = (await res.json()) as Partial<BagPayload>;
  return {
    cartCount: typeof data.cartCount === "number" ? data.cartCount : 0,
    wishlistIds: Array.isArray(data.wishlistIds) ? data.wishlistIds : [],
  };
}

export function StoreBagProvider({ children }: StoreBagProviderProps) {
  const router = useRouter();
  const { status } = useSession();
  const [isPending, startTransition] = useTransition();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState(() => new Set<string>());

  const refreshBag = useCallback(async () => {
    const bag = await fetchBag();
    setCartCount(bag.cartCount);
    setWishlistIds(new Set(bag.wishlistIds));
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    let cancelled = false;
    fetchBag().then((bag) => {
      if (cancelled) return;
      setCartCount(bag.cartCount);
      setWishlistIds(new Set(bag.wishlistIds));
    });
    return () => {
      cancelled = true;
    };
  }, [status]);

  const isWishlisted = useCallback(
    (variantId: string) => wishlistIds.has(variantId),
    [wishlistIds],
  );

  const toggleWishlistItem = useCallback(
    async (variantId: string): Promise<WishlistActionResult> => {
      if (!variantId) return { ok: false, error: "No product selected." };

      const result = await toggleWishlist(variantId);
      if (result.ok) {
        setWishlistIds((prev) => {
          const next = new Set(prev);
          if (result.wishlisted) next.add(variantId);
          else next.delete(variantId);
          return next;
        });
        startTransition(() => {
          router.refresh();
        });
      }
      return result;
    },
    [router],
  );

  const removeWishlistItem = useCallback(
    async (variantId: string) => {
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(variantId);
        return next;
      });
      await removeFromWishlist(variantId);
      startTransition(() => {
        router.refresh();
      });
    },
    [router],
  );

  const bumpCartCount = useCallback((delta: number) => {
    setCartCount((prev) => Math.max(0, prev + delta));
  }, []);

  const value = useMemo<StoreBagContextValue>(
    () => ({
      cartCount,
      wishlistCount: wishlistIds.size,
      isWishlisted,
      toggleWishlistItem,
      removeWishlistItem,
      bumpCartCount,
      refreshBag,
      isPending,
    }),
    [
      cartCount,
      wishlistIds.size,
      isWishlisted,
      toggleWishlistItem,
      removeWishlistItem,
      bumpCartCount,
      refreshBag,
      isPending,
    ],
  );

  return (
    <StoreBagContext.Provider value={value}>{children}</StoreBagContext.Provider>
  );
}

export function useStoreBag(): StoreBagContextValue {
  const ctx = useContext(StoreBagContext);
  if (!ctx) {
    throw new Error("useStoreBag must be used within StoreBagProvider");
  }
  return ctx;
}

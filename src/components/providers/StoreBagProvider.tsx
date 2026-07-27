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
  isPending: boolean;
};

const StoreBagContext = createContext<StoreBagContextValue | null>(null);

type StoreBagProviderProps = {
  initialCartCount: number;
  initialWishlistIds: string[];
  children: ReactNode;
};

export function StoreBagProvider({
  initialCartCount,
  initialWishlistIds,
  children,
}: StoreBagProviderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cartCount, setCartCount] = useState(initialCartCount);
  const [wishlistIds, setWishlistIds] = useState(
    () => new Set(initialWishlistIds),
  );

  useEffect(() => {
    setCartCount(initialCartCount);
  }, [initialCartCount]);

  const wishlistKey = initialWishlistIds.join(",");
  useEffect(() => {
    setWishlistIds(
      new Set(wishlistKey.length > 0 ? wishlistKey.split(",") : []),
    );
  }, [wishlistKey]);

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
      isPending,
    }),
    [
      cartCount,
      wishlistIds.size,
      isWishlisted,
      toggleWishlistItem,
      removeWishlistItem,
      bumpCartCount,
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

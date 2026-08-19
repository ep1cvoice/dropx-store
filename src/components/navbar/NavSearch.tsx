"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
import { createPortal } from "react-dom";

import { formatPrice } from "@/lib/currency";
import { anton, inter } from "@/lib/fonts";
import type { ProductCardData } from "@/types/product";
import { navIconClassName } from "./nav-links";

type NavSearchProps = {
  triggerClassName?: string;
  /** e.g. close the mobile drawer when the search overlay opens */
  onOpen?: () => void;
};

export default function NavSearch({
  triggerClassName = "cursor-pointer text-white/90 transition-colors hover:text-[#e85d2a]",
  onOpen,
}: NavSearchProps) {
  const router = useRouter();
  const inputId = useId();
  const panelId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const portalRoot =
    typeof document !== "undefined"
      ? document.getElementById("nav-search-root")
      : null;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();
  const abortRef = useRef<AbortController | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setLoading(false);
    abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  const trimmedQuery = query.trim();
  const showResults = trimmedQuery.length >= 2;
  const visibleResults = showResults ? results : [];
  const visibleLoading = showResults ? loading : false;

  useEffect(() => {
    const q = query.trim();
    abortRef.current?.abort();

    if (q.length < 2) return;

    const controller = new AbortController();
    abortRef.current = controller;

    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("search failed");
        const data = (await res.json()) as { products: ProductCardData[] };
        setResults(data.products ?? []);
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function goToBrowse(event?: React.FormEvent) {
    event?.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    startTransition(() => {
      router.push(`/browse-all?q=${encodeURIComponent(q)}`);
      close();
    });
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Search"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (open) {
            close();
            return;
          }
          onOpen?.();
          setOpen(true);
        }}
        className={triggerClassName}
      >
        <Search className={navIconClassName} strokeWidth={1.75} />
      </button>

      {open &&
        portalRoot &&
        createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="absolute left-1/2 top-full z-[55] w-[min(100%-1.5rem,600px)] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 bg-[#121212] shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
          >
            <form
              onSubmit={goToBrowse}
              className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-3.5"
            >
              <Search
                className="size-5 shrink-0 text-white/45"
                strokeWidth={1.75}
                aria-hidden
              />
              <label htmlFor={inputId} className="sr-only">
                Search sneakers
              </label>
              <input
                id={inputId}
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sneakers, brands, colors…"
                autoComplete="off"
                enterKeyHint="search"
                className={`${inter.className} w-full bg-transparent text-base text-white placeholder:text-white/35 outline-none`}
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={close}
                className="cursor-pointer p-1 text-white/55 transition-colors hover:text-white"
              >
                <X className="size-5" strokeWidth={1.75} />
              </button>
            </form>

            <div className="max-h-[min(60vh,480px)] overflow-y-auto">
              {query.trim().length < 2 ? (
                <p
                  className={`${inter.className} px-4 py-8 text-center text-sm text-white/40`}
                >
                  Type at least 2 characters to search
                </p>
              ) : visibleLoading ? (
                <p
                  className={`${inter.className} px-4 py-8 text-center text-sm text-white/40`}
                >
                  Searching…
                </p>
              ) : visibleResults.length === 0 ? (
                <p
                  className={`${inter.className} px-4 py-8 text-center text-sm text-white/40`}
                >
                  No products found for “{query.trim()}”
                </p>
              ) : (
                <ul className="divide-y divide-white/8 py-1">
                  {visibleResults.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.slug}${
                          product.variantId
                            ? `?variant=${product.variantId}`
                            : ""
                        }`}
                        onClick={close}
                        className="flex items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-white/5 sm:gap-3 sm:px-4"
                      >
                        <div className="relative size-12 shrink-0 overflow-hidden bg-white/5 sm:size-14">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt=""
                              fill
                              sizes="56px"
                              className="object-contain p-1"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1 pr-1">
                          <p
                            className={`${inter.className} text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40`}
                          >
                            {product.brand}
                          </p>
                          <p
                            className={`${anton.className} truncate text-[15px] uppercase tracking-wide text-white sm:text-base`}
                          >
                            {product.name}
                          </p>
                          {product.stockText ? (
                            <p
                              className={`${inter.className} mt-0.5 text-xs text-white/40`}
                            >
                              {product.stockText}
                            </p>
                          ) : null}
                        </div>
                        <p
                          className={`${inter.className} shrink-0 text-sm font-semibold text-white`}
                        >
                          {formatPrice(product.priceFrom, product.currency)}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {query.trim().length >= 2 && (
              <div className="border-t border-white/10 px-4 py-2">
                <button
                  type="button"
                  onClick={() => goToBrowse()}
                  className={`${inter.className} w-full cursor-pointer py-2.5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#e85d2a] transition-opacity hover:opacity-70`}
                >
                  See all results
                </button>
              </div>
            )}
          </div>,
          portalRoot,
        )}
    </>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { BadgeCheck, User } from "lucide-react";

import { createReview, deleteReview } from "@/actions/reviews";
import StarRating, {
  InteractiveStarRating,
} from "@/components/product/StarRating";
import Button from "@/components/ui/Button";
import { anton, inter } from "@/lib/fonts";
import type {
  ProductReviewItem,
  ReviewEligibility,
  ReviewSummary,
} from "@/types/review";

type ProductReviewsSectionProps = {
  productId: string;
  productSlug: string;
  /** Optional cached summary for first paint; refreshed from API. */
  initialSummary?: ReviewSummary;
  onSummaryChange?: (summary: ReviewSummary) => void;
};

type ReviewsPayload = {
  summary: ReviewSummary;
  reviews: ProductReviewItem[];
  eligibility: ReviewEligibility;
};

function formatReviewDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export default function ProductReviewsSection({
  productId,
  productSlug,
  initialSummary,
  onSummaryChange,
}: ProductReviewsSectionProps) {
  const [summary, setSummary] = useState<ReviewSummary>(
    initialSummary ?? { average: 0, count: 0 },
  );
  const [reviews, setReviews] = useState<ProductReviewItem[]>([]);
  const [eligibility, setEligibility] = useState<ReviewEligibility | null>(
    null,
  );
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loaded, setLoaded] = useState(false);

  const loadReviews = useCallback(async () => {
    const res = await fetch(`/api/products/${productSlug}/reviews`, {
      cache: "no-store",
    });
    if (!res.ok) return;
    const data = (await res.json()) as ReviewsPayload;
    setSummary(data.summary);
    setReviews(data.reviews);
    setEligibility(data.eligibility);
    onSummaryChange?.(data.summary);
    setLoaded(true);
  }, [productSlug, onSummaryChange]);

  useEffect(() => {
    let cancelled = false;
    loadReviews().finally(() => {
      if (!cancelled) setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [loadReviews]);

  function submitReview() {
    setError(null);
    startTransition(async () => {
      const result = await createReview({
        productId,
        productSlug,
        rating,
        body,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setBody("");
      setRating(5);
      await loadReviews();
    });
  }

  function removeReview(reviewId: string) {
    setError(null);
    setDeletingId(reviewId);
    startTransition(async () => {
      const result = await deleteReview({ reviewId, productSlug });
      setDeletingId(null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      await loadReviews();
    });
  }

  return (
    <section
      id="reviews"
      className="mt-16 scroll-mt-24 border-t border-[#ececec] pt-12 md:mt-24 md:pt-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            className={`${anton.className} text-3xl uppercase tracking-wide text-[#121212] md:text-4xl`}
          >
            Reviews
          </h2>
          {summary.count > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StarRating value={summary.average} size={18} />
              <span
                className={`${inter.className} text-sm font-semibold text-[#121212]`}
              >
                {summary.average.toFixed(1)}
              </span>
              <span className={`${inter.className} text-sm text-[#888888]`}>
                · {summary.count} review{summary.count === 1 ? "" : "s"}
              </span>
            </div>
          ) : (
            <p className={`${inter.className} mt-2 text-sm text-[#888888]`}>
              {loaded
                ? "Be the first to review this product."
                : "Loading reviews…"}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 bg-[#f4f4f2] p-5 md:p-6">
        {!eligibility && (
          <p className={`${inter.className} text-sm text-[#888888]`}>
            Checking review eligibility…
          </p>
        )}

        {eligibility?.status === "guest" && (
          <p className={`${inter.className} text-sm text-[#444444]`}>
            <Link
              href={`/login?callbackUrl=/products/${productSlug}`}
              className="font-semibold text-[#121212] underline underline-offset-2 hover:text-[#e85d2a]"
            >
              Sign in
            </Link>{" "}
            after your order is delivered to leave a review.
          </p>
        )}

        {eligibility?.status === "not_purchased" && (
          <p className={`${inter.className} text-sm text-[#444444]`}>
            Buy this pair and leave a review once your order is delivered.
          </p>
        )}

        {eligibility?.status === "already_reviewed" && (
          <p className={`${inter.className} text-sm text-[#444444]`}>
            Thanks — you already reviewed this product. Delete your review
            below if you want to write a new one.
          </p>
        )}

        {eligibility?.status === "eligible" && (
          <div className="flex flex-col gap-4">
            <p
              className={`${inter.className} text-sm font-semibold text-[#121212]`}
            >
              Write a review
            </p>
            <InteractiveStarRating
              value={rating}
              onChange={setRating}
              disabled={isPending}
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={isPending}
              rows={4}
              maxLength={1000}
              placeholder="How do they fit? Feel? Look on foot?"
              className={`${inter.className} w-full resize-y border border-[#e0e0e0] bg-white px-3 py-2.5 text-sm text-[#121212] outline-none placeholder:text-[#aaaaaa] focus:border-[#121212]`}
            />
            {error && (
              <p className={`${inter.className} text-sm text-[#e11d48]`}>
                {error}
              </p>
            )}
            <div>
              <Button
                type="button"
                variant="accent"
                disabled={isPending || body.trim().length < 10}
                onClick={submitReview}
                className="cursor-pointer"
              >
                {isPending && !deletingId ? "Submitting…" : "Submit review"}
              </Button>
            </div>
          </div>
        )}

        {eligibility && eligibility.status !== "eligible" && error && (
          <p className={`${inter.className} mt-3 text-sm text-[#e11d48]`}>
            {error}
          </p>
        )}
      </div>

      {reviews.length > 0 && (
        <ul className="mt-10 divide-y divide-[#ececec]">
          {reviews.map((review) => (
            <li key={review.id} className="flex gap-4 py-6 first:pt-0">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#dcdcda] text-[#8a8a88]"
                aria-hidden
              >
                <User size={22} strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p
                      className={`${inter.className} text-sm font-semibold text-[#121212]`}
                    >
                      {review.authorName}
                      {review.isMine ? " (you)" : ""}
                    </p>
                    {review.verifiedPurchase && (
                      <span
                        className={`${inter.className} inline-flex items-center gap-1 text-xs font-medium text-[#2f7a45]`}
                      >
                        <BadgeCheck size={14} strokeWidth={2} aria-hidden />
                        Verified purchase
                      </span>
                    )}
                  </div>
                  {review.isMine && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => removeReview(review.id)}
                      className={`${inter.className} cursor-pointer text-xs font-semibold text-[#e11d48] transition-opacity hover:opacity-70 disabled:pointer-events-none disabled:opacity-50`}
                    >
                      {deletingId === review.id ? "Deleting…" : "Delete"}
                    </button>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StarRating value={review.rating} size={14} />
                  <span className={`${inter.className} text-xs text-[#888888]`}>
                    {formatReviewDate(review.createdAt)}
                  </span>
                </div>
                <p
                  className={`${inter.className} mt-2 text-sm leading-relaxed text-[#333333]`}
                >
                  {review.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

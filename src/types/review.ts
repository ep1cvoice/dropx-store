export type ReviewSummary = {
  average: number;
  count: number;
};

export type ProductReviewItem = {
  id: string;
  rating: number;
  body: string;
  verifiedPurchase: boolean;
  createdAt: string;
  authorName: string;
  /** True when this review belongs to the signed-in user (can delete). */
  isMine: boolean;
};

export type ReviewEligibility =
  | { status: "guest" }
  | { status: "not_purchased" }
  | { status: "already_reviewed" }
  | { status: "eligible" };

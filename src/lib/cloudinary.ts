/**
 * Cloudinary URL helpers for product images.
 *
 * Upload assets in the Cloudinary Media Library under folder `dropx/`,
 * then store either a full HTTPS URL or a public_id in `imageUrl`.
 *
 * Env (public — safe in the browser):
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export type CloudinaryTransform = {
  width?: number;
  height?: number;
  /** Cloudinary quality: "auto" | number */
  quality?: "auto" | number;
  /** Crop mode when height/width set — default "fill" */
  crop?: "fill" | "fit" | "limit" | "scale";
};

/** True when Cloudinary is configured for this deploy. */
export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME && CLOUD_NAME.trim() !== "");
}

/**
 * Build a delivery URL from a Cloudinary public_id.
 * Example public_id: `dropx/products/nike-dunk-low-panda`
 */
export function cloudinaryUrl(
  publicId: string,
  transform: CloudinaryTransform = {},
): string | null {
  if (!isCloudinaryConfigured() || !publicId) return null;

  const {
    width,
    height,
    quality = "auto",
    crop = "fill",
  } = transform;

  const parts = ["f_auto", `q_${quality}`];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (width || height) parts.push(`c_${crop}`);

  const transforms = parts.join(",");
  const id = publicId.replace(/^\/+/, "").replace(/\.(jpe?g|png|webp|gif|avif)$/i, "");

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${id}`;
}

/**
 * Normalize whatever we store in DB into a usable image src for next/image.
 * - Full https URL → returned as-is (Unsplash, Cloudinary, etc.)
 * - Relative /public path → returned as-is
 * - Bare public_id → Cloudinary delivery URL (when configured)
 */
export function resolveProductImage(
  imageUrl: string | null | undefined,
  transform: CloudinaryTransform = { width: 800 },
): string | null {
  if (!imageUrl) return null;

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("/")
  ) {
    return imageUrl;
  }

  return cloudinaryUrl(imageUrl, transform);
}

/** Suggested folder layout in Cloudinary Media Library. */
export const CLOUDINARY_FOLDERS = {
  products: "dropx/products",
  heroes: "dropx/heroes",
} as const;

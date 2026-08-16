"use server";

import { revalidatePath } from "next/cache";

import { logAdminActivity, requireAdmin } from "@/lib/admin";
import { deriveColorFamily } from "@/lib/admin-color";
import { slugify } from "@/lib/admin-slug";
import { prisma } from "@/lib/prisma";
import type {
  ProductBadge,
  ProductCategory,
  ProductGender,
} from "@/generated/prisma/client";

export const DEFAULT_EU_SIZES = Array.from({ length: 9 }, (_, i) => `EU ${38 + i}`);

export type ProductFields = {
  name: string;
  slug: string;
  brandId: string;
  category: ProductCategory;
  gender: ProductGender;
  description?: string | null;
  badge?: ProductBadge | null;
  discountValue?: number | null;
  featured?: boolean;
  availableAt?: string | null;
  heroImageUrl?: string | null;
  archived?: boolean;
};

export type ActionResult =
  | { ok: true; id?: string; slug?: string }
  | { ok: false; error: string };

function parseBadge(value: FormDataEntryValue | null): ProductBadge | null {
  const raw = String(value ?? "").trim();
  if (!raw || raw === "none") return null;
  return raw as ProductBadge;
}

function parseDiscountValue(raw: string): number | null {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0 || n > 99) {
    throw new Error("Discount must be a number between 0 and 99.");
  }
  return Math.round(n);
}

function parseAvailableAt(raw: string): string | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) {
    throw new Error("Available at must be a valid date and time.");
  }
  return d.toISOString();
}

function parseProductFields(formData: FormData): ProductFields {
  const discountRaw = String(formData.get("discountValue") ?? "").trim();
  const availableRaw = String(formData.get("availableAt") ?? "").trim();

  return {
    name: String(formData.get("name") ?? "").trim(),
    slug: slugify(String(formData.get("slug") ?? "").trim()),
    brandId: String(formData.get("brandId") ?? "").trim(),
    category: String(formData.get("category") ?? "lifestyle") as ProductCategory,
    gender: String(formData.get("gender") ?? "unisex") as ProductGender,
    description: String(formData.get("description") ?? "").trim() || null,
    badge: parseBadge(formData.get("badge")),
    discountValue: parseDiscountValue(discountRaw),
    featured: formData.get("featured") === "on",
    availableAt: parseAvailableAt(availableRaw),
    heroImageUrl: String(formData.get("heroImageUrl") ?? "").trim() || null,
    archived: formData.get("archived") === "on",
  };
}

function isNextRedirect(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "digest" in e &&
    typeof (e as { digest: unknown }).digest === "string" &&
    String((e as { digest: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

function actionError(e: unknown, fallback: string): ActionResult {
  if (isNextRedirect(e)) throw e;
  return {
    ok: false,
    error: e instanceof Error ? e.message : fallback,
  };
}

function revalidateProductPaths(slug?: string) {
  revalidatePath("/admin/products");
  revalidatePath("/");
  if (slug) revalidatePath(`/products/${slug}`);
}

async function ensureUniqueSlug(slug: string, excludeId?: string) {
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing && existing.id !== excludeId) {
    throw new Error("A product with this slug already exists.");
  }
}

export async function createProduct(
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  let fields: ProductFields;
  try {
    fields = parseProductFields(formData);
  } catch (e) {
    return actionError(e, "Invalid product fields.");
  }

  const price = Number(formData.get("price"));
  const color = String(formData.get("color") ?? "").trim();
  const colorHex = String(formData.get("colorHex") ?? "#888888").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;

  if (!fields.name || !fields.slug || !fields.brandId) {
    return { ok: false, error: "Name, slug, and brand are required." };
  }
  if (!Number.isFinite(price) || price <= 0) {
    return { ok: false, error: "A valid price is required." };
  }
  if (!color) {
    return { ok: false, error: "Color is required for the initial variant." };
  }

  try {
    await ensureUniqueSlug(fields.slug);

    const product = await prisma.product.create({
      data: {
        name: fields.name,
        slug: fields.slug,
        brandId: fields.brandId,
        category: fields.category,
        gender: fields.gender,
        description: fields.description,
        badge: fields.badge,
        discountValue: fields.discountValue,
        featured: fields.featured ?? false,
        availableAt: fields.availableAt ? new Date(fields.availableAt) : null,
        heroImageUrl: fields.heroImageUrl,
        archived: fields.archived ?? false,
        variants: {
          create: {
            color,
            colorHex,
            colorFamily: deriveColorFamily(color),
            price,
            imageUrl,
            sizes: {
              create: DEFAULT_EU_SIZES.map((size) => ({ size, stock: 0 })),
            },
          },
        },
      },
      select: { id: true, slug: true },
    });

    await logAdminActivity({
      actorId: admin.id,
      action: "product.create",
      entityType: "product",
      entityId: product.id,
      message: `Created product "${fields.name}"`,
    });

    revalidateProductPaths(product.slug);
    return { ok: true, id: product.id, slug: product.slug };
  } catch (e) {
    return actionError(e, "Failed to create product.");
  }
}

export async function updateProduct(
  productId: string,
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  let fields: ProductFields;
  try {
    fields = parseProductFields(formData);
  } catch (e) {
    return actionError(e, "Invalid product fields.");
  }

  if (!fields.name || !fields.slug || !fields.brandId) {
    return { ok: false, error: "Name, slug, and brand are required." };
  }

  try {
    await ensureUniqueSlug(fields.slug, productId);

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: fields.name,
        slug: fields.slug,
        brandId: fields.brandId,
        category: fields.category,
        gender: fields.gender,
        description: fields.description,
        badge: fields.badge,
        discountValue: fields.discountValue,
        featured: fields.featured ?? false,
        availableAt: fields.availableAt ? new Date(fields.availableAt) : null,
        heroImageUrl: fields.heroImageUrl,
        archived: fields.archived ?? false,
      },
      select: { id: true, slug: true, name: true },
    });

    await logAdminActivity({
      actorId: admin.id,
      action: "product.update",
      entityType: "product",
      entityId: product.id,
      message: `Updated product "${product.name}"`,
    });

    revalidateProductPaths(product.slug);
    return { ok: true, id: product.id, slug: product.slug };
  } catch (e) {
    return actionError(e, "Failed to update product.");
  }
}

export async function upsertProduct(formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "").trim();
  if (id) return updateProduct(id, formData);
  return createProduct(formData);
}

export async function updateVariant(
  variantId: string,
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  const color = String(formData.get("color") ?? "").trim();
  const colorHex = String(formData.get("colorHex") ?? "").trim();
  const colorFamilyRaw = String(formData.get("colorFamily") ?? "").trim();
  const price = Number(formData.get("price"));
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const description =
    String(formData.get("description") ?? "").trim() || null;

  if (!color || !colorHex) {
    return { ok: false, error: "Color and color hex are required." };
  }
  if (!Number.isFinite(price) || price <= 0) {
    return { ok: false, error: "A valid price is required." };
  }

  try {
    const existing = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: {
        price: true,
        color: true,
        product: { select: { slug: true, name: true } },
      },
    });
    if (!existing) return { ok: false, error: "Variant not found." };

    const colorFamily = deriveColorFamily(color, colorFamilyRaw);

    await prisma.productVariant.update({
      where: { id: variantId },
      data: { color, colorHex, colorFamily, price, imageUrl, description },
    });

    if (existing.price !== price) {
      await logAdminActivity({
        actorId: admin.id,
        action: "price.update",
        entityType: "variant",
        entityId: variantId,
        message: `Price for "${existing.product.name}" (${existing.color}) changed from ${existing.price} to ${price}`,
        meta: { from: existing.price, to: price },
      });
    }

    revalidateProductPaths(existing.product.slug);
    return { ok: true };
  } catch (e) {
    return actionError(e, "Failed to update variant.");
  }
}

export async function addVariant(
  productId: string,
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  const color = String(formData.get("color") ?? "").trim();
  const colorHex = String(formData.get("colorHex") ?? "#888888").trim();
  const colorFamilyRaw = String(formData.get("colorFamily") ?? "").trim();
  const price = Number(formData.get("price"));
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;

  if (!color) return { ok: false, error: "Color is required." };
  if (!Number.isFinite(price) || price <= 0) {
    return { ok: false, error: "A valid price is required." };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true, name: true },
    });
    if (!product) return { ok: false, error: "Product not found." };

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        color,
        colorHex,
        colorFamily: deriveColorFamily(color, colorFamilyRaw),
        price,
        imageUrl,
        sizes: {
          create: DEFAULT_EU_SIZES.map((size) => ({ size, stock: 0 })),
        },
      },
      select: { id: true },
    });

    await logAdminActivity({
      actorId: admin.id,
      action: "variant.create",
      entityType: "variant",
      entityId: variant.id,
      message: `Added variant "${color}" to "${product.name}"`,
    });

    revalidateProductPaths(product.slug);
    return { ok: true, id: variant.id };
  } catch (e) {
    return actionError(e, "Failed to add variant.");
  }
}

export async function updateSizeStock(
  sizeId: string,
  stock: number,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  if (!Number.isInteger(stock) || stock < 0) {
    return { ok: false, error: "Stock must be a non-negative integer." };
  }

  try {
    const existing = await prisma.variantSize.findUnique({
      where: { id: sizeId },
      select: {
        stock: true,
        size: true,
        variant: {
          select: {
            color: true,
            product: { select: { slug: true, name: true } },
          },
        },
      },
    });
    if (!existing) return { ok: false, error: "Size not found." };

    if (existing.stock === stock) return { ok: true };

    await prisma.variantSize.update({
      where: { id: sizeId },
      data: { stock },
    });

    await logAdminActivity({
      actorId: admin.id,
      action: "stock.update",
      entityType: "variant_size",
      entityId: sizeId,
      message: `Stock for "${existing.variant.product.name}" (${existing.variant.color}, ${existing.size}) changed from ${existing.stock} to ${stock}`,
      meta: { from: existing.stock, to: stock },
    });

    revalidateProductPaths(existing.variant.product.slug);
    return { ok: true };
  } catch (e) {
    return actionError(e, "Failed to update stock.");
  }
}

export async function setProductArchived(
  productId: string,
  archived: boolean,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { archived },
      select: { slug: true, name: true, archived: true },
    });

    await logAdminActivity({
      actorId: admin.id,
      action: archived ? "product.archive" : "product.unarchive",
      entityType: "product",
      entityId: productId,
      message: archived
        ? `Archived product "${product.name}"`
        : `Unarchived product "${product.name}"`,
    });

    revalidateProductPaths(product.slug);
    return { ok: true };
  } catch (e) {
    return actionError(e, "Failed to update archive state.");
  }
}

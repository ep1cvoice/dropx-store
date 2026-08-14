"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { addVariant, updateProduct, updateVariant } from "@/actions/admin/products";
import StockInput from "@/components/admin/StockInput";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { inter } from "@/lib/fonts";
import {
  PRODUCT_BADGES,
  PRODUCT_CATEGORIES,
  PRODUCT_GENDERS,
  type AdminProductBadge,
  type AdminProductCategory,
  type AdminProductGender,
} from "@/types/admin";

type BrandOption = { id: string; name: string };

type VariantSize = { id: string; size: string; stock: number };

type Variant = {
  id: string;
  color: string;
  colorHex: string;
  colorFamily: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
  sizes: VariantSize[];
};

type ProductEditFormProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    brandId: string;
    category: AdminProductCategory;
    gender: AdminProductGender;
    description: string | null;
    badge: AdminProductBadge | null;
    discountValue: number | null;
    featured: boolean;
    availableAt: string | null;
    heroImageUrl: string | null;
    archived: boolean;
    variants: Variant[];
  };
  brands: BrandOption[];
};

const fieldClass = `${inter.className} w-full rounded-none border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400`;
const selectClass = `${fieldClass} cursor-pointer`;

export default function ProductEditForm({ product, brands }: ProductEditFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const availableAtValue = product.availableAt
    ? product.availableAt.slice(0, 16)
    : "";

  function handleProductSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProduct(product.id, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(true);
      router.refresh();
    });
  }

  function handleVariantSubmit(variantId: string, form: HTMLFormElement) {
    setError(null);
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await updateVariant(variantId, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleAddVariant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await addVariant(product.id, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      (e.target as HTMLFormElement).reset();
      router.refresh();
    });
  }

  return (
    <div className="space-y-10">
      {error && (
        <p className={`${inter.className} text-sm text-red-600`} role="alert">
          {error}
        </p>
      )}
      {saved && (
        <p className={`${inter.className} text-sm text-[#1f9d55]`}>Product saved.</p>
      )}

      <section>
        <h2 className={`${inter.className} mb-4 text-sm font-semibold uppercase tracking-wide text-[#666666]`}>
          Product details
        </h2>
        <form onSubmit={handleProductSubmit} className="max-w-2xl space-y-4">
          <Input id="name" name="name" label="Name" defaultValue={product.name} required />
          <Input id="slug" name="slug" label="Slug" defaultValue={product.slug} required />

          <div>
            <label htmlFor="brandId" className={`${inter.className} mb-2 block text-sm text-gray-500`}>
              Brand
            </label>
            <select id="brandId" name="brandId" defaultValue={product.brandId} required className={selectClass}>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className={`${inter.className} mb-2 block text-sm text-gray-500`}>
                Category
              </label>
              <select id="category" name="category" defaultValue={product.category} className={selectClass}>
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="gender" className={`${inter.className} mb-2 block text-sm text-gray-500`}>
                Gender
              </label>
              <select id="gender" name="gender" defaultValue={product.gender} className={selectClass}>
                {PRODUCT_GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className={`${inter.className} mb-2 block text-sm text-gray-500`}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={product.description ?? ""}
              className={fieldClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="badge" className={`${inter.className} mb-2 block text-sm text-gray-500`}>
                Badge
              </label>
              <select id="badge" name="badge" defaultValue={product.badge ?? "none"} className={selectClass}>
                <option value="none">None</option>
                {PRODUCT_BADGES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <Input
              id="discountValue"
              name="discountValue"
              label="Discount %"
              type="number"
              min="0"
              max="99"
              defaultValue={product.discountValue ?? ""}
            />
          </div>

          <Input
            id="availableAt"
            name="availableAt"
            label="Available at (ISO datetime-local)"
            type="datetime-local"
            defaultValue={availableAtValue}
          />
          <Input
            id="heroImageUrl"
            name="heroImageUrl"
            label="Hero image URL"
            type="url"
            defaultValue={product.heroImageUrl ?? ""}
          />

          <label className={`${inter.className} flex cursor-pointer items-center gap-2 text-sm`}>
            <input type="checkbox" name="featured" defaultChecked={product.featured} className="cursor-pointer rounded-none" />
            Featured
          </label>
          <label className={`${inter.className} flex cursor-pointer items-center gap-2 text-sm`}>
            <input type="checkbox" name="archived" defaultChecked={product.archived} className="cursor-pointer rounded-none" />
            Archived
          </label>

          <Button type="submit" variant="accent" disabled={pending}>
            {pending ? "Saving…" : "Save product"}
          </Button>
        </form>
      </section>

      <section>
        <h2 className={`${inter.className} mb-4 text-sm font-semibold uppercase tracking-wide text-[#666666]`}>
          Variants & stock
        </h2>
        <div className="space-y-8">
          {product.variants.map((variant) => (
            <div key={variant.id} className="border border-black/10 bg-white p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVariantSubmit(variant.id, e.currentTarget);
                }}
                className="grid gap-4 md:grid-cols-2"
              >
                <Input id={`color-${variant.id}`} name="color" label="Color" defaultValue={variant.color} required />
                <Input id={`hex-${variant.id}`} name="colorHex" label="Color hex" defaultValue={variant.colorHex} required />
                <Input id={`family-${variant.id}`} name="colorFamily" label="Color family" defaultValue={variant.colorFamily} />
                <Input id={`price-${variant.id}`} name="price" label="Price" type="number" min="0.01" step="0.01" defaultValue={variant.price} required />
                <Input id={`img-${variant.id}`} name="imageUrl" label="Image URL" type="url" defaultValue={variant.imageUrl ?? ""} wrapperClassName="md:col-span-2" />
                <div className="md:col-span-2">
                  <Button type="submit" variant="outline" className="px-4 py-2 text-xs" disabled={pending}>
                    Save variant
                  </Button>
                </div>
              </form>

              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {variant.sizes.map((sz) => (
                  <StockInput
                    key={sz.id}
                    sizeId={sz.id}
                    initialStock={sz.stock}
                    sizeLabel={sz.size.replace("EU ", "")}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddVariant} className="mt-6 max-w-md space-y-3 border border-dashed border-black/20 p-4">
          <p className={`${inter.className} text-sm font-medium text-[#333333]`}>Add variant</p>
          <Input id="new-color" name="color" label="Color" required />
          <Input id="new-hex" name="colorHex" label="Color hex" defaultValue="#888888" />
          <Input id="new-price" name="price" label="Price" type="number" min="0.01" step="0.01" required />
          <Input id="new-image" name="imageUrl" label="Image URL" type="url" />
          <Button type="submit" variant="outline" className="px-4 py-2 text-xs" disabled={pending}>
            Add variant
          </Button>
        </form>
      </section>
    </div>
  );
}

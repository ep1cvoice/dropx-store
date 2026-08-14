"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { createProduct } from "@/actions/admin/products";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { slugify } from "@/lib/admin-slug";
import { inter } from "@/lib/fonts";
import { PRODUCT_CATEGORIES, PRODUCT_GENDERS } from "@/types/admin";

type BrandOption = { id: string; name: string };

type ProductCreateFormProps = {
  brands: BrandOption[];
};

const selectClass = `${inter.className} w-full cursor-pointer rounded-none border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400`;

export default function ProductCreateForm({ brands }: ProductCreateFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createProduct(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/admin/products/${result.id}/edit`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {error && (
        <p className={`${inter.className} text-sm text-red-600`} role="alert">
          {error}
        </p>
      )}

      <Input
        id="name"
        name="name"
        label="Product name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        id="slug"
        name="slug"
        label="Slug"
        required
        value={slug}
        onChange={(e) => {
          setSlugTouched(true);
          setSlug(e.target.value);
        }}
      />

      <div>
        <label htmlFor="brandId" className={`${inter.className} mb-2 block text-sm text-gray-500`}>
          Brand
        </label>
        <select id="brandId" name="brandId" required className={selectClass}>
          <option value="">Select brand…</option>
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
          <select id="category" name="category" className={selectClass}>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="gender" className={`${inter.className} mb-2 block text-sm text-gray-500`}>
            Gender
          </label>
          <select id="gender" name="gender" className={selectClass}>
            {PRODUCT_GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="price" name="price" label="Price (EUR)" type="number" min="0.01" step="0.01" required />
        <Input id="color" name="color" label="Initial colorway" required placeholder="e.g. Triple White" />
      </div>

      <Input id="colorHex" name="colorHex" label="Color hex" defaultValue="#F5F5F5" />
      <Input id="imageUrl" name="imageUrl" label="Variant image URL" type="url" placeholder="https://…" />

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="accent" disabled={pending}>
          {pending ? "Creating…" : "Create product"}
        </Button>
      </div>
    </form>
  );
}

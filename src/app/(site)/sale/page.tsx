import { redirect } from "next/navigation";

type SalePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/** Legacy route — collection filter lives on /browse-all. */
export default async function SalePage({ searchParams }: SalePageProps) {
  const resolved = await searchParams;
  const params = new URLSearchParams();
  params.set("collection", "sale");
  for (const [key, value] of Object.entries(resolved)) {
    if (key === "collection" || value == null) continue;
    const v = Array.isArray(value) ? value[0] : value;
    if (v) params.set(key, v);
  }
  redirect(`/browse-all?${params.toString()}`);
}

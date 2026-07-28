import { redirect } from "next/navigation";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/** Legacy route — brand filter lives on /browse-all. */
export default async function BrandPage({
  params,
  searchParams,
}: BrandPageProps) {
  const { slug } = await params;
  const resolved = await searchParams;
  const query = new URLSearchParams();
  query.set("brand", slug);
  for (const [key, value] of Object.entries(resolved)) {
    if (key === "brand" || value == null) continue;
    const v = Array.isArray(value) ? value[0] : value;
    if (v) query.set(key, v);
  }
  redirect(`/browse-all?${query.toString()}`);
}

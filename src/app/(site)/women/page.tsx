import { redirect } from "next/navigation";

type WomenPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/** Legacy route — gender filter lives on /browse-all. */
export default async function WomenPage({ searchParams }: WomenPageProps) {
  const resolved = await searchParams;
  const params = new URLSearchParams();
  params.set("gender", "women");
  for (const [key, value] of Object.entries(resolved)) {
    if (key === "gender" || value == null) continue;
    const v = Array.isArray(value) ? value[0] : value;
    if (v) params.set(key, v);
  }
  redirect(`/browse-all?${params.toString()}`);
}

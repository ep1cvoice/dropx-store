import { NextResponse } from "next/server";

import { getProductCardsByIds } from "@/lib/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("ids") ?? "";
  const ids = raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 12);

  if (ids.length === 0) {
    return NextResponse.json({ products: [] });
  }

  const products = await getProductCardsByIds(ids);
  return NextResponse.json({ products });
}

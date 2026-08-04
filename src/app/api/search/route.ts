import { NextResponse } from "next/server";

import { searchProducts } from "@/lib/catalog";
import { normalizeSearchQuery } from "@/lib/listing";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = normalizeSearchQuery(searchParams.get("q"));

  if (q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  const products = await searchProducts(q, 8);
  return NextResponse.json({ products });
}

import {
  normalizeSearchQuery,
  searchQueryAsSlug,
  searchQueryTokens,
} from "@/lib/listing";

/** Fields free-text search can hit (mirrors catalog `textSearchWhere`). */
export type SearchableProduct = {
  name: string;
  slug: string;
  brandName: string;
  brandSlug: string;
  /** Colourway labels on variants, e.g. "Infrared". */
  colors?: string[];
};

function includesInsensitive(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

function tokenHitsProduct(product: SearchableProduct, token: string): boolean {
  const slugToken = searchQueryAsSlug(token);
  const colors = product.colors ?? [];

  return (
    includesInsensitive(product.name, token) ||
    includesInsensitive(product.slug, token) ||
    includesInsensitive(product.slug, slugToken) ||
    includesInsensitive(product.brandName, token) ||
    includesInsensitive(product.brandSlug, slugToken) ||
    colors.some((color) => includesInsensitive(color, token))
  );
}

function phraseHitsProduct(product: SearchableProduct, query: string): boolean {
  const slugQuery = searchQueryAsSlug(query);
  const colors = product.colors ?? [];

  return (
    includesInsensitive(product.name, query) ||
    includesInsensitive(product.slug, query) ||
    includesInsensitive(product.slug, slugQuery) ||
    includesInsensitive(product.brandName, query) ||
    includesInsensitive(product.brandSlug, slugQuery) ||
    colors.some((color) => includesInsensitive(color, query))
  );
}

/**
 * In-memory free-text match used to lock search semantics in unit tests.
 * Multi-word queries succeed when every token hits at least one field
 * (brand + model often live in different columns).
 */
export function matchesSearchQuery(
  product: SearchableProduct,
  q: string,
): boolean {
  const query = normalizeSearchQuery(q);
  if (query.length < 2) return false;

  if (phraseHitsProduct(product, query)) return true;

  const tokens = searchQueryTokens(query);
  if (tokens.length <= 1) return false;

  return tokens.every((token) => tokenHitsProduct(product, token));
}

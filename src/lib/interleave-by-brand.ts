/**
 * Round-robin products across brands so a catalog grid does not read as
 * "all Nike, then all Adidas…". Order within each brand is preserved
 * (callers should pass newest-first). Brand queue order is alphabetical
 * so pagination stays stable across requests.
 */
export function interleaveByBrand<T extends { brand: string }>(
  products: T[],
): T[] {
  if (products.length <= 1) return products;

  const queues = new Map<string, T[]>();
  for (const product of products) {
    const list = queues.get(product.brand);
    if (list) list.push(product);
    else queues.set(product.brand, [product]);
  }

  if (queues.size <= 1) return products;

  const brandQueues = [...queues.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, queue]) => queue);

  const mixed: T[] = [];
  while (brandQueues.some((queue) => queue.length > 0)) {
    for (const queue of brandQueues) {
      const next = queue.shift();
      if (next) mixed.push(next);
    }
  }
  return mixed;
}

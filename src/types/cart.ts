/**
 * Represents a single line item in the user's cart.
 *
 * When connected to the DB, a cart line item should reference:
 *   - productId   → Product
 *   - variantId   → ProductVariant (the selected color)
 *   - sizeId      → VariantSize    (the selected size, also holds current stock)
 *
 * Prisma schema (add when ready):
 *
 * model CartItem {
 *   id        String         @id @default(cuid())
 *   cartId    String
 *   cart      Cart           @relation(fields: [cartId], references: [id])
 *   sizeId    String
 *   size      VariantSize    @relation(fields: [sizeId], references: [id])
 *   quantity  Int            @default(1)
 *   createdAt DateTime       @default(now())
 *   updatedAt DateTime       @updatedAt
 * }
 */
export type CartItem = {
  id: string;
  productId: string;
  /** Product slug — used to link back to the product detail page. */
  slug: string;
  variantId: string;
  sizeId: string;
  name: string;
  brand: string;
  color: string;
  size: string;
  imageUrl: string | null;
  price: number;
  currency: string;
  quantity: number;
  /** Max purchasable quantity — sourced from VariantSize.stock */
  maxStock: number;
};

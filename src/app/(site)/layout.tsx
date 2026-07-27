import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { StoreBagProvider } from "@/components/providers/StoreBagProvider";
import { getCartItemCount } from "@/lib/cart";
import { getWishlistVariantIds } from "@/lib/wishlist";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cartCount, wishlistIds] = await Promise.all([
    getCartItemCount(),
    getWishlistVariantIds(),
  ]);

  return (
    <StoreBagProvider
      initialCartCount={cartCount}
      initialWishlistIds={[...wishlistIds]}
    >
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </StoreBagProvider>
  );
}

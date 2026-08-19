import ContactBar from "@/components/footer/ContactBar";
import Footer from "@/components/footer/Footer";
import PaymentShippingBar from "@/components/footer/PaymentShippingBar";
import Navbar from "@/components/navbar/Navbar";
import { StoreBagProvider } from "@/components/providers/StoreBagProvider";

/**
 * Layout stays free of auth/DB so catalog pages can use ISR.
 * Cart + wishlist hydrate client-side via /api/store-bag.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreBagProvider>
      <Navbar />
      <main className="min-w-0 flex-1">{children}</main>
      <ContactBar />
      <Footer />
      <PaymentShippingBar />
    </StoreBagProvider>
  );
}

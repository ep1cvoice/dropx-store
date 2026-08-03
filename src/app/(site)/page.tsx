import DropListSection from "@/components/home/DropListSection";
import HomeHeroDesktop from "@/components/home/HomeHero";
import UpcomingDropSection from "@/components/home/UpcomingDropSection";
import ShopByCategorySection from "@/components/home/ShopByCategorySection";
import BrandPartnersSection from "@/components/home/BrandPartnersSection";
import StoreBenefitsSection from "@/components/home/StoreBenefitsSection";
import NewDropsSection from "@/components/home/NewDropsSection";
import GenderShopSection from "@/components/home/GenderShopSection";
import FeaturedPicksSection from "@/components/home/FeaturedPicksSection";
import CultureHeroSection from "@/components/home/CultureHeroSection";
import HottestDropsPromoSection from "@/components/home/HottestDropsPromoSection";
import BrowseAllSneakersSection from "@/components/home/BrowseAllSneakersSection";
import { getHomeProductRails } from "@/lib/catalog";

/** Fresh random product rails on every request. */
export const dynamic = "force-dynamic";

export default async function Home() {
  const { newDrops, featured, browseAll } = await getHomeProductRails();

  return (
    <>
      <HomeHeroDesktop />
      <UpcomingDropSection />
      <BrandPartnersSection />
      <StoreBenefitsSection />
      <NewDropsSection products={newDrops} />
      <HottestDropsPromoSection />
      <GenderShopSection />
      <FeaturedPicksSection products={featured} />
      <CultureHeroSection />
      <ShopByCategorySection />
      <BrowseAllSneakersSection products={browseAll} />
      <DropListSection />
    </>
  );
}

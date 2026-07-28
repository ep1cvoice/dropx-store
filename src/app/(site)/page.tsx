import DropListSection from "@/components/home/DropListSection";
import HomeHeroDesktop from "@/components/home/HomeHero";
import UpcomingDropSection from "@/components/home/UpcomingDropSection";
import ShopByCategorySection from "@/components/home/ShopByCategorySection";
import BrandPartnersSection from "@/components/home/BrandPartnersSection";
import StoreBenefitsSection from "@/components/home/StoreBenefitsSection";
import NewDropsSection from "@/components/home/NewDropsSection";
import GenderShopSection from "@/components/home/GenderShopSection";
import TrendingNowSection from "@/components/home/FeaturedPicksSection";
import CultureHeroSection from "@/components/home/CultureHeroSection";
import HottestDropsPromoSection from "@/components/home/HottestDropsPromoSection";
import BrowseAllSneakersSection from "@/components/home/BrowseAllSneakersSection";

export default function Home() {
  return (
    <>
      <HomeHeroDesktop />
      <UpcomingDropSection />
      <BrandPartnersSection />
      <StoreBenefitsSection />
      <NewDropsSection />
      <HottestDropsPromoSection />
      <GenderShopSection />
      <TrendingNowSection />
      <CultureHeroSection />
      <ShopByCategorySection />
      <BrowseAllSneakersSection />
      <DropListSection />
    </>
  );
}

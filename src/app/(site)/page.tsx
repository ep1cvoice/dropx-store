import DropListSection from "@/components/home/DropListSection";
import HomeHeroDesktop from "@/components/home/HomeHero";
import UpcomingDropSection from "@/components/home/UpcomingDropSection";
import ShopByCategorySection from "@/components/home/ShopByCategorySection";
import BrandPartnersSection from "@/components/home/BrandPartnersSection";
import NewDropsSection from "@/components/home/NewDropsSection";
import TrendingNowSection from "@/components/home/FeaturedPicksSection";
import BrowseAllSneakersSection from "@/components/home/BrowseAllSneakersSection";

export default function Home() {
  return (
    <>
      <HomeHeroDesktop />
      <UpcomingDropSection />
      <BrandPartnersSection />
      <NewDropsSection />
      <TrendingNowSection />
      <ShopByCategorySection />
      <BrowseAllSneakersSection />
      <DropListSection />
    </>
  );
}

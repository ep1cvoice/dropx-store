import DropListSection from "@/components/home/DropListSection";
import HomeHeroDesktop from "@/components/home/HomeHero";
import UpcomingDropSection from "@/components/home/UpcomingDropSection";
import ShopByCategorySection from "@/components/home/ShopByCategorySection";
import BrandPartnersSection from "@/components/home/BrandPartnersSection";

export default function Home() {
  return (
    <>
      <HomeHeroDesktop />
      <UpcomingDropSection />
      <BrandPartnersSection />
      <ShopByCategorySection />
      <DropListSection />
    </>
  );
}

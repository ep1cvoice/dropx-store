import { Suspense } from "react";

import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import TopBar from "./TopBar";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 text-white">
      <TopBar />
      <div className="relative bg-[#121212]">
        <div className="hidden min-[1200px]:block">
          <Suspense fallback={<div className="h-[76px]" />}>
            <NavbarDesktop />
          </Suspense>
        </div>
        <div className="min-[1200px]:hidden">
          <NavbarMobile />
        </div>
        {/* Search dropdown mounts here so it sticks with the nav */}
        <div id="nav-search-root" />
      </div>
    </header>
  );
}

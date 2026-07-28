import { Suspense } from "react";

import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import TopBar from "./TopBar";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 text-white">
      <TopBar />
      <div className="bg-[#121212]">
        <div className="hidden lg:block">
          <Suspense fallback={<div className="h-[76px]" />}>
            <NavbarDesktop />
          </Suspense>
        </div>
        <div className="lg:hidden">
          <NavbarMobile />
        </div>
      </div>
    </header>
  );
}

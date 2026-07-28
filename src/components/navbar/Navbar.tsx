import { Suspense } from "react";

import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

export default function Navbar() {
  return (
    <header className="bg-[#121212] text-white sticky top-0 z-50">
      <div className="hidden lg:block">
        <Suspense fallback={<div className="h-[76px]" />}>
          <NavbarDesktop />
        </Suspense>
      </div>
      <div className="lg:hidden">
        <NavbarMobile />
      </div>
    </header>
  );
}

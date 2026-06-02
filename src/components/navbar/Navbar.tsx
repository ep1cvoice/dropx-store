import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";


export default function Navbar() {
  return (
    <header className="bg-[#121212] text-white">
      <div className="hidden lg:block">
        <NavbarDesktop />
      </div>
      <div className="lg:hidden">
        <NavbarMobile />
      </div>
    </header>
  );
}

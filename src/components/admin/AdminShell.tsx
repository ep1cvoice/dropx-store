"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

import { ADMIN_NAV } from "@/components/admin/adminNav";
import { anton, inter } from "@/lib/fonts";

type AdminShellProps = {
  adminName: string;
  children: React.ReactNode;
};

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className={`${inter.className} flex flex-col gap-0.5`}>
      {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin"
            ? pathname === "/admin"
            : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-[#e85d2a] text-white"
                : "text-[#333333] hover:bg-black/5"
            }`}
          >
            <Icon size={18} strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminShell({ adminName, children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#121212]">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center">
          {/* Aligns with sidebar column on desktop */}
          <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 lg:w-56 lg:flex-none lg:px-4">
            <button
              type="button"
              className="cursor-pointer p-1 lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link
              href="/admin"
              className={`${anton.className} cursor-pointer text-xl tracking-wide`}
            >
              DROPX ADMIN
            </Link>
          </div>

          {/* Aligns with main content padding on desktop */}
          <div
            className={`${inter.className} flex min-w-0 flex-1 items-center justify-end gap-4 px-4 py-3 text-sm md:px-6 lg:px-8`}
          >
            <span className="hidden truncate text-[#666666] sm:inline">
              {adminName}
            </span>
            <Link
              href="/"
              className="inline-flex cursor-pointer items-center gap-1 font-medium text-[#e85d2a] hover:opacity-80"
            >
              Storefront
              <ExternalLink size={14} />
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex cursor-pointer items-center gap-1 font-medium text-[#e11d48] hover:opacity-80"
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        <aside className="hidden w-56 shrink-0 border-r border-black/10 bg-white p-4 lg:block">
          <NavLinks pathname={pathname} />
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 cursor-pointer bg-black/40"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative h-full w-64 bg-white p-4 shadow-xl">
              <NavLinks
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

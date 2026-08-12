"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, User } from "lucide-react";

import { ACCOUNT_NAV } from "./accountNav";
import { inter } from "@/lib/fonts";

type AccountSidebarProps = {
  name: string;
  email: string;
  isAdmin?: boolean;
};

export default function AccountSidebar({ name, email, isAdmin }: AccountSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href ||
    pathname.startsWith(`${href}/`) ||
    (href === "/account/orders" && pathname === "/account");

  return (
    <div className="rounded-none bg-[#f4f4f2] p-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-none bg-[#dcdcda] text-[#8a8a88]">
          <User size={32} strokeWidth={1.75} />
        </div>
        <p
          className={`${inter.className} mt-4 text-lg font-bold text-[#121212]`}
        >
          {name}
        </p>
        <p className={`${inter.className} mt-0.5 text-sm text-[#888888]`}>
          {email}
        </p>
      </div>

      <nav className={`${inter.className} mt-6 flex flex-col gap-1`}>
        {ACCOUNT_NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-none px-3 py-2.5 text-sm font-medium transition-colors ${
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

        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-none px-3 py-2.5 text-sm font-medium text-[#333333] transition-colors hover:bg-black/5"
          >
            <LayoutDashboard size={18} strokeWidth={1.75} />
            Admin
          </Link>
        )}

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-1 flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#e11d48] transition-colors hover:bg-[#e11d48]/8"
        >
          <LogOut size={18} strokeWidth={1.75} />
          Log Out
        </button>
      </nav>
    </div>
  );
}

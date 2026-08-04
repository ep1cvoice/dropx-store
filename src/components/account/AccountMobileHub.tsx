"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ArrowLeft, ChevronRight, LogOut, Sparkles, User } from "lucide-react";

import { ACCOUNT_NAV } from "./accountNav";
import { anton, inter } from "@/lib/fonts";

type AccountMobileHubProps = {
  name: string;
  email: string;
};

export default function AccountMobileHub({ name, email }: AccountMobileHubProps) {
  return (
    <div className={inter.className}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/" aria-label="Back to store" className="text-[#121212]">
          <ArrowLeft size={20} />
        </Link>
        <span
          className={`${anton.className} text-lg uppercase tracking-wide text-[#121212]`}
        >
          Profile
        </span>
        <span className="inline-block w-5" aria-hidden />
      </div>

      {/* Profile card */}
      <div className="mt-8 flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-none bg-[#e5e5e3] text-[#8a8a88]">
          <User size={34} strokeWidth={1.75} />
        </div>
        <p className={`${anton.className} mt-4 text-xl uppercase tracking-wide text-[#121212]`}>
          {name}
        </p>
        <p className="mt-1 text-sm text-[#888888]">{email}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-none bg-[#121212] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white">
          <Sparkles size={13} className="text-[#c8f065]" />
          DROPX Member
        </span>
      </div>

      {/* Nav list */}
      <nav className="mt-8">
        {ACCOUNT_NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 border-b border-black/8 py-4 text-[#121212]"
          >
            <Icon size={20} strokeWidth={1.75} className="text-[#333333]" />
            <span className="flex-1 text-sm font-medium">{label}</span>
            <ChevronRight size={18} className="text-[#bbbbbb]" />
          </Link>
        ))}

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 py-4 text-left text-[#e11d48]"
        >
          <LogOut size={20} strokeWidth={1.75} />
          <span className="flex-1 text-sm font-medium">Log Out</span>
        </button>
      </nav>
    </div>
  );
}

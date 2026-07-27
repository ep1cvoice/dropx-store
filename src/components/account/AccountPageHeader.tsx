import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { anton } from "@/lib/fonts";

type AccountPageHeaderProps = {
  title: string;
  action?: ReactNode;
};

export default function AccountPageHeader({
  title,
  action,
}: AccountPageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Link
          href="/account"
          aria-label="Back to account"
          className="text-[#121212] lg:hidden"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1
          className={`${anton.className} text-2xl uppercase tracking-wide text-[#121212] md:text-3xl`}
        >
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}

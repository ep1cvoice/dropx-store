import type { LucideIcon } from "lucide-react";

import { inter } from "@/lib/fonts";

type AccountPlaceholderProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function AccountPlaceholder({
  icon: Icon,
  title,
  description,
}: AccountPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-none border border-dashed border-black/15 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-none bg-[#f4f4f2] text-[#888888]">
        <Icon size={24} strokeWidth={1.75} />
      </div>
      <div className={inter.className}>
        <p className="text-base font-semibold text-[#121212]">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-[#888888]">{description}</p>
      </div>
    </div>
  );
}

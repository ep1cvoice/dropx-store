"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { setProductArchived } from "@/actions/admin/products";
import Button from "@/components/ui/Button";

type ProductArchiveButtonProps = {
  productId: string;
  archived: boolean;
};

export default function ProductArchiveButton({
  productId,
  archived,
}: ProductArchiveButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await setProductArchived(productId, !archived);
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant={archived ? "outline" : "normal"}
      className="px-3 py-1.5 text-xs"
      disabled={pending}
      onClick={handleClick}
    >
      {pending ? "…" : archived ? "Unarchive" : "Archive"}
    </Button>
  );
}

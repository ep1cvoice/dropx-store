"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { setUserRole } from "@/actions/admin/users";
import { inter } from "@/lib/fonts";
import { USER_ROLES, type UserRole } from "@/types/admin";

const ROLES = USER_ROLES;

type UserRoleSelectProps = {
  userId: string;
  currentRole: UserRole;
  disabled?: boolean;
};

export default function UserRoleSelect({
  userId,
  currentRole,
  disabled,
}: UserRoleSelectProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const role = e.target.value as UserRole;
    startTransition(async () => {
      const result = await setUserRole(userId, role);
      if (!result.ok && "error" in result) {
        alert(result.error);
        router.refresh();
        return;
      }
      router.refresh();
    });
  }

  return (
    <select
      value={currentRole}
      disabled={disabled || pending}
      onChange={handleChange}
      className={`${inter.className} rounded-none border border-black/15 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-[#e85d2a] disabled:opacity-50`}
      aria-label="User role"
    >
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
}

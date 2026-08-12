import { auth } from "@/auth/auth";
import UserRoleSelect from "@/components/admin/UserRoleSelect";
import { getAdminUsers } from "@/lib/admin-data";
import { anton, inter } from "@/lib/fonts";

export default async function AdminUsersPage() {
  const session = await auth();
  const currentUserId = session?.user?.id;
  const users = await getAdminUsers();

  return (
    <div>
      <h1 className={`${anton.className} text-2xl uppercase tracking-wide text-[#121212]`}>
        Users
      </h1>
      <p className={`${inter.className} mt-1 text-sm text-[#666666]`}>
        Manage roles for all accounts.
      </p>
      <p className={`${inter.className} mt-2 text-sm text-[#888888]`}>
        Role changes take effect on the next sign-in (JWT is refreshed then).
      </p>

      <div className="mt-6 overflow-x-auto border border-black/10 bg-white">
        <table className={`${inter.className} w-full min-w-[640px] text-left text-sm`}>
          <thead>
            <tr className="border-b border-black/10 bg-[#fafafa] text-xs uppercase tracking-wide text-[#888888]">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-[#333333]">{u.email}</td>
                <td className="px-4 py-3">
                  <UserRoleSelect
                    userId={u.id}
                    currentRole={u.role}
                    disabled={u.id === currentUserId && u.role === "ADMIN"}
                  />
                </td>
                <td className="px-4 py-3 text-[#666666]">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

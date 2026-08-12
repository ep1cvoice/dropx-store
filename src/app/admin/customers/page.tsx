import Link from "next/link";

import { getAdminCustomers } from "@/lib/admin-data";
import { anton, inter } from "@/lib/fonts";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div>
      <h1 className={`${anton.className} text-2xl uppercase tracking-wide text-[#121212]`}>
        Customers
      </h1>
      <p className={`${inter.className} mt-1 text-sm text-[#666666]`}>
        {customers.length} customer{customers.length === 1 ? "" : "s"}
      </p>

      <div className="mt-6 overflow-x-auto border border-black/10 bg-white">
        <table className={`${inter.className} w-full min-w-[640px] text-left text-sm`}>
          <thead>
            <tr className="border-b border-black/10 bg-[#fafafa] text-xs uppercase tracking-wide text-[#888888]">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/customers/${c.id}`}
                    className="font-medium text-[#e85d2a] hover:opacity-80"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[#333333]">{c.email}</td>
                <td className="px-4 py-3">{c.ordersCount}</td>
                <td className="px-4 py-3 text-[#666666]">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[#888888]">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

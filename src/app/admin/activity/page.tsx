import { getAdminActivities } from "@/lib/admin-data";
import { anton, inter } from "@/lib/fonts";

export default async function AdminActivityPage() {
  const activities = await getAdminActivities(50);

  return (
    <div>
      <h1 className={`${anton.className} text-2xl uppercase tracking-wide text-[#121212]`}>
        Activity
      </h1>
      <p className={`${inter.className} mt-1 text-sm text-[#666666]`}>
        Recent admin actions (last 50).
      </p>

      <ul className="mt-6 divide-y divide-black/10 border border-black/10 bg-white">
        {activities.map((a) => (
          <li key={a.id} className={`${inter.className} px-5 py-4 text-sm`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium text-[#121212]">{a.message}</p>
              <time className="shrink-0 text-xs text-[#888888]">
                {new Date(a.createdAt).toLocaleString()}
              </time>
            </div>
            <p className="mt-1 text-xs text-[#888888]">
              {a.actorName} ({a.actorEmail}) · {a.action}
              {a.entityType && a.entityId ? ` · ${a.entityType}:${a.entityId.slice(0, 8)}…` : ""}
            </p>
          </li>
        ))}
        {activities.length === 0 && (
          <li className={`${inter.className} px-5 py-12 text-center text-[#888888]`}>
            No activity recorded yet.
          </li>
        )}
      </ul>
    </div>
  );
}

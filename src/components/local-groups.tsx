import { experienceTitle, type ExperienceId } from "@/data/community";
import { LOCAL_GROUPS } from "@/data/local-groups";

export function LocalGroupList({
  category = "all",
  columns = "3",
}: {
  category?: ExperienceId | "all";
  columns?: "1" | "3";
}) {
  const groups = LOCAL_GROUPS.filter((group) => category === "all" || group.experience === category);
  if (groups.length === 0) {
    return <p className="mt-3 text-muted">No listed county group in that category yet.</p>;
  }
  return (
    <ul className={columns === "3" ? "mt-3 grid gap-3 sm:grid-cols-3" : "mt-3 grid gap-3"}>
      {groups.map((group) => (
        <li key={group.id} className="rounded-card border border-line bg-card p-4">
          <p className="text-xs font-semibold text-honey-deep">{experienceTitle(group.experience)}</p>
          <h3 className="mt-1 text-xl">{group.name}</h3>
          <p className="mt-1 text-sm text-faint">{group.area}</p>
          <p className="mt-2 text-sm text-muted">{group.about}</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
            {group.phone ? (
              <a href={`tel:+1${group.phone.replace(/\D/g, "")}`} className="underline decoration-line underline-offset-4">
                {group.phone}
              </a>
            ) : null}
            <a
              href={group.site}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-line underline-offset-4"
            >
              Their website
            </a>
          </p>
        </li>
      ))}
    </ul>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getPublicMember, type PublicMember } from "@/lib/community-api";
import { GhostButton, PrimaryButton } from "@/components/bits";
import { SampleNote, Shell } from "@/components/shell";
import { CONNECTIONS, experienceTitle, getMember, type ExperienceId } from "@/data/community";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/members/$id")({ component: MemberPage });

function MemberPage() {
  const { id } = Route.useParams();
  const sample = getMember(id);
  const [live, setLive] = useState<PublicMember | null | undefined>(sample ? null : undefined);
  const blocked = useDemo((state) => state.blocked.includes(id));
  const toggle = useDemo((state) => state.toggleId);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    if (sample) return;
    void getPublicMember({ data: id })
      .then((row) => setLive(row))
      .catch(() => setLive(null));
  }, [id, sample]);

  const member = sample
    ? sample
    : live
      ? {
          name: live.name,
          area: live.area || "Area not shared",
          bio: live.bio || "They haven’t added a note.",
          experiences: live.experiences,
          connections: live.connections,
          mode: live.mode ?? "both",
        }
      : null;

  if (!sample && live === undefined) {
    return (
      <Shell>
        <p className="text-muted">Loading profile…</p>
      </Shell>
    );
  }

  if (!member) {
    return (
      <Shell>
        <h1 className="text-title">That profile isn’t available</h1>
        <p className="mt-2 text-muted">They may have turned Discoverable off, or this link is not a member.</p>
        <Link to="/community" className="mt-4 inline-flex min-h-12 items-center font-semibold text-honey-deep">
          Back to community
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      {sample ? <SampleNote /> : <p className="text-sm text-sage">Member profile. Email is not shown.</p>}
      <p className="mt-6 text-sm font-semibold text-honey-deep">{sample ? "Sample member" : "Member"}</p>
      <h1 className="mt-1 text-title">{member.name}</h1>
      <p className="mt-1 text-sage">{member.area}</p>
      <p className="mt-4 max-w-xl text-lg">{member.bio}</p>
      <p className="mt-4 text-sm text-muted">
        Open to: {member.connections.map((item) => CONNECTIONS.find((entry) => entry.id === item)?.title).join(", ") || "Not specified"}.{" "}
        {member.mode === "online" ? "Prefers online." : member.mode === "inperson" ? "Prefers in person." : "Online or in person."}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {member.experiences.map((item) => (
          <li key={item} className="rounded-chip bg-sage-soft px-3 py-2 text-sm font-medium">
            {experienceTitle(item as ExperienceId)}
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-xl text-sm text-faint">
        No street address, phone, or diagnosis is shown. They choose what appears here.
      </p>
      {blocked ? <p className="mt-4 text-sm">You blocked this profile on this device.</p> : null}
      {reported ? (
        <p className="mt-4 text-sm">Report noted on this device only. A moderator does not see it yet.</p>
      ) : null}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <PrimaryButton type="button" onClick={() => toggle("interested", id)}>
          Express interest
        </PrimaryButton>
        <GhostButton type="button" onClick={() => toggle("blocked", id)}>
          {blocked ? "Unblock" : "Block"}
        </GhostButton>
        <GhostButton type="button" onClick={() => setReported(true)}>
          Report
        </GhostButton>
      </div>
    </Shell>
  );
}

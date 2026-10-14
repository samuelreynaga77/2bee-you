import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Chip, GhostButton } from "@/components/bits";
import { LocalGroupList } from "@/components/local-groups";
import { SampleNote, Shell } from "@/components/shell";
import { EXPERIENCES, experienceTitle, type ExperienceId, type ModeId } from "@/data/community";
import {
  listCircles,
  listMembers,
  myCircleIds,
  toggleCircle,
  type CircleRow,
  type PublicMember,
} from "@/lib/community-api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useDemo } from "@/lib/demo-store";

type Search = { cat?: ExperienceId };

export const Route = createFileRoute("/community")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const cat = search.cat;
    if (typeof cat === "string" && EXPERIENCES.some((item) => item.id === cat)) {
      return { cat: cat as ExperienceId };
    }
    return {};
  },
  component: CommunityPage,
});

function CommunityPage() {
  const { cat } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useCurrentUserState();
  const profile = useDemo((state) => state.profile);
  const hydrated = useDemo((state) => state.hydrated);
  const [category, setCategory] = useState<ExperienceId | "all">(cat ?? "all");
  const [mode, setMode] = useState<ModeId | "all">(profile.mode ?? "all");
  const [people, setPeople] = useState<PublicMember[]>([]);
  const [circles, setCircles] = useState<CircleRow[]>([]);
  const [joinedCircles, setJoinedCircles] = useState<string[]>([]);
  const [loadNote, setLoadNote] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    if (profile.mode) setMode(profile.mode);
  }, [hydrated, profile.mode]);

  useEffect(() => {
    let cancel = false;
    void Promise.all([listMembers(), listCircles()])
      .then(([members, circleRows]) => {
        if (cancel) return;
        setPeople(members);
        setCircles(circleRows);
        setLoadNote("");
      })
      .catch(() => {
        if (!cancel) setLoadNote("The community list didn’t load. Refresh the page and try again.");
      });
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setJoinedCircles([]);
      return;
    }
    void myCircleIds().then(setJoinedCircles).catch(() => setJoinedCircles([]));
  }, [user?.id]);

  const realPeople = useMemo(() => {
    return people.filter((member) => {
      if (category !== "all" && !member.experiences.includes(category)) return false;
      if (mode !== "all" && member.mode && member.mode !== mode && member.mode !== "both" && mode !== "both") {
        return false;
      }
      return true;
    });
  }, [category, mode, people]);

  async function joinCircle(id: string) {
    if (!user) {
      void navigate({ to: "/login" });
      return;
    }
    const result = await toggleCircle({ data: id });
    setJoinedCircles((current) =>
      result.joined ? [...current, id] : current.filter((item) => item !== id),
    );
    const next = await listCircles();
    setCircles(next);
  }

  return (
    <Shell>
      <h1 className="text-title">Find your community</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Circles and people who opted into being discoverable are shared. The circles below are real San
        Mateo County groups, not example profiles.
      </p>
      {loadNote ? <p className="mt-3 text-sm">{loadNote}</p> : null}
      <div className="mt-4">
        <SampleNote>
          These groups are independent organizations. Call or use their website to join, and confirm the time
          before you go. If you need help now, call 988 or 650-579-0350.
        </SampleNote>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Chip selected={category === "all"} onClick={() => setCategory("all")}>
          All experiences
        </Chip>
        {EXPERIENCES.map((item) => (
          <Chip key={item.id} selected={category === item.id} onClick={() => setCategory(item.id)}>
            {item.title}
          </Chip>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip selected={mode === "all"} onClick={() => setMode("all")}>
          Any format
        </Chip>
        <Chip selected={mode === "online"} onClick={() => setMode("online")}>
          Online
        </Chip>
        <Chip selected={mode === "inperson"} onClick={() => setMode("inperson")}>
          In person
        </Chip>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl">Members</h2>
        <p className="mt-1 text-sm text-faint">
          {realPeople.length === 0
            ? "No members have turned Discoverable on for these filters yet."
            : `${realPeople.length} ${realPeople.length === 1 ? "member" : "members"} opted in.`}
        </p>
        <ul className="mt-3 grid gap-3">
          {realPeople.map((member) => (
            <li key={member.id}>
              <MemberCard
                id={member.id}
                name={member.name}
                area={member.area || "Area not shared"}
                bio={member.bio || "They haven’t added a note."}
                tags={member.experiences as ExperienceId[]}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">Community circles</h2>
        <LocalGroupList category={category} />
        {circles.some((circle) => !circle.sample && (category === "all" || circle.experience === category)) ? (
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {circles
              .filter((circle) => !circle.sample && (category === "all" || circle.experience === category))
              .map((circle) => (
                <li key={circle.id} className="rounded-card border border-line bg-card p-4">
                  <p className="text-xs font-semibold text-honey-deep">Member circle</p>
                  <h3 className="mt-1 text-xl">{circle.name}</h3>
                  <p className="mt-1 text-sm text-faint">
                    {circle.area} · {circle.members} {circle.members === 1 ? "member" : "members"}
                  </p>
                  <p className="mt-2 text-sm text-muted">{circle.about}</p>
                  <GhostButton type="button" className="mt-3" onClick={() => void joinCircle(circle.id)}>
                    {joinedCircles.includes(circle.id) ? "Leave circle" : "Join circle"}
                  </GhostButton>
                </li>
              ))}
          </ul>
        ) : null}
      </section>
    </Shell>
  );
}

function MemberCard({
  id,
  name,
  area,
  bio,
  tags,
  miles,
}: {
  id: string;
  name: string;
  area: string;
  bio: string;
  tags: ExperienceId[];
  miles?: number;
}) {
  return (
    <Link to="/members/$id" params={{ id }} className="block rounded-card border border-line bg-card p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-xl">{name}</h3>
        <span className="text-sm text-faint">{miles !== undefined ? `About ${miles} mi` : "Member"}</span>
      </div>
      <p className="text-sm text-sage">{area}</p>
      <p className="mt-2 text-sm text-muted">{bio}</p>
      <p className="mt-2 text-xs text-faint">{tags.map((tag) => experienceTitle(tag)).join(" · ")}</p>
    </Link>
  );
}

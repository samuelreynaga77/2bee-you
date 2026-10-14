import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Chip, Field, GhostButton, PrimaryButton, fieldClass } from "@/components/bits";
import { SampleNote, Shell } from "@/components/shell";
import { ACCESS, EXPERIENCES, type AccessId, type ExperienceId } from "@/data/community";
import { createMeetup, listMeetups, myRsvps, setRsvp, type MeetupRow } from "@/lib/community-api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/meetups")({ component: MeetupsPage });

function MeetupsPage() {
  const navigate = useNavigate();
  const { user } = useCurrentUserState();
  const [rows, setRows] = useState<MeetupRow[]>([]);
  const [rsvps, setRsvps] = useState<Record<string, string>>({});
  const [access, setAccess] = useState<AccessId[]>([]);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState({
    name: "",
    area: "",
    when: "",
    time: "",
    description: "",
    privateSpot: "",
    experience: "other" as ExperienceId,
    access: [] as AccessId[],
  });

  useEffect(() => {
    void listMeetups().then(setRows).catch(() => setRows([]));
  }, []);

  useEffect(() => {
    if (!user) {
      setRsvps({});
      return;
    }
    void myRsvps()
      .then((list) => {
        const next: Record<string, string> = {};
        for (const row of list) next[row.meetup_id] = row.status;
        setRsvps(next);
      })
      .catch(() => setRsvps({}));
  }, [user?.id]);

  const list = rows.filter(
    (meetup) => !meetup.sample && access.every((flag) => meetup.access.includes(flag)),
  );

  async function saveMeetup() {
    if (!user) {
      void navigate({ to: "/login" });
      return;
    }
    setNotice("");
    await createMeetup({ data: draft });
    setRows(await listMeetups());
    setCreating(false);
    setDraft({
      name: "",
      area: "",
      when: "",
      time: "",
      description: "",
      privateSpot: "",
      experience: "other",
      access: [],
    });
    setNotice("Shared with members.");
  }

  async function rsvp(id: string, status: "joined" | "interested") {
    if (!user) {
      void navigate({ to: "/login" });
      return;
    }
    const current = rsvps[id];
    const next = current === status ? "clear" : status;
    const result = await setRsvp({ data: { id, status: next } });
    setRsvps((map) => {
      const copy = { ...map };
      if (result.status === "clear") delete copy[id];
      else copy[id] = result.status;
      return copy;
    });
  }

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-title">Local meetups</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Find a small gathering or create your own. The exact spot stays hidden until someone has joined.
          </p>
        </div>
        <PrimaryButton type="button" onClick={() => setCreating((value) => !value)}>
          {creating ? "Close form" : "Create a meetup"}
        </PrimaryButton>
      </div>
      <div className="mt-4">
        <SampleNote>
          County groups keep their own schedules. Meetups a member creates are shared. Sign in to join or host
          one.
        </SampleNote>
      </div>
      {notice ? <p className="mt-3 text-sm">{notice}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Accessibility filters">
        {ACCESS.map((item) => (
          <Chip
            key={item.id}
            selected={access.includes(item.id)}
            onClick={() =>
              setAccess((current) =>
                current.includes(item.id) ? current.filter((flag) => flag !== item.id) : [...current, item.id],
              )
            }
          >
            {item.title}
          </Chip>
        ))}
      </div>

      {creating ? (
        <form
          className="mt-6 grid gap-4 rounded-card border border-line bg-card p-4"
          onSubmit={(event) => {
            event.preventDefault();
            void saveMeetup();
          }}
        >
          <Field label="Name">
            <input
              className={fieldClass}
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              required
            />
          </Field>
          <Field label="General area, not a street address">
            <input
              className={fieldClass}
              value={draft.area}
              onChange={(event) => setDraft({ ...draft, area: event.target.value })}
              required
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date">
              <input
                className={fieldClass}
                value={draft.when}
                onChange={(event) => setDraft({ ...draft, when: event.target.value })}
                placeholder="Saturday, December 5"
              />
            </Field>
            <Field label="Time">
              <input
                className={fieldClass}
                value={draft.time}
                onChange={(event) => setDraft({ ...draft, time: event.target.value })}
                placeholder="10:00 am"
              />
            </Field>
          </div>
          <Field label="What should people expect?">
            <textarea
              className={`${fieldClass} min-h-24 py-3`}
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            />
          </Field>
          <Field label="Exact spot, optional and private">
            <input
              className={fieldClass}
              value={draft.privateSpot}
              onChange={(event) => setDraft({ ...draft, privateSpot: event.target.value })}
              placeholder="Shown only to you and people who join"
            />
          </Field>
          <fieldset>
            <legend className="text-sm font-semibold">Access</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {ACCESS.map((item) => (
                <Chip
                  key={item.id}
                  selected={draft.access.includes(item.id)}
                  onClick={() =>
                    setDraft({
                      ...draft,
                      access: draft.access.includes(item.id)
                        ? draft.access.filter((flag) => flag !== item.id)
                        : [...draft.access, item.id],
                    })
                  }
                >
                  {item.title}
                </Chip>
              ))}
            </div>
          </fieldset>
          <label className="block text-sm font-semibold">
            Experience
            <select
              className={`${fieldClass} mt-2`}
              value={draft.experience}
              onChange={(event) => setDraft({ ...draft, experience: event.target.value as ExperienceId })}
            >
              {EXPERIENCES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <PrimaryButton type="submit">{user ? "Share this meetup" : "Sign in to share"}</PrimaryButton>
        </form>
      ) : null}

      <ul className="mt-6 grid gap-3">
        {list.length === 0 ? (
          <li className="text-muted">No member meetup matches these filters yet.</li>
        ) : null}
        {list.map((meetup) => (
          <li key={meetup.id} className="rounded-card border border-line bg-card p-4">
            <p className="text-xs font-semibold tracking-wide text-honey-deep">
              {meetup.sample ? "Sample meetup" : "Member meetup"}
            </p>
            <h2 className="mt-1 text-2xl">
              <Link to="/meetups/$id" params={{ id: meetup.id }} className="underline decoration-line underline-offset-4">
                {meetup.name}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-muted">
              {meetup.when} · {meetup.time}
            </p>
            <p className="text-sm text-sage">{meetup.area}</p>
            <p className="mt-2 text-sm">{meetup.description}</p>
            <p className="mt-2 text-xs text-faint">
              {meetup.size} · Hosted by {meetup.organizer} ·{" "}
              {meetup.access.map((flag) => ACCESS.find((item) => item.id === flag)?.title).join(" · ") ||
                "Access notes not added"}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <PrimaryButton type="button" onClick={() => void rsvp(meetup.id, "joined")}>
                {rsvps[meetup.id] === "joined" ? "You’re joined" : "Join"}
              </PrimaryButton>
              <GhostButton type="button" onClick={() => void rsvp(meetup.id, "interested")}>
                {rsvps[meetup.id] === "interested" ? "Interest saved" : "Express interest"}
              </GhostButton>
            </div>
          </li>
        ))}
      </ul>
      {list.length === 0 ? (
        <p className="mt-4 text-muted">No meetups match every access filter. Clear one to see more.</p>
      ) : null}
    </Shell>
  );
}

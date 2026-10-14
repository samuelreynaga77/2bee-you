import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GhostButton, PrimaryButton } from "@/components/bits";
import { SampleNote, Shell } from "@/components/shell";
import { ACCESS } from "@/data/community";
import { getPrivateSpot, listMeetups, myRsvps, setRsvp, type MeetupRow } from "@/lib/community-api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/meetups_/$id")({ component: MeetupPage });

function MeetupPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useCurrentUserState();
  const [meetup, setMeetup] = useState<MeetupRow | null | undefined>(undefined);
  const [joined, setJoined] = useState(false);
  const [reported, setReported] = useState(false);
  const [spot, setSpot] = useState<string | null>(null);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    void listMeetups()
      .then((rows) => setMeetup(rows.find((row) => row.id === id) ?? null))
      .catch(() => setMeetup(null));
  }, [id]);

  useEffect(() => {
    if (!user) {
      setJoined(false);
      return;
    }
    void myRsvps()
      .then((rows) => setJoined(rows.some((row) => row.meetup_id === id && row.status === "joined")))
      .catch(() => setJoined(false));
  }, [id, user?.id]);

  async function join() {
    if (!user) {
      void navigate({ to: "/login" });
      return;
    }
    const result = await setRsvp({ data: { id, status: joined ? "clear" : "joined" } });
    setJoined(result.status === "joined");
    if (result.status !== "joined") setSpot(null);
  }

  async function ask() {
    setAsked(true);
    if (!user) {
      void navigate({ to: "/login" });
      return;
    }
    const value = await getPrivateSpot({ data: id });
    setSpot(value);
  }

  if (meetup === undefined) {
    return (
      <Shell>
        <p className="text-muted">Loading meetup…</p>
      </Shell>
    );
  }

  if (!meetup) {
    return (
      <Shell>
        <h1 className="text-title">That meetup isn’t here</h1>
        <Link to="/meetups" className="mt-4 inline-flex font-semibold text-honey-deep">
          All meetups
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      {meetup.sample ? (
        <SampleNote />
      ) : (
        <p className="text-sm text-sage">Shared with members. The general area is public. The exact spot is not.</p>
      )}
      <h1 className="mt-6 text-title">{meetup.name}</h1>
      <p className="mt-2 text-lg">
        {meetup.when} · {meetup.time}
      </p>
      <p className="text-sage">{meetup.area}</p>
      <p className="mt-4 max-w-xl">{meetup.description}</p>
      <dl className="mt-6 grid gap-3 text-sm">
        <div>
          <dt className="font-semibold">Group size</dt>
          <dd>{meetup.size}</dd>
        </div>
        <div>
          <dt className="font-semibold">Organizer</dt>
          <dd>{meetup.organizer}{meetup.sample ? " · sample profile, not a verified host" : ""}</dd>
        </div>
        <div>
          <dt className="font-semibold">Access</dt>
          <dd>
            {meetup.access.map((flag) => ACCESS.find((item) => item.id === flag)?.title).join(", ") || "Not specified"}
          </dd>
        </div>
      </dl>
      <div className="mt-6 rounded-control border border-line bg-card p-4 text-sm">
        <p className="font-semibold">Meeting spot</p>
        {spot ? (
          <p className="mt-1">{spot}</p>
        ) : (
          <p className="mt-1">
            {asked && !spot
              ? "No exact spot has been added, or only the host and people who joined can see it."
              : "The exact location stays hidden until you join."}
          </p>
        )}
        <button type="button" className="mt-3 min-h-11 font-semibold text-honey-deep" onClick={() => void ask()}>
          {user ? "Show the spot" : "Sign in to see the spot"}
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <PrimaryButton type="button" onClick={() => void join()}>
          {joined ? "You’re joined" : "Join"}
        </PrimaryButton>
        <GhostButton type="button" onClick={() => setReported(true)}>
          Report this meetup
        </GhostButton>
        <Link to="/safety" className="inline-flex min-h-12 items-center px-2 font-semibold text-ink">
          Guidelines
        </Link>
      </div>
      {reported ? (
        <p className="mt-3 text-sm">Report kept on this device. A moderator does not see it yet.</p>
      ) : null}
    </Shell>
  );
}

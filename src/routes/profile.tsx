import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Chip, Field, PrimaryButton, fieldClass } from "@/components/bits";
import { Shell } from "@/components/shell";
import { CONNECTIONS, EXPERIENCES, MODES, ROLES, experienceTitle } from "@/data/community";
import { getMyProfile, saveMyProfile, type MyProfile } from "@/lib/community-api";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useDemo, type TextSize } from "@/lib/demo-store";
import type { ConnectionId, ExperienceId, ModeId, RoleId } from "@/data/community";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

const EMPTY: MyProfile = {
  name: "",
  area: "",
  bio: "",
  role: null,
  experiences: [],
  connections: [],
  distance: "15",
  mode: null,
  discoverable: false,
  showExperiences: true,
};

function ProfilePage() {
  const { user, isPending } = useCurrentUserState();
  const hydrated = useDemo((state) => state.hydrated);
  const local = useDemo((state) => state.profile);
  const textSize = useDemo((state) => state.profile.textSize);
  const patchLocal = useDemo((state) => state.patchProfile);
  const [profile, setProfile] = useState<MyProfile>(EMPTY);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!user || !hydrated) return;
    let cancel = false;
    void getMyProfile()
      .then(async (saved) => {
        if (cancel) return;
        if (saved) {
          setProfile(saved);
        } else if (local.name) {
          const draft: MyProfile = {
            ...EMPTY,
            name: local.name,
            area: local.city,
            role: local.role,
            experiences: local.experiences,
            connections: local.connections,
            distance: local.distance,
            mode: local.mode,
          };
          setProfile(draft);
          if (local.onboarded) {
            await saveMyProfile({ data: draft });
            if (!cancel) setStatus("Saved to your account.");
          }
        } else if (user.displayName) {
          setProfile({ ...EMPTY, name: user.displayName });
        }
        if (!cancel) setReady(true);
      })
      .catch(() => {
        if (!cancel) setReady(true);
      });
    return () => {
      cancel = true;
    };
  }, [user?.id, hydrated]);

  async function save() {
    setStatus("");
    try {
      await saveMyProfile({ data: profile });
      setStatus("Saved. Only you can change this profile.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save.");
    }
  }

  if (isPending) {
    return (
      <Shell>
        <p className="text-muted">Loading your account…</p>
      </Shell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <Shell>
      <h1 className="text-title">You</h1>
      <p className="mt-2 max-w-xl text-muted">
        Discoverable is off until you turn it on. Your email is never shown. Other members cannot edit this
        page.
      </p>
      {!ready ? <p className="mt-6 text-muted">Loading your profile…</p> : null}
      {ready ? (
        <div className="mt-6 grid max-w-xl gap-5">
          <section className="rounded-card border border-line bg-card p-4">
            <h2 className="text-2xl">{profile.name || "No display name yet"}</h2>
            <p className="mt-1 text-sm text-sage">{profile.area || "No area added"}</p>
            <p className="mt-3 text-sm text-muted">
              {profile.showExperiences && profile.experiences.length > 0
                ? profile.experiences.map((id) => experienceTitle(id as ExperienceId)).join(" · ")
                : "Experience tags are hidden from other people."}
            </p>
            <p className="mt-2 text-sm text-faint">
              {profile.discoverable
                ? "Discoverable is on. Members can see your name, area, and the tags you leave visible."
                : "Discoverable is off. You will not appear in Find your community."}
            </p>
          </section>
          <Field label="Display name">
            <input
              className={fieldClass}
              value={profile.name}
              onChange={(event) => setProfile({ ...profile, name: event.target.value.slice(0, 40) })}
            />
          </Field>
          <Field label="City or general area">
            <input
              className={fieldClass}
              value={profile.area}
              onChange={(event) => setProfile({ ...profile, area: event.target.value.slice(0, 80) })}
            />
          </Field>
          <Field label="A short note, optional">
            <textarea
              className={`${fieldClass} min-h-24 py-3`}
              value={profile.bio}
              onChange={(event) => setProfile({ ...profile, bio: event.target.value.slice(0, 280) })}
              placeholder="Only if you want to be discoverable. No diagnosis required."
            />
          </Field>
          <fieldset>
            <legend className="text-sm font-semibold">Text size, on this device</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["md", "Default"],
                  ["lg", "Larger"],
                  ["xl", "Largest"],
                ] as const
              ).map(([id, label]) => (
                <Chip
                  key={id}
                  selected={textSize === id}
                  onClick={() => patchLocal({ textSize: id as TextSize })}
                >
                  {label}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold">Who this is for</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {ROLES.map((item) => (
                <Chip
                  key={item.id}
                  selected={profile.role === item.id}
                  onClick={() =>
                    setProfile({ ...profile, role: profile.role === item.id ? null : (item.id as RoleId) })
                  }
                >
                  {item.title}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold">What other members can see</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip
                selected={profile.discoverable}
                onClick={() => setProfile({ ...profile, discoverable: !profile.discoverable })}
              >
                {profile.discoverable ? "Discoverable: on" : "Discoverable: off"}
              </Chip>
              <Chip
                selected={profile.showExperiences}
                onClick={() => setProfile({ ...profile, showExperiences: !profile.showExperiences })}
              >
                {profile.showExperiences ? "Show experience tags" : "Hide experience tags"}
              </Chip>
            </div>
          </fieldset>
          <div>
            <h2 className="text-lg">Experiences</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {EXPERIENCES.map((item) => (
                <Chip
                  key={item.id}
                  selected={profile.experiences.includes(item.id)}
                  onClick={() =>
                    setProfile({
                      ...profile,
                      experiences: profile.experiences.includes(item.id)
                        ? profile.experiences.filter((id) => id !== item.id)
                        : [...profile.experiences, item.id],
                    })
                  }
                >
                  {item.title}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg">Kind of connection</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {CONNECTIONS.map((item) => (
                <Chip
                  key={item.id}
                  selected={profile.connections.includes(item.id)}
                  onClick={() =>
                    setProfile({
                      ...profile,
                      connections: profile.connections.includes(item.id)
                        ? profile.connections.filter((id) => id !== item.id)
                        : [...profile.connections, item.id as ConnectionId],
                    })
                  }
                >
                  {item.title}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg">Online, in person, or both</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {MODES.map((item) => (
                <Chip
                  key={item.id}
                  selected={profile.mode === item.id}
                  onClick={() =>
                    setProfile({ ...profile, mode: profile.mode === item.id ? null : (item.id as ModeId) })
                  }
                >
                  {item.title}
                </Chip>
              ))}
            </div>
          </div>
          {status ? <p className="text-sm">{status}</p> : null}
          <div className="flex flex-col gap-2 sm:flex-row">
            <PrimaryButton type="button" onClick={() => void save()}>
              Save profile
            </PrimaryButton>
            <Link
              to="/onboarding"
              className="inline-flex min-h-12 items-center justify-center rounded-control border border-line bg-card px-5 font-semibold"
            >
              Redo the questions
            </Link>
          </div>
        </div>
      ) : null}
    </Shell>
  );
}

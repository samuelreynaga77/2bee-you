import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Chip, Field, PrimaryButton, fieldClass } from "@/components/bits";
import { Shell } from "@/components/shell";
import {
  CONNECTIONS,
  EXPERIENCES,
  MODES,
  ROLES,
  type ConnectionId,
  type ExperienceId,
  type ModeId,
  type RoleId,
} from "@/data/community";
import { saveMyProfile } from "@/lib/community-api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const STEPS = ["experiences", "role", "connection", "place", "mode"] as const;

function Onboarding() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const profile = useDemo((state) => state.profile);
  const setProfile = useDemo((state) => state.setProfile);
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile.name);
  const [experiences, setExperiences] = useState<ExperienceId[]>(profile.experiences);
  const [role, setRole] = useState<RoleId | null>(profile.role);
  const [connections, setConnections] = useState<ConnectionId[]>(profile.connections);
  const [city, setCity] = useState(profile.city);
  const [distance, setDistance] = useState(profile.distance);
  const [mode, setMode] = useState<ModeId | null>(profile.mode);

  function toggle<T extends string>(list: T[], id: T, set: (next: T[]) => void) {
    set(list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);
  }

  async function finish() {
    const next = {
      ...profile,
      name: name.trim(),
      experiences,
      role,
      connections,
      city: city.trim(),
      distance,
      mode,
      onboarded: true,
    };
    setProfile(next);
    if (isPending) return;
    if (!user) {
      void navigate({ to: "/login" });
      return;
    }
    await saveMyProfile({
      data: {
        name: next.name || user.displayName || "Member",
        area: next.city,
        bio: "",
        role: next.role,
        experiences: next.experiences,
        connections: next.connections,
        distance: next.distance,
        mode: next.mode,
        discoverable: false,
        showExperiences: true,
      },
    });
    void navigate({ to: "/community" });
  }

  const titles = [
    "What would you like to connect about?",
    "Who is this support for?",
    "What kind of connection do you want?",
    "Where should we look?",
    "Online, in person, or both?",
  ];

  return (
    <Shell>
      <p className="text-sm font-semibold text-honey-deep">
        Question {step + 1} of {STEPS.length}
      </p>
      <h1 className="mt-2 text-title">{titles[step]}</h1>
      <p className="mt-2 max-w-xl text-muted">
        Skip anything you don’t want to answer. You never have to name a diagnosis or tell a story.
      </p>
      <div className="step-in mt-6" key={step}>
        {step === 0 ? (
          <div className="grid gap-2">
            {EXPERIENCES.map((item) => (
              <Chip
                key={item.id}
                selected={experiences.includes(item.id)}
                onClick={() => toggle(experiences, item.id, setExperiences)}
              >
                {item.title}
              </Chip>
            ))}
          </div>
        ) : null}
        {step === 1 ? (
          <div className="grid gap-2">
            {ROLES.map((item) => (
              <Chip key={item.id} selected={role === item.id} onClick={() => setRole(item.id)}>
                {item.title}
              </Chip>
            ))}
          </div>
        ) : null}
        {step === 2 ? (
          <div className="grid gap-2">
            {CONNECTIONS.map((item) => (
              <Chip
                key={item.id}
                selected={connections.includes(item.id)}
                onClick={() => toggle(connections, item.id, setConnections)}
              >
                {item.title}
              </Chip>
            ))}
          </div>
        ) : null}
        {step === 3 ? (
          <div className="grid max-w-lg gap-4">
            <Field label="City or general area">
              <input
                value={city}
                onChange={(event) => setCity(event.target.value.slice(0, 80))}
                placeholder="Redwood City"
                className={fieldClass}
              />
            </Field>
            <fieldset>
              <legend className="text-sm font-semibold">How far for a meetup?</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  [
                    ["5", "About 5 miles"],
                    ["15", "About 15 miles"],
                    ["30", "About 30 miles"],
                    ["any", "Distance is flexible"],
                  ] as const
                ).map(([id, label]) => (
                  <Chip key={id} selected={distance === id} onClick={() => setDistance(id)}>
                    {label}
                  </Chip>
                ))}
              </div>
            </fieldset>
          </div>
        ) : null}
        {step === 4 ? (
          <div className="grid max-w-lg gap-4">
            <div className="grid gap-2">
              {MODES.map((item) => (
                <Chip key={item.id} selected={mode === item.id} onClick={() => setMode(item.id)}>
                  {item.title}
                </Chip>
              ))}
            </div>
            <Field label="Display name, if you want one">
              <input
                value={name}
                onChange={(event) => setName(event.target.value.slice(0, 40))}
                placeholder="First name or nickname"
                className={fieldClass}
              />
            </Field>
          </div>
        ) : null}
      </div>
      <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <button
          type="button"
          className="min-h-12 px-2 text-left font-medium text-muted"
          onClick={() => (step === 0 ? void navigate({ to: "/" }) : setStep((value) => value - 1))}
        >
          Back
        </button>
        <div className="flex flex-col gap-2 sm:flex-row">
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="min-h-12 rounded-control px-4 font-semibold text-ink"
              onClick={() => setStep((value) => value + 1)}
            >
              Skip
            </button>
          ) : null}
          <PrimaryButton
            type="button"
            onClick={() => (step === STEPS.length - 1 ? void finish() : setStep((value) => value + 1))}
          >
            {step === STEPS.length - 1 ? (user ? "Save and see matches" : "Sign in to save") : "Continue"}
          </PrimaryButton>
        </div>
      </div>
    </Shell>
  );
}

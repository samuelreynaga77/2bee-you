import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

const EXPERIENCES = ["disability", "caregiver", "grief", "health", "mental", "life", "other"] as const;
const CONNECTIONS = ["friendship", "stories", "peer", "activities"] as const;
const MODES = ["online", "inperson", "both"] as const;
const ROLES = ["self", "family", "caregiver"] as const;
const DISTANCES = ["5", "15", "30", "any"] as const;
const ACCESS = ["wheelchair", "sensory", "transit", "quiet", "seating"] as const;

export type PublicMember = {
  id: string;
  name: string;
  area: string;
  bio: string;
  experiences: string[];
  connections: string[];
  mode: string | null;
  sample: false;
};

export type MyProfile = {
  name: string;
  area: string;
  bio: string;
  role: string | null;
  experiences: string[];
  connections: string[];
  distance: string;
  mode: string | null;
  discoverable: boolean;
  showExperiences: boolean;
};

export type CircleRow = {
  id: string;
  name: string;
  experience: string;
  area: string;
  about: string;
  sample: boolean;
  members: number;
  joined: boolean;
};

export type MeetupRow = {
  id: string;
  name: string;
  area: string;
  when: string;
  time: string;
  access: string[];
  size: string;
  description: string;
  organizer: string;
  experience: string;
  sample: boolean;
  joined: boolean;
  interested: boolean;
};

function clip(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

function manyOf<T extends string>(value: unknown, allowed: readonly T[]): T[] {
  if (!Array.isArray(value)) return [];
  const out: T[] = [];
  for (const item of value) {
    const next = oneOf(item, allowed);
    if (next && !out.includes(next)) out.push(next);
  }
  return out;
}

function split(value: string) {
  return value ? value.split(",").filter(Boolean) : [];
}

function asBool(value: unknown) {
  return value === true;
}

type ProfileWrite = {
  name: string;
  area: string;
  bio: string;
  role: string | null;
  experiences: string[];
  connections: string[];
  distance: string;
  mode: string | null;
  discoverable: boolean;
  showExperiences: boolean;
};

function readProfile(input: unknown): ProfileWrite {
  if (!input || typeof input !== "object") throw new Error("Add a display name.");
  const raw = input as Record<string, unknown>;
  const name = clip(raw.name, 40);
  if (!name) throw new Error("Add a display name.");
  return {
    name,
    area: clip(raw.area, 80),
    bio: clip(raw.bio, 280),
    role: oneOf(raw.role, ROLES),
    experiences: manyOf(raw.experiences, EXPERIENCES),
    connections: manyOf(raw.connections, CONNECTIONS),
    distance: oneOf(raw.distance, DISTANCES) ?? "15",
    mode: oneOf(raw.mode, MODES),
    discoverable: asBool(raw.discoverable),
    showExperiences: raw.showExperiences !== false,
  };
}

type MeetupWrite = {
  name: string;
  area: string;
  when: string;
  time: string;
  description: string;
  experience: string;
  access: string[];
  privateSpot: string;
};

function readMeetup(input: unknown): MeetupWrite {
  if (!input || typeof input !== "object") throw new Error("Name the meetup.");
  const raw = input as Record<string, unknown>;
  const name = clip(raw.name, 80);
  const area = clip(raw.area, 120);
  if (!name || !area) throw new Error("Add a name and a general area.");
  return {
    name,
    area,
    when: clip(raw.when, 80) || "Date to be set",
    time: clip(raw.time, 40) || "Time to be set",
    description: clip(raw.description, 500) || "A member created this gathering.",
    experience: oneOf(raw.experience, EXPERIENCES) ?? "other",
    access: manyOf(raw.access, ACCESS),
    privateSpot: clip(raw.privateSpot, 200),
  };
}

async function sql() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

export const listMembers = createServerFn({ method: "GET" }).handler(async () => {
  const db = await sql();
  const rows = await db<{
    user_id: string;
    display_name: string;
    area: string;
    bio: string;
    experiences: string;
    connections: string;
    mode: string | null;
  }>`
    select user_id, display_name, area, bio,
      case when show_experiences then experiences else '' end as experiences,
      connections, mode
    from profiles
    where discoverable = true
    order by updated_at desc
  `;
  return rows.map(
    (row): PublicMember => ({
      id: row.user_id,
      name: row.display_name,
      area: row.area,
      bio: row.bio,
      experiences: split(row.experiences),
      connections: split(row.connections),
      mode: row.mode,
      sample: false,
    }),
  );
});

export const getPublicMember = createServerFn({ method: "GET" })
  .validator((id: unknown) => (typeof id === "string" ? id.slice(0, 80) : ""))
  .handler(async ({ data: id }) => {
    if (!id) return null;
    const db = await sql();
    const rows = await db<{
      user_id: string;
      display_name: string;
      area: string;
      bio: string;
      experiences: string;
      connections: string;
      mode: string | null;
    }>`
      select user_id, display_name, area, bio,
        case when show_experiences then experiences else '' end as experiences,
        connections, mode
      from profiles
      where user_id = ${id} and discoverable = true
    `;
    const row = rows[0];
    if (!row) return null;
    const member: PublicMember = {
      id: row.user_id,
      name: row.display_name,
      area: row.area,
      bio: row.bio,
      experiences: split(row.experiences),
      connections: split(row.connections),
      mode: row.mode,
      sample: false,
    };
    return member;
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await sql();
    const rows = await db<{
      display_name: string;
      area: string;
      bio: string;
      role: string | null;
      experiences: string;
      connections: string;
      distance: string;
      mode: string | null;
      discoverable: boolean;
      show_experiences: boolean;
    }>`
      select display_name, area, bio, role, experiences, connections, distance, mode, discoverable, show_experiences
      from profiles
      where user_id = ${context.userId}
    `;
    const row = rows[0];
    if (!row) return null;
    const profile: MyProfile = {
      name: row.display_name,
      area: row.area,
      bio: row.bio,
      role: row.role,
      experiences: split(row.experiences),
      connections: split(row.connections),
      distance: row.distance,
      mode: row.mode,
      discoverable: row.discoverable,
      showExperiences: row.show_experiences,
    };
    return profile;
  });

export const saveMyProfile = createServerFn({ method: "POST" })
  .validator(readProfile)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const db = await sql();
    await db`
      insert into profiles (
        user_id, display_name, area, bio, role, experiences, connections, distance, mode, discoverable, show_experiences, updated_at
      ) values (
        ${context.userId},
        ${data.name},
        ${data.area},
        ${data.bio},
        ${data.role},
        ${data.experiences.join(",")},
        ${data.connections.join(",")},
        ${data.distance},
        ${data.mode},
        ${data.discoverable},
        ${data.showExperiences},
        now()
      )
      on conflict (user_id) do update set
        display_name = excluded.display_name,
        area = excluded.area,
        bio = excluded.bio,
        role = excluded.role,
        experiences = excluded.experiences,
        connections = excluded.connections,
        distance = excluded.distance,
        mode = excluded.mode,
        discoverable = excluded.discoverable,
        show_experiences = excluded.show_experiences,
        updated_at = now()
      where profiles.user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const listCircles = createServerFn({ method: "GET" }).handler(async () => {
  const db = await sql();
  const rows = await db<{
    id: string;
    name: string;
    experience: string;
    area: string;
    about: string;
    sample: boolean;
    members: number;
  }>`
    select c.id, c.name, c.experience, c.area, c.about, c.sample,
      (select count(*) from circle_members m where m.circle_id = c.id) as members
    from circles c
    order by c.created_at asc
  `;
  return rows.map(
    (row): CircleRow => ({
      id: row.id,
      name: row.name,
      experience: row.experience,
      area: row.area,
      about: row.about,
      sample: row.sample,
      members: row.members,
      joined: false,
    }),
  );
});

export const myCircleIds = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await sql();
    const rows = await db<{ circle_id: string }>`
      select circle_id from circle_members where user_id = ${context.userId}
    `;
    return rows.map((row) => row.circle_id);
  });

export const toggleCircle = createServerFn({ method: "POST" })
  .validator((id: unknown) => (typeof id === "string" ? id.slice(0, 80) : ""))
  .middleware([authMiddleware])
  .handler(async ({ context, data: id }) => {
    if (!id) return { joined: false };
    const db = await sql();
    const existing = await db<{ circle_id: string }>`
      select circle_id from circle_members where circle_id = ${id} and user_id = ${context.userId}
    `;
    if (existing.length > 0) {
      await db`delete from circle_members where circle_id = ${id} and user_id = ${context.userId}`;
      return { joined: false };
    }
    const found = await db<{ id: string }>`select id from circles where id = ${id}`;
    if (found.length === 0) return { joined: false };
    await db`insert into circle_members (circle_id, user_id) values (${id}, ${context.userId})`;
    return { joined: true };
  });

function mapMeetup(
  row: {
    id: string;
    name: string;
    area: string;
    when_label: string;
    time_label: string;
    access_flags: string;
    size_label: string;
    description: string;
    organizer_name: string;
    experience: string;
    sample: boolean;
  },
  rsvp?: { status: string },
): MeetupRow {
  return {
    id: row.id,
    name: row.name,
    area: row.area,
    when: row.when_label,
    time: row.time_label,
    access: split(row.access_flags),
    size: row.size_label,
    description: row.description,
    organizer: row.organizer_name,
    experience: row.experience,
    sample: row.sample,
    joined: rsvp?.status === "joined",
    interested: rsvp?.status === "interested",
  };
}

export const listMeetups = createServerFn({ method: "GET" }).handler(async () => {
  const db = await sql();
  const rows = await db<{
    id: string;
    name: string;
    area: string;
    when_label: string;
    time_label: string;
    access_flags: string;
    size_label: string;
    description: string;
    organizer_name: string;
    experience: string;
    sample: boolean;
  }>`
    select id, name, area, when_label, time_label, access_flags, size_label, description, organizer_name, experience, sample
    from meetups
    order by created_at desc
  `;
  return rows.map((row) => mapMeetup(row));
});

export const myRsvps = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await sql();
    const rows = await db<{ meetup_id: string; status: string }>`
      select meetup_id, status from meetup_rsvps where user_id = ${context.userId}
    `;
    return rows;
  });

export const createMeetup = createServerFn({ method: "POST" })
  .validator(readMeetup)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const db = await sql();
    const named = await db<{ display_name: string }>`
      select display_name from profiles where user_id = ${context.userId}
    `;
    const organizer = named[0]?.display_name || "A member";
    const id = crypto.randomUUID();
    await db`
      insert into meetups (
        id, owner_id, name, area, when_label, time_label, access_flags, size_label, description, organizer_name, experience, sample, private_spot
      ) values (
        ${id},
        ${context.userId},
        ${data.name},
        ${data.area},
        ${data.when},
        ${data.time},
        ${data.access.join(",")},
        ${"Open"},
        ${data.description},
        ${organizer},
        ${data.experience},
        false,
        ${data.privateSpot}
      )
    `;
    return { id };
  });

export const setRsvp = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("Choose a meetup.");
    const raw = input as Record<string, unknown>;
    const id = clip(raw.id, 80);
    const status = raw.status === "joined" || raw.status === "interested" ? raw.status : "clear";
    if (!id) throw new Error("Choose a meetup.");
    return { id, status };
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const db = await sql();
    const found = await db<{ id: string }>`select id from meetups where id = ${data.id}`;
    if (found.length === 0) return { status: "clear" as const };
    if (data.status === "clear") {
      await db`delete from meetup_rsvps where meetup_id = ${data.id} and user_id = ${context.userId}`;
      return { status: "clear" as const };
    }
    await db`
      insert into meetup_rsvps (meetup_id, user_id, status)
      values (${data.id}, ${context.userId}, ${data.status})
      on conflict (meetup_id, user_id) do update set status = excluded.status
      where meetup_rsvps.user_id = ${context.userId}
    `;
    return { status: data.status };
  });

export const getPrivateSpot = createServerFn({ method: "GET" })
  .validator((id: unknown) => (typeof id === "string" ? id.slice(0, 80) : ""))
  .middleware([authMiddleware])
  .handler(async ({ context, data: id }) => {
    if (!id) return null;
    const db = await sql();
    const rows = await db<{ private_spot: string }>`
      select m.private_spot
      from meetups m
      where m.id = ${id}
        and m.private_spot <> ''
        and (
          m.owner_id = ${context.userId}
          or exists (
            select 1 from meetup_rsvps r
            where r.meetup_id = m.id and r.user_id = ${context.userId} and r.status = 'joined'
          )
        )
    `;
    return rows[0]?.private_spot ?? null;
  });

-- Shared community data. Sample rows have a null owner and cannot be edited.
-- Members can update only the row whose user_id matches their session.

create table if not exists profiles (
  user_id text primary key,
  display_name text not null,
  area text not null default '',
  bio text not null default '',
  role text,
  experiences text not null default '',
  connections text not null default '',
  distance text not null default '15',
  mode text,
  discoverable boolean not null default false,
  show_experiences boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists circles (
  id text primary key,
  owner_id text,
  name text not null,
  experience text not null,
  area text not null,
  about text not null,
  sample boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists circle_members (
  circle_id text not null references circles (id) on delete cascade,
  user_id text not null,
  primary key (circle_id, user_id)
);

create table if not exists meetups (
  id text primary key,
  owner_id text,
  name text not null,
  area text not null,
  when_label text not null,
  time_label text not null,
  access_flags text not null default '',
  size_label text not null,
  description text not null,
  organizer_name text not null,
  experience text not null,
  sample boolean not null default false,
  private_spot text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists meetup_rsvps (
  meetup_id text not null references meetups (id) on delete cascade,
  user_id text not null,
  status text not null,
  primary key (meetup_id, user_id)
);

create index if not exists profiles_discoverable_idx on profiles (discoverable);
create index if not exists meetups_owner_idx on meetups (owner_id);

insert into circles (id, owner_id, name, experience, area, about, sample)
values
  ('caregivers', null, 'Caregivers Circle', 'caregiver', 'Mid-county', 'A small circle for people supporting someone else. Check-ins, not homework.', true),
  ('walk', null, 'Grief walking companions', 'grief', 'Bayside', 'A slow walk. Talking is optional. Leaving early is fine.', true),
  ('access', null, 'Accessible outings', 'disability', 'Countywide sample', 'Plans chosen for step-free paths, seating, and a pace everyone can keep.', true)
on conflict (id) do nothing;

insert into meetups (
  id, owner_id, name, area, when_label, time_label, access_flags, size_label, description, organizer_name, experience, sample, private_spot
) values
  ('coffee-care', null, 'Casual coffee for caregivers', 'San Mateo, near the downtown library', 'Saturday, November 7', '10:00–11:30 am', 'wheelchair,transit,seating,quiet', 'Up to 8', 'A table, a drink, and no requirement to explain your week. The exact café is shared only with people the organizer confirms.', 'Amira', 'caregiver', true, ''),
  ('grief-walk', null, 'Grief and loss walking group', 'Foster City bay path', 'Sunday, November 8', '9:00–10:00 am', 'sensory,seating,quiet', 'Up to 12', 'A flat, slow loop. Headphones welcome. You can walk beside someone or a little apart.', 'Luis', 'grief', true, ''),
  ('park', null, 'Accessible park outing', 'Coyote Point area', 'Saturday, November 14', '1:00–3:00 pm', 'wheelchair,transit,seating,sensory', 'Up to 15', 'Shade, restrooms, and places to sit. Built for people who want a plan that already considered access.', 'Jordan', 'disability', true, ''),
  ('new-disability', null, 'Gathering for a new disability', 'Burlingame community room', 'Wednesday, November 18', '6:00–7:30 pm', 'wheelchair,transit,seating,quiet', 'Up to 10', 'For people whose body or access needs changed recently. Stories are invited, never required.', 'Noah', 'disability', true, ''),
  ('peer-health', null, 'Peer hour after a hard health year', 'Online, with an East Palo Alto host', 'Thursday, November 12', '5:30–6:30 pm', 'quiet,sensory', 'Up to 10', 'Cameras optional. No medical advice. A place to say how the week actually went.', 'Priya', 'health', true, ''),
  ('dinner', null, 'Relaxed community dinner', 'Redwood City, transit stop nearby', 'Friday, November 20', '6:30–8:00 pm', 'wheelchair,transit,seating', 'Up to 14', 'A simple dinner for people who want friends more than a support group. Dietary notes stay with the organizer.', 'Elena', 'life', true, '')
on conflict (id) do nothing;

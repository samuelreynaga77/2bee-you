export type ExperienceId =
  | "disability"
  | "caregiver"
  | "grief"
  | "health"
  | "mental"
  | "life"
  | "other";

export type ConnectionId = "friendship" | "stories" | "peer" | "activities";

export type ModeId = "online" | "inperson" | "both";

export type AccessId = "wheelchair" | "sensory" | "transit" | "quiet" | "seating";

export const EXPERIENCES: Array<{ id: ExperienceId; title: string; text: string }> = [
  {
    id: "disability",
    title: "Disability and Accessibility",
    text: "Living with a disability, a new limitation, or an access need.",
  },
  {
    id: "caregiver",
    title: "Caregivers and Family Members",
    text: "Supporting someone you love, and needing people who get that role.",
  },
  {
    id: "grief",
    title: "Grief and Loss",
    text: "After a death, an estrangement, or a life that changed shape.",
  },
  {
    id: "health",
    title: "Health Challenges and Medical Trauma",
    text: "Illness, treatment, or a health scare that is still with you.",
  },
  {
    id: "mental",
    title: "Mental Health and Emotional Wellbeing",
    text: "Hard seasons of mind and mood. Peer company, not treatment.",
  },
  {
    id: "life",
    title: "Life Changes and Recovery",
    text: "A move, a loss of work, recovery, or a chapter you did not plan.",
  },
  {
    id: "other",
    title: "Other Shared Life Experiences",
    text: "Something that does not fit a label, and still matters.",
  },
];

export const CONNECTIONS: Array<{ id: ConnectionId; title: string }> = [
  { id: "friendship", title: "Friendship" },
  { id: "stories", title: "Sharing experiences" },
  { id: "peer", title: "Peer support" },
  { id: "activities", title: "Local activities" },
];

export const MODES: Array<{ id: ModeId; title: string }> = [
  { id: "online", title: "Online conversations" },
  { id: "inperson", title: "In-person meetups" },
  { id: "both", title: "Both" },
];

export const ACCESS: Array<{ id: AccessId; title: string }> = [
  { id: "wheelchair", title: "Wheelchair accessible" },
  { id: "sensory", title: "Sensory-friendly" },
  { id: "transit", title: "Near public transit" },
  { id: "quiet", title: "Quiet setting" },
  { id: "seating", title: "Seating available" },
];

export const ROLES = [
  { id: "self", title: "For myself" },
  { id: "family", title: "For a family member" },
  { id: "caregiver", title: "For someone I care for" },
] as const;

export type RoleId = (typeof ROLES)[number]["id"];

export type Member = {
  id: string;
  name: string;
  area: string;
  miles: number;
  experiences: ExperienceId[];
  connections: ConnectionId[];
  mode: ModeId;
  bio: string;
  sample: true;
};

export const MEMBERS: Member[] = [
  {
    id: "amira",
    name: "Amira",
    area: "Redwood City area",
    miles: 3,
    experiences: ["caregiver", "life"],
    connections: ["friendship", "activities"],
    mode: "both",
    bio: "I look after my dad and I want friends who understand a quiet week. I share as much or as little as I feel like.",
    sample: true,
  },
  {
    id: "jordan",
    name: "Jordan",
    area: "San Mateo area",
    miles: 4,
    experiences: ["disability"],
    connections: ["friendship", "peer", "activities"],
    mode: "inperson",
    bio: "Newer to asking for access, and looking for people to practice ordinary plans with. Parks, coffee, no speeches required.",
    sample: true,
  },
  {
    id: "luis",
    name: "Luis",
    area: "Daly City area",
    miles: 8,
    experiences: ["grief"],
    connections: ["stories", "activities"],
    mode: "inperson",
    bio: "Walking helps more than talking some days. I like a small group and the option to stay quiet.",
    sample: true,
  },
  {
    id: "priya",
    name: "Priya",
    area: "East Palo Alto area",
    miles: 9,
    experiences: ["health", "mental"],
    connections: ["peer", "stories"],
    mode: "both",
    bio: "A health chapter changed my pace. I am looking for peers, not advice, and I keep medical details private.",
    sample: true,
  },
  {
    id: "elena",
    name: "Elena",
    area: "Half Moon Bay area",
    miles: 18,
    experiences: ["life", "grief"],
    connections: ["friendship"],
    mode: "both",
    bio: "Starting over on the coast. I would like one or two steady friends, online is fine when the drive is too much.",
    sample: true,
  },
  {
    id: "chris",
    name: "Chris",
    area: "Oakland area",
    miles: 24,
    experiences: ["mental", "life"],
    connections: ["peer", "friendship"],
    mode: "online",
    bio: "I prefer conversation from home. Kind, low-pressure, and no fixing.",
    sample: true,
  },
  {
    id: "noah",
    name: "Noah",
    area: "Burlingame area",
    miles: 6,
    experiences: ["caregiver", "disability"],
    connections: ["activities", "peer"],
    mode: "inperson",
    bio: "Sibling and backup caregiver. I am looking for accessible plans and people who do not need the whole story first.",
    sample: true,
  },
  {
    id: "rena",
    name: "Rena",
    area: "Los Angeles area",
    miles: 340,
    experiences: ["other", "health"],
    connections: ["stories", "friendship"],
    mode: "online",
    bio: "Far from the Peninsula sample area, so I show up for online circles. Happy to listen.",
    sample: true,
  },
];

export type Circle = {
  id: string;
  name: string;
  experience: ExperienceId;
  area: string;
  about: string;
  size: number;
};

export const CIRCLES: Circle[] = [
  {
    id: "caregivers",
    name: "Caregivers Circle",
    experience: "caregiver",
    area: "Mid-county",
    about: "A small circle for people supporting someone else. Check-ins, not homework.",
    size: 18,
  },
  {
    id: "walk",
    name: "Grief walking companions",
    experience: "grief",
    area: "Bayside",
    about: "A slow walk. Talking is optional. Leaving early is fine.",
    size: 12,
  },
  {
    id: "access",
    name: "Accessible outings",
    experience: "disability",
    area: "Countywide sample",
    about: "Plans chosen for step-free paths, seating, and a pace everyone can keep.",
    size: 22,
  },
];

export type Meetup = {
  id: string;
  name: string;
  area: string;
  when: string;
  time: string;
  access: AccessId[];
  size: string;
  description: string;
  organizer: string;
  experience: ExperienceId;
  sample: boolean;
};

export const MEETUPS: Meetup[] = [
  {
    id: "coffee-care",
    name: "Casual coffee for caregivers",
    area: "San Mateo, near the downtown library",
    when: "Saturday, November 7",
    time: "10:00–11:30 am",
    access: ["wheelchair", "transit", "seating", "quiet"],
    size: "Up to 8",
    description:
      "A table, a drink, and no requirement to explain your week. The exact café is shared only with people the organizer confirms.",
    organizer: "Amira",
    experience: "caregiver",
    sample: true,
  },
  {
    id: "grief-walk",
    name: "Grief and loss walking group",
    area: "Foster City bay path",
    when: "Sunday, November 8",
    time: "9:00–10:00 am",
    access: ["sensory", "seating", "quiet"],
    size: "Up to 12",
    description:
      "A flat, slow loop. Headphones welcome. You can walk beside someone or a little apart.",
    organizer: "Luis",
    experience: "grief",
    sample: true,
  },
  {
    id: "park",
    name: "Accessible park outing",
    area: "Coyote Point area",
    when: "Saturday, November 14",
    time: "1:00–3:00 pm",
    access: ["wheelchair", "transit", "seating", "sensory"],
    size: "Up to 15",
    description:
      "Shade, restrooms, and places to sit. Built for people who want a plan that already considered access.",
    organizer: "Jordan",
    experience: "disability",
    sample: true,
  },
  {
    id: "new-disability",
    name: "Gathering for a new disability",
    area: "Burlingame community room",
    when: "Wednesday, November 18",
    time: "6:00–7:30 pm",
    access: ["wheelchair", "transit", "seating", "quiet"],
    size: "Up to 10",
    description:
      "For people whose body or access needs changed recently. Stories are invited, never required.",
    organizer: "Noah",
    experience: "disability",
    sample: true,
  },
  {
    id: "peer-health",
    name: "Peer hour after a hard health year",
    area: "Online, with an East Palo Alto host",
    when: "Thursday, November 12",
    time: "5:30–6:30 pm",
    access: ["quiet", "sensory"],
    size: "Up to 10",
    description:
      "Cameras optional. No medical advice. A place to say how the week actually went.",
    organizer: "Priya",
    experience: "health",
    sample: true,
  },
  {
    id: "dinner",
    name: "Relaxed community dinner",
    area: "Redwood City, transit stop nearby",
    when: "Friday, November 20",
    time: "6:30–8:00 pm",
    access: ["wheelchair", "transit", "seating"],
    size: "Up to 14",
    description:
      "A simple dinner for people who want friends more than a support group. Dietary notes collected only by the organizer.",
    organizer: "Elena",
    experience: "life",
    sample: true,
  },
];

export type Post = {
  id: string;
  title: string;
  author: string;
  experience: ExperienceId;
  body: string;
  replies: Array<{ id: string; author: string; body: string }>;
};

export const POSTS: Post[] = [
  {
    id: "hello",
    title: "Introducing myself, without the whole story",
    author: "Jordan",
    experience: "disability",
    body: "I am Jordan, near San Mateo. I am new here and I would rather start with coffee than a timeline. If you are also easing in, say hello.",
    replies: [
      {
        id: "h1",
        author: "Noah",
        body: "Hello, Jordan. Easing in is a good pace. Glad you are here.",
      },
    ],
  },
  {
    id: "win",
    title: "A small win this week",
    author: "Amira",
    experience: "caregiver",
    body: "I left the house for twenty minutes and the sky was doing something nice. That is the whole update. It still counts.",
    replies: [
      {
        id: "w1",
        author: "Elena",
        body: "It counts. I am keeping this one.",
      },
    ],
  },
  {
    id: "explain",
    title: "How do you tell a friend it was a hard day?",
    author: "Priya",
    experience: "health",
    body: "I want language that is honest and short. I do not want to hand someone my chart. What do you actually text?",
    replies: [
      {
        id: "e1",
        author: "Chris",
        body: "I send “rough day, no advice needed, just saying it.” People who can hold that are the ones I keep.",
      },
    ],
  },
  {
    id: "milestone",
    title: "Celebrating a milestone, quietly",
    author: "Luis",
    experience: "grief",
    body: "I made it through a date I had been dreading. I do not need a parade. I did want someone else to know.",
    replies: [],
  },
];

export function experienceTitle(id: ExperienceId) {
  return EXPERIENCES.find((item) => item.id === id)?.title ?? id;
}

export function getMember(id: string) {
  return MEMBERS.find((member) => member.id === id);
}

export function getMeetup(id: string, extra: Meetup[]) {
  return extra.find((meetup) => meetup.id === id) ?? MEETUPS.find((meetup) => meetup.id === id);
}

export function getPost(id: string) {
  return POSTS.find((post) => post.id === id);
}

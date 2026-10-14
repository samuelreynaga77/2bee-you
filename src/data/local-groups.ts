import type { ExperienceId } from "@/data/community";

export type LocalGroup = {
  id: string;
  name: string;
  experience: ExperienceId;
  area: string;
  about: string;
  when: string;
  phone?: string;
  site: string;
};

/** Public organizations. Facts are from each group's own site. They are not 2Bee You members. */
export const LOCAL_GROUPS: LocalGroup[] = [
  {
    id: "cid",
    name: "Center for Independence of Individuals with Disabilities",
    experience: "disability",
    area: "2001 Windward Way, Suite 103, San Mateo",
    about:
      "Independent-living center run mostly by people with disabilities. Services include peer support, advocacy, and information for San Mateo County.",
    when: "Their site lists a weekly peer support group on Wednesdays at 3:00 p.m. Call to confirm the room.",
    phone: "650-645-1780",
    site: "https://www.cidsanmateo.org/",
  },
  {
    id: "abilitypath",
    name: "AbilityPath Family Resource Center",
    experience: "caregiver",
    area: "350 Twin Dolphin Drive, Suite 123, Redwood City",
    about:
      "Parent-to-parent support for families of children with disabilities who live or work in San Mateo County, from birth through age 22.",
    when: "Support groups and workshops. Call for the current English and Spanish group times.",
    phone: "650-259-0189",
    site: "https://abilitypath.org/services/family-support-services/family-resource-center/",
  },
  {
    id: "fca",
    name: "Family Caregiver Alliance",
    experience: "caregiver",
    area: "Serves all of San Mateo County",
    about:
      "Free help for people caring for an adult age 60 or older, or for someone with an adult-onset brain condition such as dementia, stroke, or Parkinson’s. The office is in San Francisco.",
    when: "Care planning, education, and support groups. Call to ask which group fits.",
    phone: "800-445-8106",
    site: "https://www.caregiver.org/",
  },
  {
    id: "mission-hospice",
    name: "Mission Hospice & Home Care grief groups",
    experience: "grief",
    area: "66 Bovet Road, Suite 100, San Mateo",
    about:
      "Free grief support for bereaved people on the San Francisco Peninsula and South Bay, including San Mateo County. You do not have to have used their hospice.",
    when: "Virtual and in-person groups. The calendar changes, so call before you go.",
    phone: "650-554-1000",
    site: "https://www.missionhospice.org/services/bereavement-support/",
  },
  {
    id: "nami",
    name: "NAMI San Mateo County",
    experience: "mental",
    area: "Countywide, with programs in Redwood City",
    about:
      "Free education and support for people living with mental illness and for their families. This is peer support, not a hospital.",
    when: "Classes and support groups meet on a posted schedule. If you are in crisis, call 650-579-0350 or 988.",
    phone: "800-950-6264",
    site: "https://namisanmateo.org/support/",
  },
  {
    id: "bhrs",
    name: "San Mateo County Behavioral Health Access Call Center",
    experience: "mental",
    area: "Clinics in Daly City, San Mateo, Half Moon Bay, Redwood City, and East Palo Alto",
    about:
      "The county starting point for non-emergency mental health and substance-use treatment. Staff speak English, Spanish, and Chinese, with interpreters for other languages.",
    when: "Open 24/7. This is a phone line and a referral, not a drop-in group. For a crisis, call 650-579-0350 or 988.",
    phone: "800-686-0101",
    site: "https://smchealth.org/division/divisions/behavioral-health-recovery-services/contact-behavioral-health-recovery-services/",
  },
  {
    id: "stanford-cancer",
    name: "Stanford Health Care cancer support groups",
    experience: "health",
    area: "Mostly online; Stanford also has care in Redwood City",
    about:
      "Free groups for people with cancer and for the people caring for them, including groups for all cancer types and for caregivers.",
    when: "Days differ by group. Use their list and call the number on the group you want.",
    site: "https://stanfordhealthcare.org/for-patients-visitors/support-groups.html",
  },
  {
    id: "vorsmc",
    name: "Voices of Recovery San Mateo County",
    experience: "life",
    area: "650 Main Street, Redwood City",
    about:
      "Free, peer-led recovery support for people seeking long-term recovery from alcohol and other drugs, and for families.",
    when: "Center hours Monday–Friday, 11:00 a.m.–7:00 p.m. Weekly groups are listed on their site. Confirm before you go.",
    site: "https://www.vorsmc.org/programs",
  },
  {
    id: "jobtrain",
    name: "JobTrain",
    experience: "life",
    area: "1200 O'Brien Drive, Menlo Park",
    about:
      "Career training and job-search help for people starting over, including a career center serving south San Mateo County.",
    when: "Call for current class and career-center hours. A second center is at 2100 University Avenue, Suite C, East Palo Alto, 650-330-6431.",
    phone: "650-330-6429",
    site: "https://www.jobtrainworks.org/",
  },
];

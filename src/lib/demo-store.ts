import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ConnectionId, ExperienceId, Meetup, ModeId, RoleId } from "@/data/community";

export type TextSize = "md" | "lg" | "xl";

export type DemoProfile = {
  name: string;
  role: RoleId | null;
  experiences: ExperienceId[];
  connections: ConnectionId[];
  city: string;
  distance: "5" | "15" | "30" | "any";
  mode: ModeId | null;
  discoverable: boolean;
  showExperiences: boolean;
  textSize: TextSize;
  onboarded: boolean;
};

export const EMPTY_PROFILE: DemoProfile = {
  name: "",
  role: null,
  experiences: [],
  connections: [],
  city: "",
  distance: "15",
  mode: null,
  discoverable: false,
  showExperiences: true,
  textSize: "md",
  onboarded: false,
};

type Reply = { id: string; author: string; body: string };

export type LocalPost = {
  id: string;
  title: string;
  body: string;
  experience: ExperienceId;
  author: string;
};

type Store = {
  hydrated: boolean;
  profile: DemoProfile;
  joined: string[];
  interested: string[];
  blocked: string[];
  hiddenPosts: string[];
  localMeetups: Meetup[];
  localReplies: Record<string, Reply[]>;
  localPosts: LocalPost[];
  setHydrated: (value: boolean) => void;
  setProfile: (profile: DemoProfile) => void;
  patchProfile: (partial: Partial<DemoProfile>) => void;
  toggleId: (key: "joined" | "interested" | "blocked" | "hiddenPosts", id: string) => void;
  addMeetup: (meetup: Meetup) => void;
  addReply: (postId: string, body: string) => void;
  addPost: (input: { title: string; body: string; experience: ExperienceId }) => void;
  reset: () => void;
};

export const useDemo = create<Store>()(
  persist(
    (set, get) => ({
      hydrated: false,
      profile: EMPTY_PROFILE,
      joined: [],
      interested: [],
      blocked: [],
      hiddenPosts: [],
      localMeetups: [],
      localReplies: {},
      localPosts: [],
      setHydrated: (hydrated) => set({ hydrated }),
      setProfile: (profile) => set({ profile }),
      patchProfile: (partial) => set({ profile: { ...get().profile, ...partial } }),
      toggleId: (key, id) => {
        const list = get()[key];
        set({
          [key]: list.includes(id) ? list.filter((item) => item !== id) : [...list, id],
        });
      },
      addMeetup: (meetup) => set({ localMeetups: [meetup, ...get().localMeetups] }),
      addReply: (postId, body) => {
        const name = get().profile.name.trim() || "You";
        const reply = { id: `local-${Date.now()}`, author: name, body };
        const existing = get().localReplies[postId] ?? [];
        set({ localReplies: { ...get().localReplies, [postId]: [...existing, reply] } });
      },
      addPost: ({ title, body, experience }) => {
        const post: LocalPost = {
          id: `note-${Date.now()}`,
          title,
          body,
          experience,
          author: get().profile.name.trim() || "You",
        };
        set({ localPosts: [post, ...get().localPosts] });
      },
      reset: () =>
        set({
          profile: EMPTY_PROFILE,
          joined: [],
          interested: [],
          blocked: [],
          hiddenPosts: [],
          localMeetups: [],
          localReplies: {},
          localPosts: [],
        }),
    }),
    {
      name: "2bee-you",
      skipHydration: true,
      partialize: (state) => ({
        profile: state.profile,
        joined: state.joined,
        interested: state.interested,
        blocked: state.blocked,
        hiddenPosts: state.hiddenPosts,
        localMeetups: state.localMeetups,
        localReplies: state.localReplies,
        localPosts: state.localPosts,
      }),
    },
  ),
);

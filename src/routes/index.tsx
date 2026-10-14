import { createFileRoute, Link } from "@tanstack/react-router";
import { BeeMark, Shell } from "@/components/shell";
import { EXPERIENCES } from "@/data/community";

export const Route = createFileRoute("/")({ component: Home });

const STEPS = [
  { n: "01", title: "Find people with similar experiences", text: "Choose what you want company for. Skip anything you would rather keep private." },
  { n: "02", title: "Connect with people in your area", text: "See who has opted in nearby. Only a city or neighborhood, never a live location." },
  { n: "03", title: "Join a meetup or create your own", text: "Coffee, a walk, a quiet hour online. Access details are part of the plan." },
  { n: "04", title: "Build friendships and support each other", text: "Share a story if you want. A short hello is enough." },
];

function Home() {
  return (
    <Shell>
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold text-honey-deep">A place to be you</p>
          <h1 className="mt-3 max-w-xl text-hero">You don’t have to go through it alone.</h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Find your people. Share your experiences. Build connections with people who understand.
          </p>
          <p className="mt-3 max-w-xl text-muted">
            2Bee You is a community for people with disabilities, caregivers and family, and anyone
            carrying health trauma, grief, mental health challenges, or a hard life change. It is not a
            dating app and not a replacement for professional care.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              to="/onboarding"
              className="inline-flex min-h-12 items-center justify-center rounded-control bg-honey-deep px-5 font-semibold text-foam"
            >
              Find My Community
            </Link>
            <Link
              to="/meetups"
              className="inline-flex min-h-12 items-center justify-center rounded-control border border-line bg-card px-5 font-semibold"
            >
              Explore Local Meetups
            </Link>
          </div>
        </div>
        <figure className="overflow-hidden rounded-card border border-line bg-card">
          <img
            src="/mascots/hero.jpg"
            alt="Two bees flying side by side through warm light and sage leaves."
            className="aspect-video w-full object-cover"
          />
        </figure>
      </div>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-title">Whatever you’re going through, there’s a place for you.</h2>
          <BeeMark className="size-14 shrink-0" />
        </div>
        <p className="mt-2 max-w-2xl text-muted">
          You can select more than one. You also choose how much to share. A category is not a
          diagnosis, and it is never required.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {EXPERIENCES.map((item) => (
            <li key={item.id}>
              <Link
                to="/community"
                search={{ cat: item.id }}
                className="block h-full rounded-card border border-line bg-card p-4"
              >
                <h3 className="text-xl">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.text}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-title">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {STEPS.map((step) => (
            <li key={step.n} className="rounded-card border border-line bg-card p-4">
              <p className="font-display text-lg text-honey-deep">{step.n}</p>
              <h3 className="mt-1 text-xl">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 rounded-card border border-line bg-sage-soft p-5 sm:p-8">
        <h2 className="text-title">You belong here.</h2>
        <p className="mt-2 max-w-xl text-muted">
          You don’t have to explain everything. You can just be you. Different journeys. Shared
          understanding.
        </p>
        <Link
          to="/login"
          className="mt-5 inline-flex min-h-12 items-center rounded-control bg-ink px-5 font-semibold text-foam"
        >
          Start with an account
        </Link>
      </section>
    </Shell>
  );
}

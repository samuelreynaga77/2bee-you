import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/how-it-works")({ component: HowPage });

const STEPS = [
  ["Find people with similar experiences.", "Pick the parts of life you want company for. Leave the rest blank."],
  ["Connect with people in your area.", "You choose a city or neighborhood. The site never uses a live location."],
  ["Join a meetup or create your own.", "Access notes sit beside the time and place. The exact spot waits until a host confirms you."],
  ["Build friendships and support each other.", "A hello, a walk, or a short story. You decide the pace."],
];

function HowPage() {
  return (
    <Shell>
      <h1 className="text-title">How 2Bee You works</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Nobody should have to go through life’s hardest moments alone. This is a community for shared
        understanding, not a clinic and not a dating app.
      </p>
      <ol className="mt-8 grid gap-4">
        {STEPS.map(([title, text], index) => (
          <li key={title} className="rounded-card border border-line bg-card p-4">
            <p className="font-display text-lg text-honey-deep">0{index + 1}</p>
            <h2 className="text-2xl">{title}</h2>
            <p className="mt-1 text-muted">{text}</p>
          </li>
        ))}
      </ol>
      <h2 className="mt-10 text-2xl">What is saved</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
        <li>Your account, profile, circle membership, and meetup interest are saved to your sign-in.</li>
        <li>Groups on Community and Meetups are independent San Mateo County organizations. Confirm the time on their own site.</li>
        <li>Stories, blocks, and reports stay on this device. Nobody reviews them yet.</li>
      </ul>
      <h2 className="mt-8 text-2xl">Still to come before a wide public launch</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
        <li>Moderators who can act on reports.</li>
        <li>Private messages between members.</li>
        <li>A privacy review, because these topics are sensitive.</li>
      </ul>
      <Link to="/onboarding" className="mt-8 inline-flex min-h-12 items-center font-semibold text-honey-deep">
        Find My Community
      </Link>
    </Shell>
  );
}

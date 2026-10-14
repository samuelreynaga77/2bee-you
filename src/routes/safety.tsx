import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/safety")({ component: SafetyPage });

const RULES = [
  "No harassment, slurs, or discrimination.",
  "No pressure to share a diagnosis, a trauma story, or contact details.",
  "No unsolicited medical, legal, or therapeutic advice.",
  "No competition over who has suffered more. Milestones can be small.",
  "No dating pitches. This is not a dating app.",
  "Respect access needs, including the choice to leave early or stay quiet.",
];

function SafetyPage() {
  return (
    <Shell>
      <h1 className="text-title">Safety and community guidelines</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        2Bee You offers peer connection. It does not provide professional medical care, therapy, or crisis
        counseling.
      </p>
      <div className="mt-6 rounded-card border border-honey-deep bg-card p-4">
        <h2 className="text-2xl">If you need help right now</h2>
        <p className="mt-2">
          If you are in immediate danger, call 911. If you are thinking about suicide or need someone to
          talk to, call or text <a className="font-semibold underline" href="tel:988">988</a> (24 hours).
          2Bee You cannot respond to a crisis.
        </p>
      </div>
      <h2 className="mt-8 text-2xl">Community rules</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        {RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
      <h2 className="mt-8 text-2xl">Privacy</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
        <li>You can edit only your own profile. Your email is never shown to other members.</li>
        <li>You appear in the community only if you turn Discoverable on.</li>
        <li>County groups list a public phone and address from that organization’s own website. 2Bee You does not sign you up with them.</li>
        <li>An exact meetup spot is stored separately and shown only to the host and people who joined.</li>
        <li>Block, hide, and report still affect only this device. They are not reviewed by anyone yet.</li>
      </ul>
      <p className="mt-6 text-sm text-faint">
        Text size can be changed in Settings. Pages are built to work with a keyboard and a screen reader.
      </p>
    </Shell>
  );
}

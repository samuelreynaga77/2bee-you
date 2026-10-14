import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <Shell>
      <div className="grid items-start gap-8 lg:grid-cols-[auto_1fr]">
        <img
          src="/mascots/bees.jpg"
          alt="Two bees facing each other, with a small heart between them."
          className="size-40 rounded-card object-cover"
        />
        <div>
          <h1 className="text-title">About 2Bee You</h1>
          <p className="mt-3 max-w-xl text-lg">
            Two bees, two different paths, finding a little common ground. That is the whole picture.
          </p>
        </div>
      </div>
      <div className="mt-8 max-w-2xl space-y-4 text-muted">
        <p>
          2Bee You is for people with disabilities, the family and caregivers beside them, and anyone
          living with health trauma, grief, mental health challenges, or a life that turned. The aim is
          simple: nobody should have to go through the hardest moments alone.
        </p>
        <p>
          Members can look for friendship, tell a story if they want, and meet through local gatherings.
          Participation is voluntary. You choose what is visible. You do not owe anyone your history.
        </p>
        <p>
          The feeling we want is not a hospital and not a feed that asks you to perform your pain. It is
          closer to a kitchen table. You belong here. You don’t have to explain everything. You can just
          be you.
        </p>
        <p className="text-ink">Different journeys. Shared understanding. A place to be you.</p>
      </div>
    </Shell>
  );
}

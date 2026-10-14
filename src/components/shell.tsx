import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useDemo } from "@/lib/demo-store";

const LINKS = [
  { to: "/community", label: "Community" },
  { to: "/meetups", label: "Meetups" },
  { to: "/discussions", label: "Stories" },
  { to: "/how-it-works", label: "How it works" },
] as const;

export function BeeMark({ className = "size-10" }: { className?: string }) {
  return (
    <img
      src="/mascots/bees.jpg"
      alt=""
      className={`${className} rounded-full object-cover`}
    />
  );
}

export function SampleNote({ children }: { children?: string }) {
  return (
    <p className="rounded-control bg-sage-soft px-4 py-3 text-sm text-ink">
      {children ??
        "Sample community. The people, circles, and meetups on this page are examples so you can try 2Bee You. They are not real members, and nothing here is a live location."}
    </p>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const hydrated = useDemo((state) => state.hydrated);
  const textSize = useDemo((state) => state.profile.textSize);
  const { user, isPending } = useCurrentUserState();

  useEffect(() => {
    void Promise.resolve(useDemo.persist.rehydrate()).then(() => {
      useDemo.getState().setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.text = textSize;
  }, [hydrated, textSize]);

  return (
    <div className="flex min-h-dvh flex-col bg-cream text-ink">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-20 border-b border-line bg-cream/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <BeeMark />
            <span>
              <span className="font-display block text-xl leading-none">2Bee You</span>
              <span className="text-xs text-faint">Different journeys. Shared understanding.</span>
            </span>
          </Link>
          {isPending ? (
            <div className="h-11 w-24 animate-pulse rounded-control bg-line" />
          ) : user ? (
            <UserButton />
          ) : (
            <Link
              to="/login"
              className="inline-flex min-h-11 items-center rounded-control bg-honey-deep px-3 text-sm font-semibold text-foam"
            >
              Sign in
            </Link>
          )}
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-3 pb-2" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="inline-flex min-h-11 shrink-0 items-center rounded-chip px-3 text-sm font-medium text-ink"
              activeProps={{ className: "inline-flex min-h-11 shrink-0 items-center rounded-chip bg-sage-soft px-3 text-sm font-semibold text-sage" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main id="content" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto grid max-w-5xl gap-4 px-4 py-8 text-sm text-muted sm:grid-cols-2">
          <p>
            2Bee You is peer connection, not medical care, therapy, or a crisis service. If you are in
            danger or thinking about suicide, call or text 988, or call 911.
          </p>
          <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Footer">
            <Link to="/about" className="min-h-11 inline-flex items-center font-medium text-ink">
              About
            </Link>
            <Link to="/safety" className="min-h-11 inline-flex items-center font-medium text-ink">
              Safety
            </Link>
            <Link to="/profile" className="min-h-11 inline-flex items-center font-medium text-ink">
              Settings
            </Link>
            <Link to="/login" className="min-h-11 inline-flex items-center font-medium text-ink">
              Sign in
            </Link>
          </nav>
          <p className="sm:col-span-2">
            Accounts are real. Your email stays private, and you can edit only your own profile. People and
            meetups marked Sample are examples, not members. Stories you write stay on this device.
          </p>
        </div>
      </footer>
    </div>
  );
}

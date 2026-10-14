import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Field, PrimaryButton, fieldClass } from "@/components/bits";
import { Shell } from "@/components/shell";
import { GROK_PROVIDERS, authClient, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: LoginPage });

function rememberToken(token: string | null) {
  if (!token) return;
  try {
    window.sessionStorage.setItem("grok-auth.bearer-token", token);
  } catch {
    /* storage can be blocked; the cookie still applies outside the preview */
  }
}

function LoginPage() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"up" | "in">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    setPending(true);
    const options = {
      onSuccess(ctx: { response: Response }) {
        rememberToken(ctx.response.headers.get("set-auth-token"));
      },
    };
    const result =
      mode === "up"
        ? await authClient.signUp.email({ email: email.trim(), password, name: name.trim() || "Member" }, options)
        : await authClient.signIn.email({ email: email.trim(), password }, options);
    if (result.error) {
      setPending(false);
      setError(result.error.message || "That didn’t work. Check the email and password.");
      return;
    }
    await authClient.getSession();
    void navigate({ to: "/profile" });
  }

  async function continueWith(providerId: string) {
    setError("");
    try {
      await signIn(providerId, { callbackURL: "/profile" });
    } catch {
      setError("Google or X could not open on this phone. Use your email and password above instead.");
    }
  }

  return (
    <Shell>
      <h1 className="text-title">{mode === "up" ? "Create your account" : "Sign in"}</h1>
      <p className="mt-3 max-w-xl text-muted">
        Your email stays private. Other people only see a display name, a general area, and the tags you
        choose to show.
      </p>
      {isPending ? <p className="mt-6 text-muted">Checking your account…</p> : null}
      {!isPending && user ? (
        <p className="mt-6">
          You’re signed in.{" "}
          <Link to="/profile" className="font-semibold text-honey-deep">
            Go to your profile
          </Link>
          .
        </p>
      ) : null}
      {!isPending && !user ? (
        <div className="mt-6 grid max-w-md gap-6">
          <form className="grid gap-4" onSubmit={submit}>
            {mode === "up" ? (
              <Field label="Display name">
                <input
                  className={fieldClass}
                  value={name}
                  onChange={(event) => setName(event.target.value.slice(0, 40))}
                  placeholder="First name or nickname"
                  required
                  autoComplete="nickname"
                />
              </Field>
            ) : null}
            <Field label="Email">
              <input
                className={fieldClass}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value.slice(0, 120))}
                autoComplete="email"
                required
              />
            </Field>
            <Field label="Password">
              <input
                className={fieldClass}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value.slice(0, 80))}
                autoComplete={mode === "up" ? "new-password" : "current-password"}
                required
                minLength={8}
              />
            </Field>
            {error ? <p className="text-sm text-honey-deep">{error}</p> : null}
            <PrimaryButton type="submit" disabled={pending}>
              {pending ? "Working…" : mode === "up" ? "Create account" : "Sign in"}
            </PrimaryButton>
            <button
              type="button"
              className="min-h-11 text-left text-sm font-semibold text-ink"
              onClick={() => {
                setMode(mode === "up" ? "in" : "up");
                setError("");
              }}
            >
              {mode === "up" ? "I already have an account" : "Need an account? Create one"}
            </button>
          </form>
          <div>
            <p className="text-sm font-semibold">Or continue with</p>
            <p className="mt-1 text-sm text-muted">
              If Google only shows the word error, skip it. The email form above is the one that works on a
              phone.
            </p>
            <div className="mt-2 grid gap-2">
              {GROK_PROVIDERS.map((provider) => (
                <button
                  key={provider.providerId}
                  type="button"
                  onClick={() => void continueWith(provider.providerId)}
                  className="inline-flex min-h-12 items-center justify-center rounded-control border border-line bg-card px-5 font-semibold"
                >
                  Continue with {provider.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Shell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PrimaryButton, fieldClass } from "@/components/bits";
import { SampleNote, Shell } from "@/components/shell";
import { EXPERIENCES, POSTS, experienceTitle, type ExperienceId } from "@/data/community";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/discussions")({ component: DiscussionsPage });

function DiscussionsPage() {
  const hidden = useDemo((state) => state.hiddenPosts);
  const localPosts = useDemo((state) => state.localPosts);
  const addPost = useDemo((state) => state.addPost);
  const posts = POSTS.filter((post) => !hidden.includes(post.id));
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [experience, setExperience] = useState<ExperienceId>("other");

  function publish(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    addPost({ title: title.trim(), body: body.trim(), experience });
    setTitle("");
    setBody("");
    setOpen(false);
  }

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-title">Community stories</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Introductions, questions, small milestones, and encouragement. Share only what you want. Nobody is
            scored for how much they disclose.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-12 items-center rounded-control bg-honey-deep px-5 font-semibold text-foam"
        >
          {open ? "Close" : "Share a note"}
        </button>
      </div>
      <div className="mt-4">
        <SampleNote />
      </div>
      {open ? (
        <form onSubmit={publish} className="mt-4 grid gap-3 rounded-card border border-line bg-card p-4">
          <label className="text-sm font-semibold" htmlFor="note-title">
            A short title
          </label>
          <input
            id="note-title"
            value={title}
            onChange={(event) => setTitle(event.target.value.slice(0, 80))}
            className={fieldClass}
            placeholder="Hello, or a small win"
            required
          />
          <label className="text-sm font-semibold" htmlFor="note-body">
            What you want to say
          </label>
          <textarea
            id="note-body"
            value={body}
            onChange={(event) => setBody(event.target.value.slice(0, 600))}
            className={`${fieldClass} min-h-28 py-3`}
            placeholder="You can leave out the hard details."
            required
          />
          <label className="text-sm font-semibold" htmlFor="note-topic">
            Topic, if you want one
          </label>
          <select
            id="note-topic"
            value={experience}
            onChange={(event) => setExperience(event.target.value as ExperienceId)}
            className={fieldClass}
          >
            {EXPERIENCES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <PrimaryButton type="submit">Keep it on this device</PrimaryButton>
        </form>
      ) : null}
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {localPosts.map((post) => (
          <li key={post.id}>
            <Link to="/discussions/$id" params={{ id: post.id }} className="block py-4">
              <p className="text-xs font-semibold text-honey-deep">
                {experienceTitle(post.experience)} · your note
              </p>
              <h2 className="mt-1 text-2xl">{post.title}</h2>
              <p className="mt-1 text-sm text-muted">{post.body}</p>
              <p className="mt-2 text-xs text-faint">{post.author} · saved on this device</p>
            </Link>
          </li>
        ))}
        {posts.map((post) => (
          <li key={post.id}>
            <Link to="/discussions/$id" params={{ id: post.id }} className="block py-4">
              <p className="text-xs font-semibold text-honey-deep">{experienceTitle(post.experience)}</p>
              <h2 className="mt-1 text-2xl">{post.title}</h2>
              <p className="mt-1 text-sm text-muted">{post.body}</p>
              <p className="mt-2 text-xs text-faint">
                {post.author} · sample post · {post.replies.length} {post.replies.length === 1 ? "reply" : "replies"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

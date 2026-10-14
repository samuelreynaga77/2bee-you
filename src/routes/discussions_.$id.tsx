import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GhostButton, PrimaryButton, fieldClass } from "@/components/bits";
import { SampleNote, Shell } from "@/components/shell";
import { experienceTitle, getPost } from "@/data/community";
import { useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/discussions_/$id")({ component: DiscussionPage });

const NO_REPLIES: Array<{ id: string; author: string; body: string }> = [];

function DiscussionPage() {
  const { id } = Route.useParams();
  const postFromSample = getPost(id);
  const local = useDemo((state) => state.localPosts.find((item) => item.id === id));
  const post = postFromSample ?? (local ? { ...local, replies: NO_REPLIES } : undefined);
  const hidden = useDemo((state) => state.hiddenPosts.includes(id));
  const replies = useDemo((state) => state.localReplies[id]) ?? NO_REPLIES;
  const addReply = useDemo((state) => state.addReply);
  const toggle = useDemo((state) => state.toggleId);
  const [text, setText] = useState("");
  const [reported, setReported] = useState(false);

  if (!post || hidden) {
    return (
      <Shell>
        <h1 className="text-title">{hidden ? "You hid this sample post" : "That story isn’t here"}</h1>
        <Link to="/discussions" className="mt-4 inline-flex font-semibold text-honey-deep">
          All stories
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      {postFromSample ? <SampleNote /> : <p className="text-sm text-sage">Your note stays on this device.</p>}
      <p className="mt-6 text-sm font-semibold text-honey-deep">{experienceTitle(post.experience)}</p>
      <h1 className="mt-1 text-title">{post.title}</h1>
      <p className="mt-2 text-sm text-faint">{post.author} · {postFromSample ? "sample post" : "your note"}</p>
      <p className="mt-4 max-w-xl text-lg">{post.body}</p>
      <div className="mt-4 flex gap-2">
        <GhostButton type="button" onClick={() => toggle("hiddenPosts", post.id)}>
          Hide
        </GhostButton>
        <GhostButton type="button" onClick={() => setReported(true)}>
          Report
        </GhostButton>
      </div>
      {reported ? <p className="mt-2 text-sm">Report stays on this device. It was not sent anywhere.</p> : null}
      <h2 className="mt-8 text-2xl">Replies</h2>
      <ul className="mt-3 grid gap-3">
        {[...post.replies, ...replies].map((reply) => (
          <li key={reply.id} className="rounded-control border border-line bg-card p-4">
            <p className="text-sm font-semibold">{reply.author}</p>
            <p className="mt-1">{reply.body}</p>
          </li>
        ))}
      </ul>
      <form
        className="mt-4 grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const body = text.trim();
          if (!body) return;
          addReply(post.id, body);
          setText("");
        }}
      >
        <label className="text-sm font-semibold" htmlFor="reply">
          Offer a few words
        </label>
        <textarea
          id="reply"
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, 500))}
          className={`${fieldClass} min-h-24 py-3`}
          placeholder="Kind, short, and only if you want to. No advice required."
        />
        <PrimaryButton type="submit">Add reply on this device</PrimaryButton>
      </form>
    </Shell>
  );
}

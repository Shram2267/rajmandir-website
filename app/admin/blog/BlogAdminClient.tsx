"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/blog";
import {
  uploadBlogCover,
  saveBlogPost,
  deleteBlogPost,
  togglePublished,
  reorderBlog,
} from "./actions";

type Draft = {
  id: number | null;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_url: string;
  published: boolean;
};

const EMPTY: Draft = {
  id: null,
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  cover_url: "",
  published: true,
};

export default function BlogAdminClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const editing = draft.id !== null;

  const refresh = () => router.refresh();

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const startNew = () => setDraft(EMPTY);
  const startEdit = (p: BlogPost) =>
    setDraft({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt ?? "",
      body: p.body ?? "",
      cover_url: p.cover_url ?? "",
      published: p.published,
    });

  const onPickCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadBlogCover(fd);
    setUploading(false);
    if (res?.success && res.url) set("cover_url", res.url);
    else if (res?.error) alert(res.error);
    e.target.value = "";
  };

  const save = async () => {
    if (!draft.title.trim()) {
      alert("Title is required.");
      return;
    }
    setSaving(true);
    const res = await saveBlogPost({
      id: draft.id,
      slug: draft.slug,
      title: draft.title,
      excerpt: draft.excerpt,
      body: draft.body,
      cover_url: draft.cover_url,
      published: draft.published,
    });
    setSaving(false);
    if (res?.error) {
      alert(res.error);
      return;
    }
    setDraft(EMPTY);
    refresh();
  };

  const remove = async (p: BlogPost) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const res = await deleteBlogPost(p.id, p.cover_url);
    if (res?.error) {
      alert(res.error);
      return;
    }
    setPosts((prev) => prev.filter((x) => x.id !== p.id));
    if (draft.id === p.id) setDraft(EMPTY);
    refresh();
  };

  const toggle = async (p: BlogPost) => {
    const res = await togglePublished(p.id, !p.published);
    if (res?.error) {
      alert(res.error);
      return;
    }
    setPosts((prev) => prev.map((x) => (x.id === p.id ? { ...x, published: !p.published } : x)));
  };

  const move = async (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= posts.length) return;
    const next = [...posts];
    [next[index], next[j]] = [next[j], next[index]];
    setPosts(next);
    await reorderBlog(next.map((p) => p.id));
    refresh();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-ink">Manage Blog</h1>
          <p className="text-stone-500 mt-1">
            Posts appear in the home-page carousel and at <span className="font-mono">/blog</span>.
          </p>
        </div>
        {editing && (
          <button
            onClick={startNew}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-stone-100 text-stone-700 hover:bg-stone-200"
          >
            + New post
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] gap-6">
        {/* ---- Editor ---- */}
        <div className="bg-white rounded-xl border border-line shadow-sm p-5">
          <h2 className="text-sm font-bold text-ink mb-4">{editing ? "Edit post" : "New post"}</h2>

          <label className="block text-xs font-bold text-stone-500 mb-1">Title *</label>
          <input
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. 5 fresh recipes for this festive season"
            className="w-full rounded-md border border-line bg-white p-2.5 mb-3 focus:ring-1 focus:ring-brand focus:border-brand outline-none"
          />

          <label className="block text-xs font-bold text-stone-500 mb-1">
            Slug <span className="font-normal text-stone-400">(leave blank to auto-generate)</span>
          </label>
          <input
            value={draft.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="festive-recipes"
            className="w-full rounded-md border border-line bg-white p-2.5 mb-3 font-mono text-sm focus:ring-1 focus:ring-brand focus:border-brand outline-none"
          />

          <label className="block text-xs font-bold text-stone-500 mb-1">
            Excerpt <span className="font-normal text-stone-400">(card subtitle)</span>
          </label>
          <textarea
            value={draft.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            placeholder="A short one- or two-line summary shown on the card and listing."
            className="w-full min-h-[64px] resize-y rounded-md border border-line bg-white p-2.5 mb-3 focus:ring-1 focus:ring-brand focus:border-brand outline-none"
          />

          <label className="block text-xs font-bold text-stone-500 mb-1">
            Body <span className="font-normal text-stone-400">(HTML allowed: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;a&gt;…)</span>
          </label>
          <textarea
            value={draft.body}
            onChange={(e) => set("body", e.target.value)}
            placeholder="<p>Write your article here…</p>"
            className="w-full min-h-[220px] resize-y rounded-md border border-line bg-white p-2.5 mb-3 font-mono text-sm focus:ring-1 focus:ring-brand focus:border-brand outline-none"
          />

          <label className="block text-xs font-bold text-stone-500 mb-1">Cover image</label>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-28 h-20 rounded-md border border-line bg-stone-50 overflow-hidden flex items-center justify-center shrink-0">
              {draft.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.cover_url} alt="cover" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[11px] text-stone-400">No image</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickCover} />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="px-3 py-2 rounded-md text-sm font-bold bg-stone-100 text-stone-700 hover:bg-stone-200 disabled:opacity-60"
              >
                {uploading ? "Uploading…" : draft.cover_url ? "Replace image" : "Upload image"}
              </button>
              {draft.cover_url && (
                <button
                  onClick={() => set("cover_url", "")}
                  className="px-3 py-1.5 rounded-md text-xs font-bold text-red-600 hover:bg-red-50 self-start"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 mb-4 select-none">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => set("published", e.target.checked)}
              className="w-4 h-4 accent-[color:var(--color-brand)]"
            />
            <span className="text-sm font-semibold text-stone-700">Published (visible to visitors)</span>
          </label>

          <div className="flex items-center gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg text-sm font-bold bg-brand text-white hover:bg-brand-deep disabled:opacity-60"
            >
              {saving ? "Saving…" : editing ? "Save changes" : "Create post"}
            </button>
            {editing && (
              <button onClick={startNew} className="text-sm font-semibold text-stone-500 hover:text-ink">
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* ---- List ---- */}
        <div>
          <h2 className="text-sm font-bold text-ink mb-3">
            All posts <span className="font-medium text-stone-400">({posts.length})</span>
          </h2>
          {posts.length === 0 ? (
            <p className="text-sm text-stone-400 bg-white border border-line rounded-xl p-5">
              No posts yet — create your first one on the left.
            </p>
          ) : (
            <div className="space-y-2">
              {posts.map((p, i) => (
                <div
                  key={p.id}
                  className={`bg-white border rounded-xl p-3 flex items-center gap-3 ${
                    draft.id === p.id ? "border-brand ring-1 ring-brand/30" : "border-line"
                  }`}
                >
                  <div className="w-14 h-14 rounded-md bg-stone-50 border border-line overflow-hidden shrink-0 flex items-center justify-center">
                    {p.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-stone-400">—</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-ink truncate">{p.title}</div>
                    <div className="text-[11px] text-stone-400 font-mono truncate">/{p.slug}</div>
                    <button
                      onClick={() => toggle(p)}
                      className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.published ? "bg-leaf-wash text-leaf-deep" : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {p.published ? "● Published" : "○ Draft"}
                    </button>
                  </div>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="flex gap-1">
                      <button
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        title="Move up"
                        className="w-6 h-6 rounded text-stone-500 hover:bg-stone-100 disabled:text-stone-300"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => move(i, 1)}
                        disabled={i === posts.length - 1}
                        title="Move down"
                        className="w-6 h-6 rounded text-stone-500 hover:bg-stone-100 disabled:text-stone-300"
                      >
                        ↓
                      </button>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(p)}
                        title="Edit"
                        className="w-6 h-6 rounded text-stone-600 hover:bg-stone-100"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => remove(p)}
                        title="Delete"
                        className="w-6 h-6 rounded text-red-500 hover:bg-red-50"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Share2, Plus, Users, X } from "lucide-react";
import { Image } from "@/components/ui/image";
import { IMG } from "@/data/heritage";
import { addPoints } from "@/lib/gamification";
import { createCommunityPost, subscribeToCommunityPosts, trackEvent } from "@/lib/backend";

const SEED = [
  { id: "s1", title: "My grandmother's Banarasi loom", creator: "Ananya R.", category: "Family History", cover: IMG.banarasi, excerpt: "She wove for sixty years. I'm learning the motifs before they disappear with her hands.", likes: 142, comments: 23 },
  { id: "s2", title: "Finding Hampi at sunrise", creator: "Vikram S.", category: "Heritage Discovery", cover: IMG.hampi, excerpt: "The boulders lit up like embers. I understood why a whole empire chose this place.", likes: 308, comments: 41 },
  { id: "s3", title: "The Bharatanatyam adavus my mother taught me", creator: "Lakshmi P.", category: "Cultural Story", cover: IMG.bharatanatyam, excerpt: "Each foot-strike is a word. I'm finally old enough to read the sentences.", likes: 219, comments: 35 },
  { id: "s4", title: "Songs my father sang in the desert", creator: "Rajveer M.", category: "Oral History", cover: IMG.rajasthan, excerpt: "He couldn't read, but he knew a thousand years of ballads by heart.", likes: 176, comments: 19 },
];

const CATEGORIES = ["Kathas", "Cultural Stories", "Heritage Discoveries", "Family / Oral Histories"];

export default function Community() {
  const [posts, setPosts] = useState(SEED);
  const [filter, setFilter] = useState("All");
  const [composing, setComposing] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("bharatkatha_community") || "[]");
    if (user.length) setPosts([...user, ...SEED]);
    return subscribeToCommunityPosts((event) => {
      if (event.type === "create") setPosts((current) => current.some((post) => post.id === event.data.id) ? current : [event.data, ...current]);
      if (event.type === "update") setPosts((current) => current.map((post) => post.id === event.data.id ? { ...post, ...event.data } : post));
      if (event.type === "delete") setPosts((current) => current.filter((post) => post.id !== event.id));
    });
  }, []);

  const toggle = (id, field) => {
    setPosts((p) => p.map((x) => (x.id === id ? { ...x, [field]: !x[field], likes: field === "liked" ? (x.liked ? x.likes - 1 : x.likes + 1) : x.likes } : x)));
  };

  const share = async (p) => {
    try { await navigator.share?.({ title: p.title, text: p.excerpt }); } catch { navigator.clipboard?.writeText(p.title); }
  };

  const publish = async (post) => {
    const newPost = { ...post, id: "u" + Date.now(), likes: 0, comments: 0 };
    const persistedPost = await createCommunityPost(newPost);
    const user = JSON.parse(localStorage.getItem("bharatkatha_community") || "[]");
    localStorage.setItem("bharatkatha_community", JSON.stringify([persistedPost, ...user]));
    setPosts((p) => [persistedPost, ...p]);
    trackEvent("community_story_published", { category: post.category });
    addPoints(10, "community_voice");
    setComposing(false);
  };

  const visible = filter === "All" ? posts : posts.filter((p) => p.category.includes(filter.split(" ")[0]) || (filter === "Kathas" && p.category === "Kathas"));

  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-20 border-b border-border relative">
        <div className="absolute inset-0 grain opacity-40" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
              <Users className="h-4 w-4" /> Community
            </div>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">A living archive, written together</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">Share your Kathas, cultural stories, heritage discoveries and family histories.</p>
          </div>
          <button onClick={() => setComposing(true)} className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-6 py-3 text-sm font-semibold text-background">
            <Plus className="h-4 w-4" /> Share a Story
          </button>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {["All", ...CATEGORIES].map((c) => (
              <button key={c} onClick={() => setFilter(c)} className={`rounded-full px-4 py-2 text-sm transition-colors ${filter === c ? "bg-primary text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>{c}</button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((p, i) => (
              <motion.article key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.06 }} className="group rounded-2xl border border-border bg-card overflow-hidden card-hover">
                <div className="relative aspect-video overflow-hidden">
                  <Image src={p.cover} alt={p.title} className="h-full w-full transition-transform duration-700 group-hover:scale-105" fittingType="fill" />
                  <span className="absolute top-3 left-3 rounded-full glass px-3 py-1 text-[11px] text-amber-200">{p.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold leading-snug">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-bold">{p.creator[0]}</span>
                    {p.creator}
                  </div>
                  <div className="mt-4 flex items-center gap-1 border-t border-border pt-3">
                    <Action icon={Heart} active={p.liked} count={p.likes} onClick={() => toggle(p.id, "liked")} />
                    <Action icon={MessageCircle} count={p.comments} />
                    <Action icon={Bookmark} active={p.saved} onClick={() => toggle(p.id, "saved")} />
                    <Action icon={Share2} onClick={() => share(p)} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {composing && <ComposeModal onClose={() => setComposing(false)} onPublish={publish} />}
    </div>
  );
}

function Action({ icon: Icon, active, count, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs transition-colors ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
      <Icon className={`h-4 w-4 ${active ? "fill-primary" : ""}`} /> {count !== undefined && count}
    </button>
  );
}

const COVERS = [IMG.nalanda, IMG.banarasi, IMG.hampi, IMG.rajasthan, IMG.bharatanatyam, IMG.sarnath];

function ComposeModal({ onClose, onPublish }) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Cultural Story");
  const [cover, setCover] = useState(COVERS[0]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">Share a story</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-background"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your story a name" className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Your story</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={4} placeholder="Share a memory, discovery or katha..." className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Cover image</label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {COVERS.map((c) => (
                <button key={c} onClick={() => setCover(c)} className={`relative aspect-video rounded-lg overflow-hidden border-2 ${cover === c ? "border-primary" : "border-transparent"}`}>
                  <Image src={c} alt="" className="h-full w-full" fittingType="fill" />
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => onPublish({ title, excerpt, category, cover, creator: "You" })} disabled={!title.trim() || !excerpt.trim()} className="w-full rounded-full bg-gradient-to-r from-amber-400 to-orange-600 py-3 text-sm font-semibold text-background disabled:opacity-50">
            Publish to Community
          </button>
        </div>
      </motion.div>
    </div>
  );
}
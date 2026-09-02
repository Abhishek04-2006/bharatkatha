import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Award, Crown, Compass, MapPin, Sparkles, Hourglass, MessageCircle, Heart, Users, TrendingUp, BookOpen } from "lucide-react";
import { getPoints, getRank, getRankProgress, getBadges, BADGES, RANKS } from "@/lib/gamification";
import { listKathas } from "@/lib/backend";
import { useAuth } from "@/lib/AuthContext";

const BADGE_ICONS = { MapPin, Sparkles, Hourglass, MessageCircle, Heart, Users };

export default function Profile() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [kathas, setKathas] = useState([]);
  const [roots, setRoots] = useState([]);

  useEffect(() => {
    setPoints(getPoints());
    setBadges(getBadges());
    listKathas().then(setKathas).catch(() => setKathas([]));
    setRoots(JSON.parse(localStorage.getItem("bharatkatha_roots") || "[]"));
  }, []);

  const { current, next } = getRank(points);
  const progress = getRankProgress(points);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-background p-8 md:p-10">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-background">
              <Flame className="h-9 w-9" strokeWidth={2.2} />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-display text-3xl font-bold">{user?.full_name || user?.name || "Heritage Traveller"}</h1>
              <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary font-semibold">
                <RankIcon rank={current} /> {current.name}
              </div>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">{current.blurb}</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="font-display text-5xl font-bold text-gradient-gold">{points}</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Heritage Points</div>
            </div>
          </div>

          {/* Rank progress */}
          <div className="relative mt-8">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>{current.name}</span>
              <span>{next ? `${next.name} · ${progress.toNext} pts to go` : "Max rank reached"}</span>
            </div>
            <div className="h-2.5 rounded-full bg-card overflow-hidden border border-border">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress.pct}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-600" />
            </div>
          </div>
        </div>

        {/* Ranks ladder */}
        <div className="mt-8">
          <h2 className="font-display text-xl font-bold mb-4">Ranks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {RANKS.map((r) => {
              const reached = points >= r.min;
              return (
                <div key={r.name} className={`rounded-2xl border p-5 text-center transition-colors ${reached ? "border-primary/50 bg-primary/5" : "border-border bg-card opacity-60"}`}>
                  <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${reached ? "bg-gradient-to-br from-amber-400 to-orange-600 text-background" : "bg-card text-muted-foreground"}`}>
                    <RankIcon rank={r} />
                  </div>
                  <h3 className="mt-3 font-display text-sm font-bold">{r.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1">{r.min} pts</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold mb-4">Badges <span className="text-sm font-normal text-muted-foreground">({badges.length}/{BADGES.length})</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {BADGES.map((b) => {
              const earned = badges.includes(b.key);
              const Icon = BADGE_ICONS[b.icon] || Award;
              return (
                <div key={b.key} className={`rounded-2xl border p-4 text-center transition-all ${earned ? "border-primary/50 bg-primary/5" : "border-border bg-card opacity-50"}`}>
                  <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${earned ? "bg-gradient-to-br from-amber-400 to-orange-600 text-background" : "bg-card text-muted-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-2 text-xs font-bold">{b.label}</h3>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity */}
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          <ActivityCard icon={Sparkles} title="My Kathas" count={kathas.length} link="/create" cta="Create a new Katha" items={kathas.map((k) => `${k.theme} in ${k.setting}`)} />
          <ActivityCard icon={Heart} title="Preserved Stories" count={roots.length} link="/roots" cta="Preserve a story" items={roots.map((r) => r.title)} />
        </div>

        {/* How to earn */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> How to earn points</h2>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            {[
              ["Explore heritage", "+15 pts", MapPin],
              ["Enter a story", "+25 pts", Hourglass],
              ["Create a Katha", "+40 pts", Sparkles],
              ["Talk to a character", "+20 pts", MessageCircle],
              ["Preserve a family story", "+30 pts", Heart],
              ["Share to community", "+10 pts", Users],
            ].map(([label, pts, Icon]) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3">
                <Icon className="h-4 w-4 text-primary" />
                <span className="flex-1 text-muted-foreground">{label}</span>
                <span className="text-primary font-semibold text-xs">{pts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RankIcon({ rank }) {
  const map = { "Heritage Explorer": Compass, "Heritage Enthusiast": Flame, "Cultural Ambassador": Award, "Heritage Guardian": Crown };
  const I = map[rank.name] || Compass;
  return <I className="h-5 w-5" />;
}

function ActivityCard({ icon: Icon, title, count, link, cta, items }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold flex items-center gap-2"><Icon className="h-4 w-4 text-primary" /> {title}</h3>
        <span className="text-2xl font-bold text-gradient-gold">{count}</span>
      </div>
      <div className="mt-4 space-y-2 min-h-[60px]">
        {items.length ? items.slice(0, 4).map((it, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5 text-primary" /> {it}
          </div>
        )) : <p className="text-sm text-muted-foreground">Nothing here yet.</p>}
      </div>
      <Link to={link} className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">{cta} →</Link>
    </div>
  );
}
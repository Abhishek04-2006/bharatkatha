const POINTS_KEY = "bharatkatha_points";
const BADGES_KEY = "bharatkatha_badges";

export const RANKS = [
  { name: "Heritage Explorer", min: 0, blurb: "You've begun your journey into India's past." },
  { name: "Heritage Enthusiast", min: 100, blurb: "Curiosity turned into a real passion." },
  { name: "Cultural Ambassador", min: 300, blurb: "You carry India's stories forward." },
  { name: "Heritage Guardian", min: 600, blurb: "A true protector of living heritage." },
];

export const BADGES = [
  { key: "first_explore", label: "First Explorer", desc: "Explored your first heritage site", icon: "MapPin" },
  { key: "story_weaver", label: "Story Weaver", desc: "Created your first Katha", icon: "Sparkles" },
  { key: "time_traveler", label: "Time Traveler", desc: "Entered a historical story", icon: "Hourglass" },
  { key: "conversationalist", label: "Conversationalist", desc: "Talked with a historical character", icon: "MessageCircle" },
  { key: "root_keeper", label: "Root Keeper", desc: "Preserved a family story", icon: "Heart" },
  { key: "community_voice", label: "Community Voice", desc: "Shared to the community feed", icon: "Users" },
];

export const POINT_REWARDS = {
  explore: 15,
  experience: 25,
  create: 40,
  chat: 20,
  preserve: 30,
  share: 10,
};

export function getPoints() {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(POINTS_KEY) || "0", 10);
}

export function addPoints(n, badgeKey = null) {
  const p = getPoints() + n;
  localStorage.setItem(POINTS_KEY, String(p));
  if (badgeKey) awardBadge(badgeKey);
  return p;
}

export function getRank(points = getPoints()) {
  let current = RANKS[0];
  for (const r of RANKS) if (points >= r.min) current = r;
  const next = RANKS.find((r) => r.min > points) || null;
  return { current, next, points };
}

export function getRankProgress(points = getPoints()) {
  const { current, next } = getRank(points);
  if (!next) return { pct: 100, toNext: 0 };
  const span = next.min - current.min;
  const done = points - current.min;
  return { pct: Math.min(100, Math.round((done / span) * 100)), toNext: next.min - points };
}

export function getBadges() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(BADGES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function awardBadge(key) {
  const b = getBadges();
  if (!b.includes(key)) {
    b.push(key);
    localStorage.setItem(BADGES_KEY, JSON.stringify(b));
    return true;
  }
  return false;
}

export function hasBadge(key) {
  return getBadges().includes(key);
}
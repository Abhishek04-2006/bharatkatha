import { apiFetch, connectCommunityRealtime } from "@/api/backendClient";

export async function createKatha(katha) {
  return (await apiFetch("/api/kathas", { method: "POST", body: JSON.stringify(katha) }));
}

export async function listKathas() {
  return apiFetch("/api/kathas");
}

export async function createCommunityPost(post) {
  return (await apiFetch("/api/community/posts", { method: "POST", body: JSON.stringify(post) }));
}

export function subscribeToCommunityPosts(onEvent) {
  return connectCommunityRealtime(onEvent);
}

export async function saveMediaAsset(media) {
  return apiFetch("/api/media", { method: "POST", body: JSON.stringify(media) });
}

export async function uploadMediaFile(file, metadata) {
  const body = new FormData();
  body.append("file", file);
  return apiFetch("/api/media", { method: "POST", body });
}

export function trackEvent(eventName, properties = {}) {
  return apiFetch("/api/analytics/events", { method: "POST", body: JSON.stringify({ eventName, properties }) }).catch(() => {});
}

export async function listAnalyticsEvents() {
  return apiFetch("/api/admin/analytics");
}
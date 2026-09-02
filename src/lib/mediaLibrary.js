const MEDIA_KEY = "bharatkatha_media_library";

function readMedia() {
  try {
    return JSON.parse(localStorage.getItem(MEDIA_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeMedia(items) {
  localStorage.setItem(MEDIA_KEY, JSON.stringify(items));
}

export function getMedia() {
  return readMedia();
}

export function addMedia(item) {
  const media = [{ ...item, id: item.id || crypto.randomUUID(), created: new Date().toISOString() }, ...readMedia()];
  writeMedia(media);
  return media;
}

export function removeMedia(id) {
  const media = readMedia().filter((item) => item.id !== id);
  writeMedia(media);
  return media;
}
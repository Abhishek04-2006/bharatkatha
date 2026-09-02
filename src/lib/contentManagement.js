// Content Management Utilities
// Handles favorites, ratings, and bookmarks

const STORAGE_KEY = 'bharatkatha_content';

const getContentData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { favorites: [], ratings: {}, bookmarks: [] };
};

const saveContentData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Favorites Management
export const toggleFavorite = (itemId) => {
  const data = getContentData();
  const index = data.favorites.indexOf(itemId);
  if (index > -1) {
    data.favorites.splice(index, 1);
  } else {
    data.favorites.push(itemId);
  }
  saveContentData(data);
  return data.favorites;
};

export const isFavorited = (itemId) => {
  const data = getContentData();
  return data.favorites.includes(itemId);
};

export const getFavorites = () => {
  const data = getContentData();
  return data.favorites;
};

// Ratings Management
export const addRating = (itemId, rating, review = '') => {
  const data = getContentData();
  data.ratings[itemId] = {
    rating: Math.max(1, Math.min(5, rating)), // Clamp between 1-5
    review,
    timestamp: new Date().toISOString(),
  };
  saveContentData(data);
  return data.ratings[itemId];
};

export const getRating = (itemId) => {
  const data = getContentData();
  return data.ratings[itemId] || null;
};

export const getAverageRating = (itemIds) => {
  const data = getContentData();
  const ratings = itemIds
    .map(id => data.ratings[id]?.rating)
    .filter(r => r !== undefined);
  
  if (ratings.length === 0) return 0;
  return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
};

// Bookmarks Management
export const toggleBookmark = (itemId, title) => {
  const data = getContentData();
  const index = data.bookmarks.findIndex(b => b.id === itemId);
  if (index > -1) {
    data.bookmarks.splice(index, 1);
  } else {
    data.bookmarks.push({
      id: itemId,
      title,
      timestamp: new Date().toISOString(),
    });
  }
  saveContentData(data);
  return data.bookmarks;
};

export const isBookmarked = (itemId) => {
  const data = getContentData();
  return data.bookmarks.some(b => b.id === itemId);
};

export const getBookmarks = () => {
  const data = getContentData();
  return data.bookmarks;
};

// Search and Filter
export const searchContent = (items, query) => {
  if (!query.trim()) return items;
  
  const q = query.toLowerCase();
  return items.filter(item =>
    item.name?.toLowerCase().includes(q) ||
    item.title?.toLowerCase().includes(q) ||
    item.description?.toLowerCase().includes(q) ||
    item.state?.toLowerCase().includes(q) ||
    item.period?.toLowerCase().includes(q)
  );
};

export const filterContent = (items, filters) => {
  return items.filter(item => {
    if (filters.state && item.state !== filters.state) return false;
    if (filters.era && item.era !== filters.era) return false;
    if (filters.category && item.category !== filters.category) return false;
    if (filters.difficulty && item.difficulty !== filters.difficulty) return false;
    if (filters.onlyFavorites && !isFavorited(item.id)) return false;
    return true;
  });
};

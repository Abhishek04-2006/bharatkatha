import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFavorites, getBookmarks } from '@/lib/contentManagement';
import HeritageCard from '@/components/HeritageCard';
import { HERITAGE } from '@/data/heritage';

export default function Favorites() {
  const [activeTab, setActiveTab] = useState('favorites');
  const [favoritedItems, setFavoritedItems] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);

  useEffect(() => {
    // Get favorited items
    const favoriteIds = getFavorites();
    const favorited = HERITAGE.filter(h => favoriteIds.includes(h.id));
    setFavoritedItems(favorited);

    // Get bookmarked items
    const bookmarks = getBookmarks();
    setBookmarkedItems(bookmarks);
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Heart className="h-6 w-6 text-primary fill-primary" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold">Your Favorites</h1>
              <p className="text-muted-foreground mt-1">Heritage sites you've saved</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'favorites'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <Heart className="inline-block h-4 w-4 mr-2" />
            Favorites {favoritedItems.length > 0 && `(${favoritedItems.length})`}
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'bookmarks'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <BookOpen className="inline-block h-4 w-4 mr-2" />
            Bookmarks {bookmarkedItems.length > 0 && `(${bookmarkedItems.length})`}
          </button>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'favorites' && (
            <>
              {favoritedItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {favoritedItems.map((item) => (
                    <HeritageCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start exploring and add heritage sites to your favorites!
                  </p>
                  <Link
                    to="/explore"
                    className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                  >
                    Explore Heritage
                  </Link>
                </div>
              )}
            </>
          )}

          {activeTab === 'bookmarks' && (
            <>
              {bookmarkedItems.length > 0 ? (
                <div className="space-y-3">
                  {bookmarkedItems.map((bookmark) => (
                    <motion.div
                      key={bookmark.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-foreground">{bookmark.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Bookmarked on{' '}
                          {new Date(bookmark.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        to={`/explore?heritage=${bookmark.id}`}
                        className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                      >
                        View
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No bookmarks yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Bookmark stories and heritage items to read later.
                  </p>
                  <Link
                    to="/explore"
                    className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                  >
                    Explore Heritage
                  </Link>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

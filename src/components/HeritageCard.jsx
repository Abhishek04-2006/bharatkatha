import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowRight, Heart, Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import { toggleFavorite, isFavorited, getRating } from "@/lib/contentManagement";

export default function HeritageCard({ item, to }) {
  const [favorited, setFavorited] = useState(false);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    setFavorited(isFavorited(item.id));
    const itemRating = getRating(item.id);
    setRating(itemRating);
  }, [item.id]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item.id);
    setFavorited(!favorited);
  };

  return (
    <Link
      to={to || `/explore?heritage=${item.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-card card-hover"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          className="h-full w-full transition-transform duration-700 group-hover:scale-110"
          fittingType="fill"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 rounded-full glass px-3 py-1 text-[11px] font-medium text-amber-200 border-amber-500/20">
          {item.category}
        </span>

        {/* Favorites Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full glass hover:bg-primary/20 transition-colors z-10"
          title={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-4 w-4 ${
              favorited
                ? "fill-primary text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          />
        </button>

        {/* Rating Badge */}
        {rating && (
          <div className="absolute top-14 right-3 flex items-center gap-1 rounded-full glass px-2 py-1 bg-primary/10">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs font-semibold text-primary">
              {rating.rating}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 inset-x-0 p-4">
          <h3 className="font-display text-xl font-semibold text-foreground leading-tight">
            {item.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 text-primary" /> {item.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 text-primary" /> {item.period}
            </span>
          </div>
        </div>

        {/* Hover Arrow */}
        <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full glass text-primary opacity-0 -translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
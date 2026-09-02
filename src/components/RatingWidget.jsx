import React, { useState, useEffect } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { getRating, addRating } from '@/lib/contentManagement';

export function StarRating({ rating = 0, interactive = false, onRate = null, size = 'md' }) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`transition-colors ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          disabled={!interactive}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= (hoverRating || rating)
                ? 'fill-primary text-primary'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function RatingWidget({ itemId, onRatingSubmitted = null }) {
  const [rating, setRating] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [review, setReview] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const existingRating = getRating(itemId);
    setRating(existingRating);
    if (existingRating) {
      setUserRating(existingRating.rating);
      setReview(existingRating.review);
    }
  }, [itemId]);

  const handleRateClick = (stars) => {
    setUserRating(stars);
    setShowReview(true);
  };

  const handleSubmit = () => {
    if (userRating) {
      addRating(itemId, userRating, review);
      setRating({ rating: userRating, review });
      setSubmitted(true);
      
      if (onRatingSubmitted) {
        onRatingSubmitted({ rating: userRating, review });
      }

      setTimeout(() => {
        setSubmitted(false);
        setShowReview(false);
      }, 2000);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Rate this</span>
          <StarRating
            rating={userRating || (rating?.rating || 0)}
            interactive={true}
            onRate={handleRateClick}
          />
        </div>
        {rating && (
          <span className="text-xs text-muted-foreground">
            Rated {rating.rating} / 5
          </span>
        )}
      </div>

      {showReview && (
        <div className="space-y-2">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your thoughts... (optional)"
            rows="3"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {submitted ? '✓ Submitted' : 'Submit Rating'}
            </button>
            <button
              onClick={() => setShowReview(false)}
              className="px-3 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-card transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {rating?.review && (
        <div className="p-3 rounded-lg bg-card border border-border">
          <div className="flex items-start gap-2">
            <MessageCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{rating.review}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(rating.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

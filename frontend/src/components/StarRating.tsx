import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingDisplayProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

interface StarRatingSelectorProps {
  value: number;
  onChange: (rating: number) => void;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 14,
  md: 18,
  lg: 24,
};

export function StarRatingDisplay({ rating, maxStars = 5, size = 'md', showValue = false }: StarRatingDisplayProps) {
  const starSize = sizeMap[size];
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            size={starSize}
            className={filled ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30 fill-muted-foreground/10'}
          />
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
      )}
    </div>
  );
}

export function StarRatingSelector({ value, onChange, maxStars = 5, size = 'md' }: StarRatingSelectorProps) {
  const [hovered, setHovered] = useState<number>(0);
  const starSize = sizeMap[size];

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const active = starValue <= (hovered || value);
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none transition-transform hover:scale-110"
            aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            <Star
              size={starSize}
              className={active ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30 fill-muted-foreground/10'}
            />
          </button>
        );
      })}
    </div>
  );
}

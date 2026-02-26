import React from 'react';
import { StarRatingDisplay } from './StarRating';
import { useProductReviews } from '../hooks/useProductReviews';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare } from 'lucide-react';

interface ReviewsListProps {
  productId: number;
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ReviewsList({ productId }: ReviewsListProps) {
  const { data, isLoading, isError } = useProductReviews(productId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="border border-border rounded-xl p-5 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive py-4">Failed to load reviews.</p>
    );
  }

  const reviews = data?.reviews ?? [];
  const avgRating = data?.averageRating !== undefined && data?.averageRating !== null
    ? Number(data.averageRating)
    : null;
  const reviewCount = Number(data?.reviewCount ?? 0);

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <MessageSquare size={40} className="mb-3 opacity-30" />
        <p className="font-medium">No reviews yet</p>
        <p className="text-sm mt-1">Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {avgRating !== null && (
        <div className="flex items-center gap-3 p-4 bg-muted/40 rounded-xl mb-2">
          <span className="text-4xl font-bold text-foreground">{avgRating.toFixed(1)}</span>
          <div>
            <StarRatingDisplay rating={avgRating} size="md" />
            <p className="text-sm text-muted-foreground mt-0.5">
              Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {reviews.map(review => (
        <div key={Number(review.id)} className="border border-border rounded-xl p-5 space-y-2">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="font-semibold text-foreground">{review.author}</p>
              <StarRatingDisplay rating={Number(review.rating)} size="sm" />
            </div>
            <span className="text-xs text-muted-foreground">{formatDate(review.timestamp)}</span>
          </div>
          {review.title && (
            <p className="font-medium text-foreground text-sm">{review.title}</p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed">{review.body}</p>
        </div>
      ))}
    </div>
  );
}

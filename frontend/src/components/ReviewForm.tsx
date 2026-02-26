import React, { useState } from 'react';
import { StarRatingSelector } from './StarRating';
import { useSubmitReview } from '../hooks/useSubmitReview';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ReviewFormProps {
  productId: number;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [validationError, setValidationError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending, isError, error } = useSubmitReview(productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (rating === 0) {
      setValidationError('Please select a star rating.');
      return;
    }
    if (!author.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!body.trim()) {
      setValidationError('Please write your review.');
      return;
    }

    mutate(
      {
        rating: BigInt(rating),
        author: author.trim(),
        title: title.trim(),
        body: body.trim(),
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setRating(0);
          setAuthor('');
          setTitle('');
          setBody('');
          setValidationError('');
        },
      }
    );
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
        <h3 className="font-semibold text-green-800 text-lg mb-1">Review Submitted!</h3>
        <p className="text-green-700 text-sm mb-4">
          Thank you for sharing your experience.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm text-green-700 underline hover:text-green-800 transition-colors"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-stone-800">Write a Review</h3>

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <StarRatingSelector value={rating} onChange={setRating} size="lg" />
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Review Title
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Summarise your experience (optional)"
          className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Share your experience with this product…"
          rows={4}
          className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
        />
      </div>

      {/* Validation error */}
      {validationError && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {validationError}
        </div>
      )}

      {/* Mutation error */}
      {isError && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error instanceof Error ? error.message : 'Failed to submit review. Please try again.'}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto px-8 py-3 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
}

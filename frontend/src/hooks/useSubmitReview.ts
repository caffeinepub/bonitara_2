import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ReviewInput } from '../backend';

export function useSubmitReview(productId: number) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewInput: ReviewInput) => {
      if (!actor) throw new Error('Actor not available');
      await actor.submitReview(BigInt(productId), reviewInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['allProductRatings'] });
    },
  });
}

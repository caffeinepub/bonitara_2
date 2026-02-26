import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ProductReviews } from '../backend';

export function useProductReviews(productId: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProductReviews>({
    queryKey: ['productReviews', productId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getReviews(BigInt(productId));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAllProductRatings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Map<number, number>>({
    queryKey: ['allProductRatings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const entries = await actor.getAllProductAverageRatings();
      const map = new Map<number, number>();
      for (const [productId, rating] of entries) {
        if (rating !== null && rating !== undefined) {
          map.set(Number(productId), Number(rating));
        }
      }
      return map;
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
  });
}

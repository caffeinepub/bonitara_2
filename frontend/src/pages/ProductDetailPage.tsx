import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Product } from '../backend';
import { useCart, useWishlist } from '../App';
import ReviewsList from '../components/ReviewsList';
import ReviewForm from '../components/ReviewForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, ArrowLeft, Package, Star } from 'lucide-react';
import { useProductReviews } from '../hooks/useProductReviews';

interface ProductDetailPageProps {
  productId: string;
}

// Maps backend category strings (both new camelCase and legacy snake_case) to URL slugs
const categoryToSlug = (category: string): string => {
  const map: Record<string, string> = {
    candleMaking: 'candle-making',
    soapMaking: 'soap-making',
    fragrance: 'fragrance',
    resinArt: 'resin-art',
    candle_making: 'candle-making',
    soap_making: 'soap-making',
    resin_art: 'resin-art',
    fragrances: 'fragrance',
  };
  return map[category] ?? 'candle-making';
};

const categoryToDisplayName = (category: string): string => {
  const map: Record<string, string> = {
    candleMaking: 'Candle Making',
    soapMaking: 'Soap Making',
    fragrance: 'Fragrance',
    resinArt: 'Resin Art',
    candle_making: 'Candle Making',
    soap_making: 'Soap Making',
    resin_art: 'Resin Art',
    fragrances: 'Fragrance',
  };
  return map[category] ?? category;
};

const resolveImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '/assets/generated/candle-soy-jar.dim_600x600.png';
  if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return imageUrl;
  return `/assets/generated/${imageUrl}`;
};

export default function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const { actor, isFetching: actorFetching } = useActor();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const numericProductId = parseInt(productId, 10);

  const { data: product, isLoading } = useQuery<Product | null>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProductById(BigInt(numericProductId));
    },
    enabled: !!actor && !actorFetching && !isNaN(numericProductId),
  });

  // useProductReviews expects a number
  const { data: reviewData } = useProductReviews(numericProductId);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
        <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">This product may have been removed or is no longer available.</p>
        <Button asChild variant="outline">
          <a href="#/">Back to Home</a>
        </Button>
      </div>
    );
  }

  const slug = categoryToSlug(product.category);
  const displayName = categoryToDisplayName(product.category);
  const imageUrl = resolveImageUrl(product.imageUrl);
  const priceDisplay = (Number(product.price) / 100).toFixed(2);
  const inStock = Number(product.stock) > 0;
  const wishlisted = isWishlisted(product.id);
  const avgRating = reviewData?.averageRating !== undefined && reviewData?.averageRating !== null
    ? Number(reviewData.averageRating)
    : null;
  const reviewCount = reviewData ? Number(reviewData.reviewCount) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
          <a href="#/" className="hover:text-primary transition-colors">Home</a>
          <span>/</span>
          <a href={`#/category/${slug}`} className="hover:text-primary transition-colors">{displayName}</a>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </nav>

        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Main content */}
        <div className="grid sm:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).src = '/assets/generated/candle-soy-jar.dim_600x600.png';
                }}
              />
            </div>
            {!inStock && (
              <div className="absolute top-4 left-4">
                <Badge variant="secondary">Out of Stock</Badge>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <Badge variant="outline" className="w-fit mb-3">{displayName}</Badge>
            <h1 className="text-3xl font-serif font-bold mb-3">{product.name}</h1>

            {/* Rating */}
            {avgRating !== null && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i <= Math.round(avgRating) ? '#f59e0b' : 'none'}
                      stroke={i <= Math.round(avgRating) ? '#f59e0b' : 'currentColor'}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {avgRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            <p className="text-3xl font-bold text-primary mb-4">₹{priceDisplay}</p>

            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            {/* Stock */}
            <p className={`text-sm font-medium mb-6 ${inStock ? 'text-green-600' : 'text-destructive'}`}>
              {inStock ? `✓ In Stock (${product.stock.toString()} units)` : '✗ Out of Stock'}
            </p>

            {/* Quantity */}
            {inStock && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-muted transition-colors text-lg leading-none"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(Number(product.stock), q + 1))}
                    className="px-3 py-2 hover:bg-muted transition-colors text-lg leading-none"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 gap-2"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {addedToCart ? 'Added!' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => toggleWishlist(product)}
                className={wishlisted ? 'text-primary border-primary' : ''}
              >
                <Heart className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} />
              </Button>
            </div>

            {/* SKU */}
            <p className="text-xs text-muted-foreground mt-4">SKU: {product.sku}</p>
          </div>
        </div>

        {/* Reviews */}
        <div className="border-t border-border pt-12">
          <h2 className="text-2xl font-serif font-bold mb-8">Customer Reviews</h2>
          <div className="grid sm:grid-cols-2 gap-12">
            {/* ReviewsList and ReviewForm expect number productId */}
            <ReviewsList productId={numericProductId} />
            <ReviewForm productId={numericProductId} />
          </div>
        </div>
      </div>
    </div>
  );
}

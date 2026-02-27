import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../backend';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
  averageRating?: number | null;
  reviewCount?: number;
}

// Maps backend category strings (both new camelCase and legacy snake_case) to URL slugs
const categoryToSlug = (category: string): string => {
  const map: Record<string, string> = {
    // new camelCase values from adminAddProduct
    candleMaking: 'candle-making',
    soapMaking: 'soap-making',
    fragrance: 'fragrance',
    resinArt: 'resin-art',
    // legacy snake_case values from migration seed data
    candle_making: 'candle-making',
    soap_making: 'soap-making',
    resin_art: 'resin-art',
    fragrances: 'fragrance',
  };
  return map[category] ?? 'candle-making';
};

// Resolves image URL — prefixes /assets/generated/ for relative paths
const resolveImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '/assets/generated/candle-soy-jar.dim_600x600.png';
  if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return imageUrl;
  return `/assets/generated/${imageUrl}`;
};

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  averageRating,
  reviewCount,
}: ProductCardProps) {
  const slug = categoryToSlug(product.category);
  const imageUrl = resolveImageUrl(product.imageUrl);
  const priceDisplay = (Number(product.price) / 100).toFixed(2);

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Image */}
      <a href={`#/category/${slug}/product/${product.id}`} className="block relative overflow-hidden aspect-square bg-muted">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => {
            (e.target as HTMLImageElement).src = '/assets/generated/candle-soy-jar.dim_600x600.png';
          }}
        />
        {/* Wishlist button */}
        {onToggleWishlist && (
          <button
            onClick={e => { e.preventDefault(); onToggleWishlist(product); }}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors ${
              isWishlisted
                ? 'bg-primary text-primary-foreground'
                : 'bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        )}
        {/* Out of stock badge */}
        {Number(product.stock) === 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 text-center py-1 text-xs font-medium text-muted-foreground">
            Out of Stock
          </div>
        )}
      </a>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <a href={`#/category/${slug}/product/${product.id}`} className="block">
          <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </a>

        {/* Rating */}
        {averageRating != null && (
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                className="w-3 h-3"
                fill={i <= Math.round(averageRating) ? '#f59e0b' : 'none'}
                stroke={i <= Math.round(averageRating) ? '#f59e0b' : 'currentColor'}
              />
            ))}
            {reviewCount != null && reviewCount > 0 && (
              <span className="text-xs text-muted-foreground ml-1">({reviewCount})</span>
            )}
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">{product.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-primary">₹{priceDisplay}</span>
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              disabled={Number(product.stock) === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

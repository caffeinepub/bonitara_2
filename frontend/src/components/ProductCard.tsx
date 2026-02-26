import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart, useWishlist } from '../App';
import { StarRatingDisplay } from './StarRating';
import { useAllProductRatings } from '../hooks/useProductReviews';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

// Map string product id to a stable numeric id for the backend review system
function getNumericProductId(id: string): number {
  const prefixMap: Record<string, number> = {
    'sm': 0,
    'cm': 1000,
    'ra': 2000,
    'fr': 3000,
  };
  const parts = id.split('-');
  const prefix = parts[0];
  const num = parseInt(parts[parts.length - 1]) || 0;
  return (prefixMap[prefix] ?? 9000) + num;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { data: ratingsMap } = useAllProductRatings();

  const numericId = getNumericProductId(product.id);
  const dynamicRating = ratingsMap?.get(numericId) ?? 4.5;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <a
      href={`#/product/${product.id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="group block bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isBestSeller && (
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="bg-charcoal text-ivory text-xs font-semibold px-2 py-1 rounded-full">
              New
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all duration-200 ${
            wishlisted
              ? 'bg-red-500 text-white'
              : 'bg-background/90 backdrop-blur-sm text-muted-foreground hover:text-red-500'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={15} className={wishlisted ? 'fill-current' : ''} />
        </button>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-primary-foreground py-3 flex items-center justify-center gap-2 font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <p className="text-xs text-primary font-medium uppercase tracking-wider">
          {product.category.replace(/-/g, ' ')}
        </p>
        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <StarRatingDisplay rating={dynamicRating} size="sm" />
          <span className="text-xs text-muted-foreground">({dynamicRating.toFixed(1)})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="text-xs text-muted-foreground">
            Wholesale: ₹{product.wholesalePrice.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </a>
  );
}

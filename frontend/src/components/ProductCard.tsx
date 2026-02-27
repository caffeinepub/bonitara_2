import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart, useWishlist } from '../App';
import { StarRatingDisplay } from './StarRating';
import { useAllProductRatings } from '../hooks/useProductReviews';
import { Product } from '../backend';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { data: ratingsMap } = useAllProductRatings();

  const numericId = Number(product.id);
  const dynamicRating = ratingsMap?.get(numericId) ?? 4.5;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <a
      href={`#/product/${product.id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="group block bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ShoppingCart className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}

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
            disabled={Number(product.stock) === 0}
            className="w-full bg-primary text-primary-foreground py-3 flex items-center justify-center gap-2 font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <ShoppingCart size={16} />
            {Number(product.stock) === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <p className="text-xs text-primary font-medium uppercase tracking-wider">
          {product.category}
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
          <span className="font-bold text-foreground">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            Number(product.stock) > 0
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {Number(product.stock) > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </a>
  );
}

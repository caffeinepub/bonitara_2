import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../data/products';
import { useCart, useWishlist } from '../App';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <a href={`#/product/${product.id}`} className="group block">
      <div className="bg-card border border-border rounded-sm overflow-hidden hover-lift luxury-shadow">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3] bg-beige">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.isBestSeller && (
            <span className="absolute top-2 left-2 bg-gold text-white text-xs px-2 py-0.5 font-sans font-medium tracking-wide">
              BESTSELLER
            </span>
          )}
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-charcoal text-ivory text-xs px-2 py-0.5 font-sans font-medium tracking-wide">
              NEW
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center">
              <span className="text-ivory font-sans text-sm font-medium">Out of Stock</span>
            </div>
          )}
          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
          >
            <Heart size={14} className={wishlisted ? 'fill-gold text-gold' : 'text-charcoal'} />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-1">
            {product.category.replace('-', ' ')}
          </p>
          <h3 className="font-serif text-base text-charcoal leading-snug mb-1 line-clamp-2 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground font-sans mb-3 line-clamp-2">
            {product.shortDescription}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-sans font-semibold text-charcoal text-base">₹{product.price}</span>
              <span className="text-xs text-muted-foreground font-sans ml-1">/ unit</span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-charcoal text-ivory text-xs font-sans font-medium hover:bg-gold transition-colors duration-200 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={12} />
              Add
            </button>
          </div>
        </div>
      </div>
    </a>
  );
}

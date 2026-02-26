import React, { useState, useEffect } from 'react';
import { ChevronRight, Minus, Plus, ShoppingCart, Heart, Shield, Truck, RotateCcw, Leaf } from 'lucide-react';
import { products, Product } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useCart, useWishlist } from '../App';
import { toast } from 'sonner';
import { StarRatingDisplay } from '../components/StarRating';
import ReviewsList from '../components/ReviewsList';
import ReviewForm from '../components/ReviewForm';
import { useProductReviews } from '../hooks/useProductReviews';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Props {
  productId: string;
}

const categoryLabels: Record<Product['category'], string> = {
  'soap-making': 'Soap Making',
  'candle-making': 'Candle Making',
  'resin-art': 'Resin Art',
  'fragrance': 'Fragrance',
};

// Map string product id to a stable numeric id for the backend review system
function getNumericProductId(id: string): number {
  // Extract digits from the id (e.g. "sm-001" -> 1, "cm-001" -> 1001, etc.)
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

export default function ProductDetailPage({ productId }: Props) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const product = products.find(p => p.id === productId) || products[0];
  const wishlisted = isWishlisted(product.id);
  const numericId = getNumericProductId(product.id);

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch live reviews for this product
  const { data: reviewData } = useProductReviews(numericId);
  const avgRating =
    reviewData?.averageRating !== undefined && reviewData?.averageRating !== null
      ? Number(reviewData.averageRating)
      : 4.5;
  const reviewCount =
    reviewData?.reviewCount !== undefined ? Number(reviewData.reviewCount) : 0;

  // Reset state and scroll to top when product changes
  useEffect(() => {
    setQuantity(1);
    setAddedToCart(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const inStock = product.stock > 0;
  const categoryLabel = categoryLabels[product.category] || product.category;

  return (
    <div className="min-h-screen bg-ivory overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-charcoal/50 overflow-x-auto whitespace-nowrap">
            <a href="#/" className="hover:text-charcoal transition-colors duration-200 shrink-0">Home</a>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <a
              href={`#/category/${product.category}`}
              className="hover:text-charcoal transition-colors duration-200 shrink-0"
            >
              {categoryLabel}
            </a>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-charcoal truncate max-w-[160px] sm:max-w-none">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-12 sm:mb-16 items-start">

          {/* Image Column */}
          <div className="w-full">
            <div className="relative overflow-hidden rounded-2xl bg-white border border-gold/20 aspect-square max-w-lg mx-auto lg:max-w-none">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500 ease-in-out"
              />
              {product.isBestSeller && (
                <span className="absolute top-4 left-4 bg-gold text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full font-sans">
                  Best Seller
                </span>
              )}
              {product.isNew && (
                <span className="absolute top-4 right-4 bg-charcoal text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full font-sans">
                  New
                </span>
              )}
            </div>
          </div>

          {/* Product Info Column */}
          <div className="w-full flex flex-col gap-4 sm:gap-5">
            {/* Category label */}
            <p className="text-xs sm:text-sm text-gold font-medium uppercase tracking-widest font-sans">
              {categoryLabel}
            </p>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-charcoal leading-tight break-words">
              {product.name}
            </h1>

            {/* Rating — live from reviews */}
            <div className="flex items-center gap-2 flex-wrap">
              <StarRatingDisplay rating={avgRating} size="md" />
              <span className="text-sm text-charcoal/50 font-sans">
                {avgRating.toFixed(1)}
                {reviewCount > 0 ? ` (${reviewCount} review${reviewCount !== 1 ? 's' : ''})` : ' (no reviews yet)'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-charcoal font-sans">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-charcoal/50 font-sans">
                Wholesale: ₹{product.wholesalePrice.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Short Description */}
            <p className="text-sm sm:text-base text-charcoal/70 font-sans leading-relaxed">
              {product.shortDescription}
            </p>

            {/* SKU & Stock */}
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-sans">
              <div className="text-charcoal/60">
                <span className="font-semibold text-charcoal">SKU:</span> {product.sku}
              </div>
              <div className={`font-semibold ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                {inStock ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Quantity Selector */}
              <div className="flex items-center border border-charcoal/20 rounded-full overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-beige transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-sans text-charcoal font-semibold select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-beige transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-6 rounded-full font-sans font-semibold text-sm uppercase tracking-widest transition-all duration-300 ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : !inStock
                    ? 'bg-charcoal/20 text-charcoal/40 cursor-not-allowed'
                    : 'bg-charcoal text-ivory hover:bg-gold'
                }`}
              >
                <ShoppingCart className="w-4 h-4 shrink-0" />
                {addedToCart ? 'Added!' : 'Add to Cart'}
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={handleWishlist}
                className={`w-12 h-12 shrink-0 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  wishlisted
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-charcoal/20 text-charcoal/60 hover:border-red-400 hover:text-red-500'
                }`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-charcoal/10">
              {[
                { icon: Shield, label: 'Cosmetic Grade' },
                { icon: Truck, label: 'Fast Shipping' },
                { icon: RotateCcw, label: 'Easy Returns' },
                { icon: Leaf, label: 'Natural' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center">
                  <Icon className="w-5 h-5 text-gold" />
                  <span className="text-[10px] font-sans text-charcoal/60 uppercase tracking-wider leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-beige text-charcoal/70 text-xs font-sans px-3 py-1 rounded-full border border-charcoal/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12 sm:mb-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b border-charcoal/10 rounded-none bg-transparent h-auto p-0 gap-0 mb-6 sm:mb-8">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:text-gold data-[state=active]:bg-transparent px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-widest font-sans text-charcoal/50 hover:text-charcoal -mb-px"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="usage"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:text-gold data-[state=active]:bg-transparent px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-widest font-sans text-charcoal/50 hover:text-charcoal -mb-px"
              >
                Usage
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:text-gold data-[state=active]:bg-transparent px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-widest font-sans text-charcoal/50 hover:text-charcoal -mb-px"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:text-gold data-[state=active]:bg-transparent px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-widest font-sans text-charcoal/50 hover:text-charcoal -mb-px"
              >
                Features
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:text-gold data-[state=active]:bg-transparent px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-widest font-sans text-charcoal/50 hover:text-charcoal -mb-px"
              >
                Reviews {reviewCount > 0 ? `(${reviewCount})` : ''}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <div className="w-full max-w-3xl font-sans text-charcoal/80 leading-relaxed text-sm sm:text-base">
                <p className="break-words">{product.description}</p>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="mt-0">
              <div className="w-full max-w-3xl font-sans text-charcoal/80 leading-relaxed text-sm sm:text-base">
                <p className="break-words">{product.usage}</p>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="mt-0">
              <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 font-sans text-sm sm:text-base">
                {Object.entries(product.specifications).map(([key, value]) =>
                  value ? (
                    <div key={key} className="flex gap-3 py-3 border-b border-charcoal/10">
                      <span className="font-semibold text-charcoal capitalize w-28 shrink-0 text-sm">{key}:</span>
                      <span className="text-charcoal/70 text-sm break-words min-w-0">{value}</span>
                    </div>
                  ) : null
                )}
                <div className="flex gap-3 py-3 border-b border-charcoal/10">
                  <span className="font-semibold text-charcoal capitalize w-28 shrink-0 text-sm">SKU:</span>
                  <span className="text-charcoal/70 text-sm">{product.sku}</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="mt-0">
              <div className="w-full max-w-3xl font-sans text-charcoal/80 leading-relaxed text-sm sm:text-base">
                <ul className="space-y-2.5">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-gold mt-0.5 shrink-0">✓</span>
                      <span className="break-words">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0 space-y-8">
              <ReviewsList productId={numericId} />
              <ReviewForm productId={numericId} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-charcoal/10 pt-12 sm:pt-16">
            <div className="text-center mb-8 sm:mb-10">
              <p className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-3">You May Also Like</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal">Related Products</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

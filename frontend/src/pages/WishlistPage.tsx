import React from 'react';
import { useWishlist, useCart } from '../App';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-primary/5 border-b border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-7 h-7 text-primary fill-primary" />
            <h1 className="font-display text-3xl md:text-4xl text-foreground">My Wishlist</h1>
          </div>
          <p className="text-muted-foreground font-body ml-10">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-primary/40" />
            </div>
            <h2 className="font-display text-2xl text-foreground mb-3">Your wishlist is empty</h2>
            <p className="text-muted-foreground font-body max-w-md mb-8">
              Save your favourite products here so you can find them easily later.
            </p>
            <a
              href="#/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-sm font-body font-medium hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </a>
          </div>
        ) : (
          <>
            {/* Back link */}
            <div className="mb-6">
              <a
                href="#/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </a>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map(product => (
                <div
                  key={product.id.toString()}
                  className="group bg-card border border-border rounded-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                    {/* Remove from wishlist */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-background/90 rounded-full flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-display text-base text-foreground mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg text-primary font-semibold">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </span>
                      <span className={`text-xs font-body px-2 py-0.5 rounded-full ${
                        Number(product.stock) > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {Number(product.stock) > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        disabled={Number(product.stock) === 0}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 px-3 rounded-sm text-sm font-body font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <a
                        href={`#/product/${product.id}`}
                        className="px-3 py-2 border border-border rounded-sm text-sm font-body text-foreground hover:bg-muted transition-colors"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

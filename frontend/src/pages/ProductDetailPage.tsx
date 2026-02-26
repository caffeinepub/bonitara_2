import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, ChevronRight, Package, Award, Truck } from 'lucide-react';
import { products } from '../data/products';
import { useCart, useWishlist } from '../App';
import ProductCard from '../components/ProductCard';
import { toast } from 'sonner';

interface Props { productId: string; }

export default function ProductDetailPage({ productId }: Props) {
  const product = products.find(p => p.id === productId);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'usage' | 'specs'>('description');

  if (!product) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="font-serif text-3xl text-charcoal">Product not found</h2>
      <a href="#/" className="text-gold font-sans text-sm mt-4 inline-block">← Back to Home</a>
    </div>
  );

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart`);
  };

  const catName = product.category.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-xs font-sans text-muted-foreground">
          <a href="#/" className="hover:text-gold transition-colors">Home</a>
          <ChevronRight size={12} />
          <a href={`#/category/${product.category}`} className="hover:text-gold transition-colors">{catName}</a>
          <ChevronRight size={12} />
          <span className="text-charcoal line-clamp-1">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-sm bg-beige luxury-shadow">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square overflow-hidden rounded-sm bg-beige border-2 border-gold cursor-pointer">
                  <img src={product.image} alt={`${product.name} ${i}`} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="font-sans text-gold tracking-[0.2em] text-xs uppercase mb-2">{catName}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-gold text-gold" />)}
              </div>
              <span className="font-sans text-xs text-muted-foreground">(48 reviews)</span>
            </div>
            <p className="font-sans text-sm text-charcoal-light leading-relaxed mb-6">{product.shortDescription}</p>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-serif text-3xl text-charcoal">₹{product.price}</span>
              <span className="font-sans text-sm text-muted-foreground line-through">₹{Math.round(product.price * 1.2)}</span>
            </div>
            <p className="font-sans text-xs text-gold mb-6">Wholesale: ₹{product.wholesalePrice} (min. 10 units)</p>

            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-sans font-medium rounded-sm ${product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <Package size={12} />
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>
            <p className="font-sans text-xs text-muted-foreground mb-6">SKU: {product.sku}</p>

            {/* Qty + Cart */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-border">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-beige transition-colors font-sans text-lg">−</button>
                <span className="w-12 text-center font-sans text-sm">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-beige transition-colors font-sans text-lg">+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-charcoal text-ivory font-sans text-sm tracking-widest hover:bg-gold transition-colors duration-200 disabled:opacity-40"
              >
                <ShoppingCart size={16} /> ADD TO CART
              </button>
              <button
                onClick={() => { toggleWishlist(product.id); toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist'); }}
                className="w-12 h-12 border border-border flex items-center justify-center hover:border-gold transition-colors"
              >
                <Heart size={18} className={wishlisted ? 'fill-gold text-gold' : 'text-charcoal'} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-border mt-4">
              {[
                { icon: Award, label: 'Cosmetic Grade' },
                { icon: Truck, label: 'Fast Shipping' },
                { icon: Package, label: 'Secure Packaging' },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center gap-1 text-center">
                  <b.icon size={18} className="text-gold" />
                  <span className="font-sans text-xs text-muted-foreground">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex border-b border-border mb-6">
            {(['description', 'usage', 'specs'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-sans text-sm capitalize tracking-wide transition-colors ${activeTab === tab ? 'border-b-2 border-gold text-gold' : 'text-muted-foreground hover:text-charcoal'}`}
              >
                {tab === 'specs' ? 'Specifications' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="max-w-2xl">
            {activeTab === 'description' && (
              <div>
                <p className="font-sans text-sm text-charcoal-light leading-relaxed mb-6">{product.description}</p>
                <h4 className="font-serif text-lg text-charcoal mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 font-sans text-sm text-charcoal-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'usage' && (
              <div>
                <h4 className="font-serif text-lg text-charcoal mb-3">Usage Instructions</h4>
                <p className="font-sans text-sm text-charcoal-light leading-relaxed">{product.usage}</p>
              </div>
            )}
            {activeTab === 'specs' && (
              <div>
                <h4 className="font-serif text-lg text-charcoal mb-4">Specifications</h4>
                <table className="w-full text-sm font-sans">
                  <tbody>
                    {Object.entries(product.specifications).filter(([, v]) => v).map(([k, v]) => (
                      <tr key={k} className="border-b border-border">
                        <td className="py-2.5 pr-4 text-muted-foreground capitalize w-32">{k}</td>
                        <td className="py-2.5 text-charcoal font-medium">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl text-charcoal">Related Products</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

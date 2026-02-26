import React from 'react';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../App';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) return (
    <div className="container mx-auto px-4 py-24 text-center">
      <ShoppingBag size={48} className="text-muted-foreground mx-auto mb-4" />
      <h2 className="font-serif text-3xl text-charcoal mb-2">Your cart is empty</h2>
      <p className="font-sans text-sm text-muted-foreground mb-8">Discover our premium collection and add items to your cart.</p>
      <a href="#/category/soap-making" className="inline-flex items-center gap-2 px-8 py-3 bg-charcoal text-ivory font-sans text-sm tracking-widest hover:bg-gold transition-colors">
        SHOP NOW <ArrowRight size={14} />
      </a>
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-serif text-4xl text-charcoal mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.product.id} className="bg-card border border-border p-4 flex gap-4 rounded-sm">
                <a href={`#/product/${item.product.id}`} className="w-20 h-20 shrink-0 overflow-hidden rounded-sm bg-beige">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </a>
                <div className="flex-1 min-w-0">
                  <a href={`#/product/${item.product.id}`} className="font-serif text-base text-charcoal hover:text-gold transition-colors line-clamp-1">
                    {item.product.name}
                  </a>
                  <p className="font-sans text-xs text-muted-foreground mt-0.5">SKU: {item.product.sku}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-beige transition-colors text-sm">−</button>
                      <span className="w-10 text-center font-sans text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-beige transition-colors text-sm">+</button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-sans font-semibold text-charcoal">₹{item.product.price * item.quantity}</span>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="text-sm font-sans text-muted-foreground hover:text-destructive transition-colors">
              Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className="bg-card border border-border p-6 rounded-sm h-fit">
            <h2 className="font-serif text-xl text-charcoal mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm font-sans mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-charcoal">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-charcoal'}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">Add ₹{999 - subtotal} more for free shipping</p>
              )}
              <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                <span className="text-charcoal">Total</span>
                <span className="text-charcoal">₹{total}</span>
              </div>
            </div>
            <a
              href="#/checkout"
              className="w-full flex items-center justify-center gap-2 py-3 bg-charcoal text-ivory font-sans text-sm tracking-widest hover:bg-gold transition-colors duration-200"
            >
              PROCEED TO CHECKOUT <ArrowRight size={14} />
            </a>
            <a href="#/category/soap-making" className="block text-center mt-3 text-sm font-sans text-muted-foreground hover:text-gold transition-colors">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

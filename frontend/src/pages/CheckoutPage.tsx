import React, { useState } from 'react';
import { CheckCircle, CreditCard, Smartphone } from 'lucide-react';
import { useCart } from '../App';

type PaymentMethod = 'razorpay' | 'stripe' | 'upi';

interface ShippingForm {
  name: string; email: string; phone: string;
  address: string; city: string; state: string; pincode: string;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<ShippingForm>({ name:'', email:'', phone:'', address:'', city:'', state:'', pincode:'' });
  const [payment, setPayment] = useState<PaymentMethod>('razorpay');
  const [ordered, setOrdered] = useState(false);
  const [loading, setLoading] = useState(false);

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setOrdered(true);
    clearCart();
  };

  if (items.length === 0 && !ordered) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="font-serif text-3xl text-charcoal mb-4">Your cart is empty</h2>
      <a href="#/category/soap-making" className="text-gold font-sans text-sm">Start Shopping →</a>
    </div>
  );

  if (ordered) return (
    <div className="container mx-auto px-4 py-24 text-center max-w-md">
      <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
      <h2 className="font-serif text-4xl text-charcoal mb-3">Order Placed!</h2>
      <p className="font-sans text-sm text-muted-foreground mb-2">Thank you for your order. You will receive a confirmation shortly.</p>
      <p className="font-sans text-xs text-muted-foreground mb-8">Order ID: BON-{Date.now().toString().slice(-8)}</p>
      <a href="#/" className="inline-flex items-center gap-2 px-8 py-3 bg-charcoal text-ivory font-sans text-sm tracking-widest hover:bg-gold transition-colors">
        CONTINUE SHOPPING
      </a>
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-serif text-4xl text-charcoal mb-8">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping */}
              <div className="bg-card border border-border p-6 rounded-sm">
                <h2 className="font-serif text-xl text-charcoal mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name:'name', label:'Full Name', type:'text', full:true },
                    { name:'email', label:'Email Address', type:'email', full:false },
                    { name:'phone', label:'Phone Number', type:'tel', full:false },
                    { name:'address', label:'Street Address', type:'text', full:true },
                    { name:'city', label:'City', type:'text', full:false },
                    { name:'state', label:'State', type:'text', full:false },
                    { name:'pincode', label:'Pincode', type:'text', full:false },
                  ].map(f => (
                    <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
                      <label className="block font-sans text-xs text-charcoal mb-1.5 tracking-wide">{f.label} *</label>
                      <input
                        type={f.type} name={f.name}
                        value={form[f.name as keyof ShippingForm]}
                        onChange={handleChange} required
                        className="w-full px-3 py-2.5 border border-border bg-background font-sans text-sm focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-card border border-border p-6 rounded-sm">
                <h2 className="font-serif text-xl text-charcoal mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id:'razorpay', label:'Razorpay', sub:'Pay via cards, net banking, wallets', icon: CreditCard, disabled: false },
                    { id:'stripe', label:'Stripe', sub:'International cards accepted', icon: CreditCard, disabled: false },
                    { id:'upi', label:'UPI', sub:'Coming Soon', icon: Smartphone, disabled: true },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${payment === opt.id ? 'border-gold bg-beige' : 'border-border hover:border-gold/50'} ${opt.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <input
                        type="radio" name="payment" value={opt.id}
                        checked={payment === opt.id}
                        onChange={() => !opt.disabled && setPayment(opt.id as PaymentMethod)}
                        disabled={opt.disabled}
                        className="accent-gold"
                      />
                      <opt.icon size={20} className="text-gold shrink-0" />
                      <div>
                        <p className="font-sans text-sm font-medium text-charcoal">{opt.label}</p>
                        <p className="font-sans text-xs text-muted-foreground">{opt.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="font-sans text-xs text-muted-foreground mt-4 p-3 bg-beige rounded-sm">
                  ⚠️ Payment integration is in demo mode. No real charges will be made.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-card border border-border p-6 rounded-sm h-fit">
              <h2 className="font-serif text-xl text-charcoal mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-12 h-12 shrink-0 overflow-hidden rounded-sm bg-beige">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-xs text-charcoal line-clamp-1">{item.product.name}</p>
                      <p className="font-sans text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-sans text-xs font-medium text-charcoal">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm font-sans">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                  <span>Total</span><span>₹{total}</span>
                </div>
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full mt-6 py-3 bg-charcoal text-ivory font-sans text-sm tracking-widest hover:bg-gold transition-colors duration-200 disabled:opacity-60"
              >
                {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

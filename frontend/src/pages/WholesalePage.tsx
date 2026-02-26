import React, { useState } from 'react';
import { CheckCircle, Package, Tag, FileText, Headphones } from 'lucide-react';
import { toast } from 'sonner';

const tiers = [
  { qty: '10–49 units', discount: '15% off', label: 'Starter' },
  { qty: '50–99 units', discount: '25% off', label: 'Business' },
  { qty: '100–499 units', discount: '35% off', label: 'Professional' },
  { qty: '500+ units', discount: '45% off', label: 'Enterprise' },
];

const features = [
  { icon: Package, title: 'Minimum Order Quantity', desc: 'MOQ starts at just 10 units per product, making wholesale accessible for growing businesses.' },
  { icon: Tag, title: 'Custom Packaging', desc: 'White-label and custom packaging available for orders above 100 units with your brand identity.' },
  { icon: FileText, title: 'Private Label Services', desc: 'Full private label program available — your brand, our premium quality ingredients.' },
  { icon: Headphones, title: 'Dedicated Support', desc: 'Dedicated account manager for wholesale clients with priority support and faster resolution.' },
];

export default function WholesalePage() {
  const [form, setForm] = useState({ name:'', business:'', gst:'', email:'', phone:'', product:'', quantity:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    toast.success('Wholesale inquiry submitted successfully!');
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="bg-charcoal py-16 text-center px-4">
        <p className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-3">For Businesses</p>
        <h1 className="font-serif text-5xl text-ivory mb-4">Wholesale & Bulk Orders</h1>
        <p className="font-sans text-ivory/60 text-sm max-w-xl mx-auto">
          Partner with BONITARA for premium cosmetic-grade ingredients at competitive wholesale prices. Trusted by 500+ businesses across India.
        </p>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Pricing Tiers */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl text-charcoal">Bulk Pricing Tiers</h2>
            <p className="font-sans text-sm text-muted-foreground mt-2">Greater quantity = greater savings</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier, i) => (
              <div key={tier.label} className={`p-6 border rounded-sm text-center ${i === 2 ? 'border-gold bg-beige' : 'border-border bg-card'}`}>
                {i === 2 && <span className="inline-block bg-gold text-white text-xs px-3 py-0.5 font-sans mb-3 tracking-wide">POPULAR</span>}
                <h3 className="font-serif text-xl text-charcoal mb-1">{tier.label}</h3>
                <p className="font-sans text-xs text-muted-foreground mb-3">{tier.qty}</p>
                <p className="font-serif text-3xl text-gold">{tier.discount}</p>
                <p className="font-sans text-xs text-muted-foreground mt-1">on retail price</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map(f => (
            <div key={f.title} className="bg-card border border-border p-6 rounded-sm">
              <f.icon size={24} className="text-gold mb-3" />
              <h3 className="font-serif text-lg text-charcoal mb-2">{f.title}</h3>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* GST Info */}
        <div className="bg-beige border border-border p-6 rounded-sm mb-16">
          <h3 className="font-serif text-xl text-charcoal mb-3">GST & Documentation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-sm text-charcoal-light">
            <div><strong className="text-charcoal">GST Required:</strong> Valid GSTIN mandatory for B2B invoicing</div>
            <div><strong className="text-charcoal">PAN Required:</strong> PAN card for orders above ₹50,000</div>
            <div><strong className="text-charcoal">Delivery:</strong> 5–10 business days for bulk orders</div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl text-charcoal">Request Wholesale Quote</h2>
            <p className="font-sans text-sm text-muted-foreground mt-2">Fill in the form and our team will respond within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="bg-card border border-gold/30 p-8 rounded-sm text-center">
              <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
              <h3 className="font-serif text-2xl text-charcoal mb-2">Inquiry Received!</h3>
              <p className="font-sans text-sm text-muted-foreground">Our wholesale team will contact you within 24 business hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card border border-border p-8 rounded-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name:'name', label:'Your Name', type:'text' },
                  { name:'business', label:'Business Name', type:'text' },
                  { name:'gst', label:'GST Number', type:'text' },
                  { name:'email', label:'Email Address', type:'email' },
                  { name:'phone', label:'Phone Number', type:'tel' },
                  { name:'quantity', label:'Quantity Required', type:'text' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block font-sans text-xs text-charcoal mb-1.5 tracking-wide">{f.label} *</label>
                    <input
                      type={f.type} name={f.name}
                      value={form[f.name as keyof typeof form]}
                      onChange={handleChange} required
                      className="w-full px-3 py-2.5 border border-border bg-background font-sans text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block font-sans text-xs text-charcoal mb-1.5 tracking-wide">Product Interested In *</label>
                <select name="product" value={form.product} onChange={handleChange} required className="w-full px-3 py-2.5 border border-border bg-background font-sans text-sm focus:outline-none focus:border-gold">
                  <option value="">Select category</option>
                  <option>Soap Making Ingredients</option>
                  <option>Candle Making Supplies</option>
                  <option>Resin Art Materials</option>
                  <option>Fragrance Oils</option>
                  <option>Multiple Categories</option>
                </select>
              </div>
              <div>
                <label className="block font-sans text-xs text-charcoal mb-1.5 tracking-wide">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                  className="w-full px-3 py-2.5 border border-border bg-background font-sans text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                  placeholder="Tell us more about your requirements..."
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-charcoal text-ivory font-sans text-sm tracking-widest hover:bg-gold transition-colors disabled:opacity-60">
                {loading ? 'SUBMITTING...' : 'REQUEST WHOLESALE QUOTE'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

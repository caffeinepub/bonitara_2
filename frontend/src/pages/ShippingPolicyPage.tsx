import React from 'react';
import { Truck, Clock, MapPin, Package, AlertCircle } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-beige py-16 text-center px-4 border-b border-border">
        <p className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-3">Policies</p>
        <h1 className="font-serif text-5xl text-charcoal">Shipping Policy</h1>
        <p className="font-sans text-muted-foreground text-sm mt-3">Last updated: January 2026</p>
      </div>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {[
            { icon: Clock, title: 'Processing Time', desc: '1–3 business days after order confirmation' },
            { icon: Truck, title: 'Delivery Time', desc: '3–7 working days across India' },
            { icon: Package, title: 'Free Shipping', desc: 'On all orders above ₹999' },
            { icon: MapPin, title: 'Coverage', desc: 'Pan-India delivery to all pin codes' },
          ].map(item => (
            <div key={item.title} className="bg-card border border-border p-5 rounded-sm flex gap-4">
              <item.icon size={22} className="text-gold shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif text-base text-charcoal mb-1">{item.title}</h3>
                <p className="font-sans text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6 font-sans text-sm text-charcoal-light leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-3">Processing Time</h2>
            <p>All orders are processed within 1–3 business days (Monday–Saturday, excluding public holidays). Orders placed after 2:00 PM IST will be processed the following business day. You will receive an email confirmation with tracking details once your order is dispatched.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-3">Delivery Timeframes</h2>
            <p>Standard delivery within India takes 3–7 working days depending on your location. Metro cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata) typically receive orders within 3–4 days. Tier-2 and Tier-3 cities may take 5–7 days.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-3">Shipping Charges</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Orders above ₹999: <strong>FREE shipping</strong></li>
              <li>Orders below ₹999: ₹99 flat shipping charge</li>
              <li>Bulk/wholesale orders: Calculated based on weight and destination</li>
              <li>Express delivery (1–3 days): ₹199 additional charge</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-3">Festival & Peak Season Delays</h2>
            <div className="flex gap-3 bg-beige border border-border p-4 rounded-sm">
              <AlertCircle size={18} className="text-gold shrink-0 mt-0.5" />
              <p className="text-sm">During major festivals (Diwali, Holi, Eid, Christmas) and peak seasons, delivery may be delayed by 2–4 additional days due to high courier volumes. We recommend placing orders well in advance during these periods.</p>
            </div>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-3">Order Tracking</h2>
            <p>Once your order is dispatched, you will receive a tracking number via email. You can track your order on the courier partner's website or through your BONITARA account under "My Orders".</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-3">Damaged or Lost Shipments</h2>
            <p>If your order arrives damaged or is lost in transit, please contact us within 48 hours of the expected delivery date with your order number and photos/video of the damage. We will arrange a replacement or refund promptly.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

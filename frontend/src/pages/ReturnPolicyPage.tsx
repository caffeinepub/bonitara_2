import React from 'react';
import { RefreshCw, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export default function ReturnPolicyPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-beige py-16 text-center px-4 border-b border-border">
        <p className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-3">Policies</p>
        <h1 className="font-serif text-5xl text-charcoal">Return & Refund Policy</h1>
        <p className="font-sans text-muted-foreground text-sm mt-3">Last updated: January 2026</p>
      </div>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {[
            { icon: RefreshCw, title: '7-Day Returns', desc: 'Return unused products within 7 days of delivery' },
            { icon: CheckCircle, title: 'Damage Replacement', desc: 'Damaged items replaced free of charge' },
            { icon: Clock, title: 'Refund Timeline', desc: '5–7 working days after return approval' },
            { icon: AlertTriangle, title: 'Proof Required', desc: 'Unboxing video required for damage claims' },
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

        <div className="space-y-8 font-sans text-sm text-charcoal-light leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-3">Return Eligibility</h2>
            <p className="mb-3">We accept returns within 7 days of delivery for products that meet the following conditions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Product is unused and in original condition</li>
              <li>Original packaging is intact and undamaged</li>
              <li>Product has not been opened or tampered with</li>
              <li>Return request is initiated within 7 days of delivery</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-3">Non-Returnable Items</h2>
            <div className="bg-beige border border-border p-4 rounded-sm">
              <p>The following items cannot be returned for hygiene and safety reasons:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Opened or used products</li>
                <li>Products without original packaging</li>
                <li>Customized or private-label products</li>
                <li>Products purchased during clearance sales</li>
              </ul>
            </div>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-3">Damaged Item Policy</h2>
            <p>If you receive a damaged or defective product, we will replace it free of charge. To initiate a damage claim:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Record an unboxing video showing the damage (mandatory)</li>
              <li>Contact us within 48 hours of delivery</li>
              <li>Share the video and photos via email or WhatsApp</li>
              <li>We will arrange a replacement within 3–5 business days</li>
            </ol>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-3">Refund Process</h2>
            <p>Once your return is approved and the product is received and inspected, refunds are processed within 5–7 working days. Refunds are credited to the original payment method. Shipping charges are non-refundable unless the return is due to our error.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-3">How to Initiate a Return</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Email us at returns@bonitara.in with your order number</li>
              <li>Describe the reason for return and attach photos if applicable</li>
              <li>Our team will review and respond within 24 hours</li>
              <li>Ship the product to our warehouse address (provided upon approval)</li>
              <li>Refund will be processed within 5–7 days of receiving the return</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}

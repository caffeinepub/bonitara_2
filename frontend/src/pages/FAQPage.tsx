import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'What is the minimum order quantity?', a: 'For retail orders, there is no minimum order quantity — you can order as little as 1 unit. For wholesale pricing, the minimum order is 10 units per product. Bulk pricing tiers start from 10 units.' },
  { q: 'How long does shipping take?', a: 'Orders are processed within 1–3 business days. Standard delivery takes 3–7 working days across India. Express delivery (1–3 days) is available at an additional charge. Bulk/wholesale orders may take 5–10 business days.' },
  { q: 'Do you offer wholesale pricing?', a: 'Yes! We offer tiered wholesale pricing starting from 15% off for 10–49 units, up to 45% off for 500+ units. Visit our Wholesale page to learn more and submit an inquiry.' },
  { q: 'Are all products cosmetic grade?', a: 'Yes, all BONITARA products are cosmetic grade or higher. We source from certified suppliers and each product listing clearly states the grade (Cosmetic Grade, Therapeutic Grade, Pharmaceutical Grade, etc.).' },
  { q: 'Do you provide lab test reports?', a: 'Yes, Certificate of Analysis (CoA) and lab test reports are available for most products. Please contact us with your specific product requirements and we will provide the relevant documentation.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, net banking, UPI (coming soon), and Razorpay. For wholesale orders above ₹10,000, bank transfer (NEFT/RTGS) is also available.' },
  { q: 'Can I customize packaging?', a: 'Yes! Custom and white-label packaging is available for wholesale orders of 100+ units. We offer custom labels, boxes, and branding. Contact our wholesale team for details and pricing.' },
  { q: 'What is your return policy?', a: 'We offer a 7-day return window for unused, unopened products in original packaging. Damaged items are replaced free of charge with proof (unboxing video required). Used products cannot be returned for hygiene reasons.' },
  { q: 'Are your products vegan and cruelty-free?', a: 'Most of our products are vegan. Products containing beeswax or goat milk are clearly labeled. None of our products are tested on animals. We are committed to ethical sourcing.' },
  { q: 'Do you ship internationally?', a: 'Currently, we ship within India only. International shipping is planned for the future. Sign up for our newsletter to be notified when international shipping becomes available.' },
];

export default function FAQPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-beige py-16 text-center px-4 border-b border-border">
        <p className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-3">Help Center</p>
        <h1 className="font-serif text-5xl text-charcoal">Frequently Asked Questions</h1>
        <p className="font-sans text-muted-foreground text-sm mt-3 max-w-md mx-auto">
          Find answers to the most common questions about BONITARA products and services.
        </p>
      </div>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-sm px-6">
              <AccordionTrigger className="font-serif text-base text-charcoal py-4 hover:text-gold hover:no-underline text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-sans text-sm text-charcoal-light leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-12 text-center bg-beige border border-border p-8 rounded-sm">
          <h3 className="font-serif text-2xl text-charcoal mb-2">Still have questions?</h3>
          <p className="font-sans text-sm text-muted-foreground mb-4">Our team is happy to help you with any queries.</p>
          <a href="#/contact" className="inline-flex items-center gap-2 px-6 py-2.5 bg-charcoal text-ivory font-sans text-sm tracking-widest hover:bg-gold transition-colors">
            CONTACT US
          </a>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { SiInstagram, SiFacebook, SiYoutube } from 'react-icons/si';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'bonitara');

  return (
    <footer className="bg-charcoal text-ivory/80 font-sans">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <img
            src="/assets/generated/bonitara-logo.dim_400x120.png"
            alt="BONITARA"
            className="h-10 w-auto object-contain mb-4 brightness-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <p className="text-sm leading-relaxed text-ivory/60 mb-4">
            BONITARA – Inspired By Elegance. Premium cosmetic-grade raw materials for soap making, candle making, resin art, and fragrance.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
              <SiInstagram size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
              <SiFacebook size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
              <SiYoutube size={14} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif text-ivory text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'Home', href: '#/' },
              { label: 'Soap Making', href: '#/category/soap-making' },
              { label: 'Candle Making', href: '#/category/candle-making' },
              { label: 'Resin Art', href: '#/category/resin-art' },
              { label: 'Fragrance', href: '#/category/fragrance' },
              { label: 'Wholesale', href: '#/wholesale' },
              { label: 'Blog', href: '#/blog' },
            ].map(l => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-gold transition-colors">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="font-serif text-ivory text-lg mb-4">Policies</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'FAQ', href: '#/faq' },
              { label: 'Shipping Policy', href: '#/shipping' },
              { label: 'Return & Refund', href: '#/returns' },
              { label: 'Terms & Conditions', href: '#/terms' },
              { label: 'Contact Us', href: '#/contact' },
            ].map(l => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-gold transition-colors">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-serif text-ivory text-lg mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Mail size={14} className="mt-0.5 text-gold shrink-0" />
              <span>hello@bonitara.in</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={14} className="mt-0.5 text-gold shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 text-gold shrink-0" />
              <span>Mumbai, Maharashtra, India</span>
            </li>
          </ul>
          <div className="mt-4 text-xs text-ivory/40">
            Mon–Sat: 10:00 AM – 6:00 PM IST
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ivory/10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ivory/40">
          <span>© {year} BONITARA. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with <Heart size={11} className="text-gold fill-gold" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

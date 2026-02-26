import React from 'react';
import { Heart } from 'lucide-react';
import { SiInstagram, SiFacebook, SiYoutube } from 'react-icons/si';

const footerLinks = {
  quickLinks: [
    { label: 'Home', href: '#/' },
    { label: 'Shop Candles', href: '#/category/candles' },
    { label: 'Shop Fragrances', href: '#/category/fragrances' },
    { label: 'Wholesale', href: '#/wholesale' },
    { label: 'Blog', href: '#/blog' },
  ],
  policies: [
    { label: 'Shipping Policy', href: '#/shipping-policy' },
    { label: 'Return Policy', href: '#/return-policy' },
    { label: 'Terms & Conditions', href: '#/terms' },
    { label: 'FAQ', href: '#/faq' },
  ],
  contact: [
    { label: 'Contact Us', href: '#/contact' },
    { label: 'My Account', href: '#/profile' },
    { label: 'My Orders', href: '#/orders' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'bonitara');

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src="/assets/generated/bonitara-logo.dim_400x120.png"
              alt="BONITARA"
              className="h-10 w-auto object-contain mb-4 brightness-0 invert"
            />
            <p className="text-sm text-background/70 leading-relaxed mb-6">
              Handcrafted luxury home fragrances made with love and the finest natural ingredients.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-background/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                <SiInstagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-background/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                <SiFacebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-background/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                <SiYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-background mb-4 tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5">
              {footerLinks.quickLinks.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-serif text-lg text-background mb-4 tracking-wide">Policies</h4>
            <ul className="space-y-2.5">
              {footerLinks.policies.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg text-background mb-4 tracking-wide">Account</h4>
            <ul className="space-y-2.5">
              {footerLinks.contact.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-sm text-background/70 mb-1">Email us at:</p>
              <a href="mailto:hello@bonitara.com" className="text-sm text-background hover:text-primary transition-colors">
                hello@bonitara.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-background/60">
          <p>© {year} BONITARA. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/80 hover:text-background transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

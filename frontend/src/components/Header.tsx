import React, { useState } from 'react';
import { ShoppingCart, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../App';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

const navLinks = [
  { label: 'Home', href: '#/' },
  {
    label: 'Categories', href: '#/category/soap-making',
    children: [
      { label: 'Soap Making', href: '#/category/soap-making' },
      { label: 'Candle Making', href: '#/category/candle-making' },
      { label: 'Resin Art', href: '#/category/resin-art' },
      { label: 'Fragrance', href: '#/category/fragrance' },
    ]
  },
  { label: 'Wholesale', href: '#/wholesale' },
  { label: 'Blog', href: '#/blog' },
  { label: 'Contact', href: '#/contact' },
];

export default function Header() {
  const { totalItems } = useCart();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try { await login(); } catch { /* handled */ }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-ivory border-b border-border shadow-xs">
      {/* Top bar */}
      <div className="bg-charcoal text-ivory/70 text-xs py-1.5 text-center font-sans tracking-widest">
        FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;|&nbsp; COSMETIC GRADE INGREDIENTS
      </div>

      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#/" className="flex items-center gap-2 shrink-0">
          <img
            src="/assets/generated/bonitara-logo.dim_400x120.png"
            alt="BONITARA"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = 'none';
              const span = document.createElement('span');
              span.className = 'font-serif text-2xl font-semibold text-charcoal tracking-widest';
              span.textContent = 'BONITARA';
              t.parentElement?.appendChild(span);
            }}
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            link.children ? (
              <div key={link.label} className="relative group">
                <button className="flex items-center gap-1 text-sm font-sans font-medium text-charcoal hover:text-gold transition-colors tracking-wide">
                  {link.label} <ChevronDown size={14} />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border shadow-luxury rounded-sm py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {link.children.map(child => (
                    <a key={child.label} href={child.href} className="block px-4 py-2 text-sm text-charcoal hover:bg-beige hover:text-gold transition-colors font-sans">
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a key={link.label} href={link.href} className="text-sm font-sans font-medium text-charcoal hover:text-gold transition-colors tracking-wide">
                {link.label}
              </a>
            )
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a href="#/cart" className="relative p-2 text-charcoal hover:text-gold transition-colors">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-sans font-semibold">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </a>
          <a href="#/profile" className="p-2 text-charcoal hover:text-gold transition-colors hidden sm:block">
            <Heart size={20} />
          </a>
          {isAuthenticated ? (
            <div className="relative group">
              <button className="p-2 text-charcoal hover:text-gold transition-colors">
                <User size={20} />
              </button>
              <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border shadow-luxury rounded-sm py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <a href="#/profile" className="block px-4 py-2 text-sm text-charcoal hover:bg-beige font-sans">My Profile</a>
                <a href="#/orders" className="block px-4 py-2 text-sm text-charcoal hover:bg-beige font-sans">My Orders</a>
                <a href="#/admin" className="block px-4 py-2 text-sm text-charcoal hover:bg-beige font-sans">Admin</a>
                <hr className="my-1 border-border" />
                <button onClick={handleAuth} className="w-full text-left px-4 py-2 text-sm text-charcoal hover:bg-beige font-sans">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAuth}
              disabled={loginStatus === 'logging-in'}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 border border-gold text-gold text-sm font-sans font-medium hover:bg-gold hover:text-white transition-all duration-200 rounded-sm disabled:opacity-50"
            >
              <User size={14} />
              {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
            </button>
          )}
          <button className="md:hidden p-2 text-charcoal" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 space-y-3">
          {navLinks.map(link => (
            <div key={link.label}>
              <a href={link.href} className="block text-sm font-sans font-medium text-charcoal py-1.5" onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
              {link.children && (
                <div className="pl-4 space-y-1 mt-1">
                  {link.children.map(child => (
                    <a key={child.label} href={child.href} className="block text-sm text-charcoal-light py-1 font-sans" onClick={() => setMobileOpen(false)}>
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-2 border-t border-border flex gap-3">
            <a href="#/cart" className="flex items-center gap-1.5 text-sm text-charcoal font-sans" onClick={() => setMobileOpen(false)}>
              <ShoppingCart size={16} /> Cart ({totalItems})
            </a>
            <button onClick={handleAuth} className="text-sm text-gold font-sans font-medium">
              {isAuthenticated ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

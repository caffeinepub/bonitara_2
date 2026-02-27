import React, { useState, useContext } from 'react';
import { CartContext, WishlistContext } from '../App';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import {
  ShoppingCart,
  Heart,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  ClipboardList,
} from 'lucide-react';

const CATEGORIES = [
  { label: 'Soap Making', slug: 'soap-making' },
  { label: 'Candle Making', slug: 'candle-making' },
  { label: 'Resin Art', slug: 'resin-art' },
  { label: 'Fragrance', slug: 'fragrance' },
];

const NAV_LINKS = [
  { label: 'Home', href: '#/' },
  { label: 'Wholesale', href: '#/wholesale' },
  { label: 'Blog', href: '#/blog' },
  { label: 'FAQ', href: '#/faq' },
  { label: 'Contact', href: '#/contact' },
];

export default function Header() {
  const { itemCount } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const wishlistCount = wishlistItems.length;

  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      setUserMenuOpen(false);
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a href="#/" className="shrink-0">
            <img
              src="/assets/generated/bonitara-logo.dim_400x120.png"
              alt="Bonitara"
              className="h-10 w-auto object-contain"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <a href="#/" className="text-sm font-body text-foreground hover:text-primary transition-colors">
              Home
            </a>

            {/* Categories Dropdown */}
            <div className="relative" onMouseEnter={() => setCategoryOpen(true)} onMouseLeave={() => setCategoryOpen(false)}>
              <button className="flex items-center gap-1 text-sm font-body text-foreground hover:text-primary transition-colors">
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoryOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-sm shadow-lg py-1 z-50">
                  {CATEGORIES.map(cat => (
                    <a
                      key={cat.slug}
                      href={`#/category/${cat.slug}`}
                      className="block px-4 py-2 text-sm font-body text-foreground hover:bg-muted hover:text-primary transition-colors"
                      onClick={() => setCategoryOpen(false)}
                    >
                      {cat.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {NAV_LINKS.slice(1).map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-body text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <a
              href="#/wishlist"
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-body leading-none">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </a>

            {/* Cart */}
            <a
              href="#/cart"
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-body leading-none">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </a>

            {/* User Menu */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className="p-2 text-foreground hover:text-primary transition-colors"
                title="Account"
              >
                <User className="w-5 h-5" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-sm shadow-lg py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <a
                        href="#/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-body text-foreground hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </a>
                      <a
                        href="#/orders"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-body text-foreground hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ClipboardList className="w-4 h-4" />
                        My Orders
                      </a>
                      <div className="border-t border-border my-1" />
                      <button
                        onClick={handleAuth}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-body text-foreground hover:bg-muted transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { handleAuth(); setUserMenuOpen(false); }}
                      disabled={isLoggingIn}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm font-body text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      <User className="w-4 h-4" />
                      {isLoggingIn ? 'Signing in...' : 'Sign In'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            <a
              href="#/"
              className="block px-3 py-2 text-sm font-body text-foreground hover:bg-muted rounded-sm transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </a>

            {/* Mobile Categories */}
            <div>
              <button
                onClick={() => setCategoryOpen(v => !v)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-body text-foreground hover:bg-muted rounded-sm transition-colors"
              >
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoryOpen && (
                <div className="pl-4 space-y-1 mt-1">
                  {CATEGORIES.map(cat => (
                    <a
                      key={cat.slug}
                      href={`#/category/${cat.slug}`}
                      className="block px-3 py-2 text-sm font-body text-muted-foreground hover:text-primary hover:bg-muted rounded-sm transition-colors"
                      onClick={() => { setMobileOpen(false); setCategoryOpen(false); }}
                    >
                      {cat.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {NAV_LINKS.slice(1).map(link => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm font-body text-foreground hover:bg-muted rounded-sm transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <div className="border-t border-border pt-2 mt-2 space-y-1">
              <a
                href="#/wishlist"
                className="flex items-center gap-2 px-3 py-2 text-sm font-body text-foreground hover:bg-muted rounded-sm transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <Heart className="w-4 h-4" />
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </a>
              <a
                href="#/cart"
                className="flex items-center gap-2 px-3 py-2 text-sm font-body text-foreground hover:bg-muted rounded-sm transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <ShoppingCart className="w-4 h-4" />
                Cart {itemCount > 0 && `(${itemCount})`}
              </a>

              {isAuthenticated ? (
                <>
                  <a
                    href="#/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-body text-foreground hover:bg-muted rounded-sm transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </a>
                  <a
                    href="#/orders"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-body text-foreground hover:bg-muted rounded-sm transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <ClipboardList className="w-4 h-4" />
                    My Orders
                  </a>
                  <button
                    onClick={() => { handleAuth(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-body text-foreground hover:bg-muted rounded-sm transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { handleAuth(); setMobileOpen(false); }}
                  disabled={isLoggingIn}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-body text-foreground hover:bg-muted rounded-sm transition-colors disabled:opacity-50"
                >
                  <User className="w-4 h-4" />
                  {isLoggingIn ? 'Signing in...' : 'Sign In'}
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

import React, { useState } from 'react';
import { ShoppingCart, Heart, Menu, X, ChevronDown, User, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useCart } from '../App';
import { useWishlist } from '../App';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useManualAuth } from '../hooks/useManualAuth';
import { useQueryClient } from '@tanstack/react-query';

const categories = [
  { name: 'Candles', slug: 'candles' },
  { name: 'Fragrances', slug: 'fragrances' },
  { name: 'Resin Art', slug: 'resin' },
  { name: 'Soaps', slug: 'soaps' },
];

const navLinks = [
  { label: 'Home', href: '#/' },
  { label: 'Blog', href: '#/blog' },
  { label: 'Wholesale', href: '#/wholesale' },
  { label: 'Contact', href: '#/contact' },
];

export default function Header() {
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const { isManuallyAuthenticated, manualUser, manualLogout } = useManualAuth();
  const queryClient = useQueryClient();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAuthenticated = !!identity || isManuallyAuthenticated;
  const displayName = manualUser?.name || (identity ? 'My Account' : null);

  const handleLogout = async () => {
    if (identity) {
      await clear();
      queryClient.clear();
    }
    if (isManuallyAuthenticated) {
      manualLogout();
    }
    setUserMenuOpen(false);
    setMobileOpen(false);
    window.location.hash = '/';
  };

  const handleLogin = () => {
    window.location.hash = '/login';
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="#/" className="shrink-0">
            <img
              src="/assets/generated/bonitara-logo.dim_400x120.png"
              alt="BONITARA"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <a href="#/" className="text-sm font-medium text-foreground hover:text-primary transition-colors tracking-wide">
              Home
            </a>

            {/* Categories dropdown */}
            <div className="relative" onMouseEnter={() => setCategoryOpen(true)} onMouseLeave={() => setCategoryOpen(false)}>
              <button className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors tracking-wide">
                Shop <ChevronDown className={`w-4 h-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoryOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-xl shadow-lg py-2 z-50">
                  {categories.map(cat => (
                    <a
                      key={cat.slug}
                      href={`#/category/${cat.slug}`}
                      className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      {cat.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(1).map(link => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors tracking-wide">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Wishlist */}
            <a href="#/profile" className="relative p-2 sm:p-2.5 text-foreground hover:text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </a>

            {/* Cart */}
            <a href="#/cart" className="relative p-2 sm:p-2.5 text-foreground hover:text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </a>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors min-h-[44px]"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline max-w-[100px] truncate">{displayName}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-lg py-2 z-50">
                    <a href="#/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </a>
                    <a href="#/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors">
                      <Package className="w-4 h-4" /> My Orders
                    </a>
                    {manualUser?.isAdmin && (
                      <a href="#/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Admin
                      </a>
                    )}
                    <hr className="my-1 border-border" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors min-h-[44px]"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background shadow-lg max-h-[80vh] overflow-y-auto">
          <nav className="px-4 py-4 space-y-1">
            <a
              href="#/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-3 py-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors min-h-[44px]"
            >
              Home
            </a>

            {/* Mobile categories */}
            <div>
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors min-h-[44px]"
              >
                Shop <ChevronDown className={`w-4 h-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoryOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {categories.map(cat => (
                    <a
                      key={cat.slug}
                      href={`#/category/${cat.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-3 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors min-h-[44px]"
                    >
                      {cat.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(1).map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-3 py-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors min-h-[44px]"
              >
                {link.label}
              </a>
            ))}

            <hr className="border-border my-2" />

            {isAuthenticated ? (
              <>
                <a
                  href="#/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors min-h-[44px]"
                >
                  <User className="w-4 h-4" /> {displayName || 'Profile'}
                </a>
                <a
                  href="#/orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors min-h-[44px]"
                >
                  <Package className="w-4 h-4" /> My Orders
                </a>
                {manualUser?.isAdmin && (
                  <a
                    href="#/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors min-h-[44px]"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-1">
                <a
                  href="#/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors min-h-[44px]"
                >
                  Sign In
                </a>
                <a
                  href="#/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors min-h-[44px]"
                >
                  Create Account
                </a>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

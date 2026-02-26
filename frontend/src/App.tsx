import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from './data/products';

// ─── Cart Types ───────────────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

// ─── Wishlist Types ───────────────────────────────────────────────────────────
export interface WishlistContextType {
  items: string[];
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  totalItems: number;
}

// ─── Contexts ─────────────────────────────────────────────────────────────────
export const CartContext = createContext<CartContextType | null>(null);
export const WishlistContext = createContext<WishlistContextType | null>(null);

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}

// ─── Page imports ─────────────────────────────────────────────────────────────
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import BlogListingPage from './pages/BlogListingPage';
import BlogPostPage from './pages/BlogPostPage';
import WholesalePage from './pages/WholesalePage';
import FAQPage from './pages/FAQPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import TermsPage from './pages/TermsPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// ─── Hash Router ──────────────────────────────────────────────────────────────
function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash.slice(1) || '/');
  useEffect(() => {
    const handler = () => {
      setHash(window.location.hash.slice(1) || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return hash;
}

function Router() {
  const route = useHashRoute();
  const segments = route.split('/').filter(Boolean);
  const base = '/' + (segments[0] || '');

  if (route === '/' || route === '') return <HomePage />;
  if (route === '/login') return <LoginPage />;
  if (route === '/register') return <RegisterPage />;
  if (route === '/cart') return <CartPage />;
  if (route === '/checkout') return <CheckoutPage />;
  if (route === '/wholesale') return <WholesalePage />;
  if (route === '/faq') return <FAQPage />;
  if (route === '/shipping-policy') return <ShippingPolicyPage />;
  if (route === '/terms') return <TermsPage />;
  if (route === '/return-policy') return <ReturnPolicyPage />;
  if (route === '/contact') return <ContactPage />;
  if (route === '/blog') return <BlogListingPage />;
  if (route === '/admin') return <AdminDashboardPage />;

  if (route === '/profile') return (
    <ProtectedRoute><ProfilePage /></ProtectedRoute>
  );
  if (route === '/orders') return (
    <ProtectedRoute><OrderHistoryPage /></ProtectedRoute>
  );

  if (base === '/category' && segments[1]) return <CategoryPage slug={segments[1]} />;
  if (base === '/product' && segments[1]) return <ProductDetailPage productId={segments[1]} />;
  if (base === '/blog' && segments[1]) return <BlogPostPage postId={segments[1]} />;

  return <HomePage />;
}

function Layout() {
  const route = useHashRoute();
  const hideLayout = route === '/login' || route === '/register';

  return (
    <>
      {!hideLayout && <Header />}
      <main>
        <Router />
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  // ── Cart state ──────────────────────────────────────────────────────────────
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('bonitara_cart');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('bonitara_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setCartItems(prev => prev.filter(i => i.product.id !== productId));
    } else {
      setCartItems(prev =>
        prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
      );
    }
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // ── Wishlist state ──────────────────────────────────────────────────────────
  const [wishlistItems, setWishlistItems] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('bonitara_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('bonitara_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlistItems(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  }, []);

  const isWishlisted = useCallback((productId: string) => wishlistItems.includes(productId), [wishlistItems]);

  const cartContextValue: CartContextType = {
    items: cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  };

  const wishlistContextValue: WishlistContextType = {
    items: wishlistItems,
    wishlist: wishlistItems,
    toggleWishlist,
    toggleItem: toggleWishlist,
    isWishlisted,
    has: isWishlisted,
    toggle: toggleWishlist,
    totalItems: wishlistItems.length,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      <WishlistContext.Provider value={wishlistContextValue}>
        <Layout />
      </WishlistContext.Provider>
    </CartContext.Provider>
  );
}

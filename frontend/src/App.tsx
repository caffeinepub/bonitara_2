import React, { useState, createContext, useContext, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WholesalePage from './pages/WholesalePage';
import FAQPage from './pages/FAQPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import TermsPage from './pages/TermsPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import ContactPage from './pages/ContactPage';
import BlogListingPage from './pages/BlogListingPage';
import BlogPostPage from './pages/BlogPostPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { Product } from './data/products';

// ─── Cart Context ────────────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

export const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
});

export function useCart() {
  return useContext(CartContext);
}

// ─── Wishlist Context ────────────────────────────────────────────────────────
interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

export const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  toggleWishlist: () => {},
  isWishlisted: () => false,
});

export function useWishlist() {
  return useContext(WishlistContext);
}

// ─── Router (simple hash-based) ─────────────────────────────────────────────
function getRoute(): string {
  return window.location.hash.replace('#', '') || '/';
}

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bonitara_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bonitara_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    const handler = () => setRoute(getRoute());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('bonitara_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem('bonitara_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart operations
  const addToCart = (product: Product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    setCartItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };
  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Route parsing
  const renderPage = () => {
    if (route === '/' || route === '') return <HomePage />;
    if (route.startsWith('/category/')) {
      const slug = route.replace('/category/', '');
      return <CategoryPage slug={slug} />;
    }
    if (route.startsWith('/product/')) {
      const id = route.replace('/product/', '');
      return <ProductDetailPage productId={id} />;
    }
    if (route === '/cart') return <CartPage />;
    if (route === '/checkout') return <CheckoutPage />;
    if (route === '/wholesale') return <WholesalePage />;
    if (route === '/faq') return <FAQPage />;
    if (route === '/shipping') return <ShippingPolicyPage />;
    if (route === '/terms') return <TermsPage />;
    if (route === '/returns') return <ReturnPolicyPage />;
    if (route === '/contact') return <ContactPage />;
    if (route === '/blog') return <BlogListingPage />;
    if (route.startsWith('/blog/')) {
      const id = route.replace('/blog/', '');
      return <BlogPostPage postId={id} />;
    }
    if (route === '/profile') return <ProfilePage />;
    if (route === '/orders') return <OrderHistoryPage />;
    if (route.startsWith('/admin')) return <AdminDashboardPage />;
    return <HomePage />;
  };

  return (
    <CartContext.Provider value={{ items: cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}>
      <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1">
            {renderPage()}
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </WishlistContext.Provider>
    </CartContext.Provider>
  );
}

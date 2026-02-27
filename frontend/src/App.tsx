import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './backend';

// Cart types
interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: bigint) => void;
  updateQuantity: (productId: bigint, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

// Wishlist types
interface WishlistContextType {
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: bigint) => boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: bigint) => void;
}

export const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  subtotal: 0,
  itemCount: 0,
});

export const WishlistContext = createContext<WishlistContextType>({
  wishlistItems: [],
  toggleWishlist: () => {},
  isWishlisted: () => false,
  addToWishlist: () => {},
  removeFromWishlist: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

export function useWishlist() {
  return useContext(WishlistContext);
}

// Pages
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
import AdminLoginPage from './pages/AdminLoginPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Simple hash-based router
function useHashRouter() {
  const [hash, setHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return hash;
}

function parseHash(hash: string): { path: string; params: Record<string, string> } {
  const withoutHash = hash.replace(/^#/, '') || '/';
  const [path] = withoutHash.split('?');
  return { path, params: {} };
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Simple pass-through; actual auth guard is inside the page components
  return <>{children}</>;
}

// Admin routes render without the main Header/Footer
function isAdminRoute(path: string): boolean {
  return path === '/admin' || path === '/admin/login';
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: bigint) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: bigint, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (product: Product) => {
    setWishlistItems(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isWishlisted = (productId: bigint) =>
    wishlistItems.some(p => p.id === productId);

  const addToWishlist = (product: Product) => {
    if (!isWishlisted(product.id)) {
      setWishlistItems(prev => [...prev, product]);
    }
  };

  const removeFromWishlist = (productId: bigint) => {
    setWishlistItems(prev => prev.filter(p => p.id !== productId));
  };

  const hash = useHashRouter();
  const { path } = parseHash(hash);

  const renderPage = () => {
    // Admin routes — no main header/footer
    if (path === '/admin/login') return <AdminLoginPage />;
    if (path === '/admin') return (
      <AdminProtectedRoute>
        <AdminDashboardPage />
      </AdminProtectedRoute>
    );

    // Exact matches
    if (path === '/' || path === '') return <HomePage />;
    if (path === '/cart') return <CartPage />;
    if (path === '/checkout') return <CheckoutPage />;
    if (path === '/wholesale') return <WholesalePage />;
    if (path === '/faq') return <FAQPage />;
    if (path === '/shipping-policy') return <ShippingPolicyPage />;
    if (path === '/terms') return <TermsPage />;
    if (path === '/return-policy') return <ReturnPolicyPage />;
    if (path === '/contact') return <ContactPage />;
    if (path === '/blog') return <BlogListingPage />;
    if (path === '/wishlist') return <WishlistPage />;
    if (path === '/profile') return <ProtectedRoute><ProfilePage /></ProtectedRoute>;
    if (path === '/orders') return <ProtectedRoute><OrderHistoryPage /></ProtectedRoute>;
    if (path === '/login') return <LoginPage />;
    if (path === '/register') return <LoginPage />;

    // Dynamic routes
    if (path.startsWith('/category/')) {
      const category = path.replace('/category/', '');
      return <CategoryPage category={category} />;
    }
    if (path.startsWith('/product/')) {
      const productId = path.replace('/product/', '');
      return <ProductDetailPage productId={productId} />;
    }
    if (path.startsWith('/blog/')) {
      const postId = path.replace('/blog/', '');
      return <BlogPostPage postId={postId} />;
    }

    // 404 fallback
    return <HomePage />;
  };

  // Admin routes don't use the main layout
  if (isAdminRoute(path)) {
    return (
      <CartContext.Provider value={{
        items: cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
      }}>
        <WishlistContext.Provider value={{
          wishlistItems,
          toggleWishlist,
          isWishlisted,
          addToWishlist,
          removeFromWishlist,
        }}>
          {renderPage()}
        </WishlistContext.Provider>
      </CartContext.Provider>
    );
  }

  return (
    <CartContext.Provider value={{
      items: cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount,
    }}>
      <WishlistContext.Provider value={{
        wishlistItems,
        toggleWishlist,
        isWishlisted,
        addToWishlist,
        removeFromWishlist,
      }}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {renderPage()}
          </main>
          <Footer />
        </div>
      </WishlistContext.Provider>
    </CartContext.Provider>
  );
}

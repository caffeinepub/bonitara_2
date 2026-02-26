import React, { useState } from 'react';
import { useActor } from '../hooks/useActor';
import { useManualAuth } from '../hooks/useManualAuth';
import { Loader2, LayoutDashboard, Package, ShoppingBag, MessageSquare, Eye, EyeOff, Shield } from 'lucide-react';

const mockStats = [
  { label: 'Total Revenue', value: '₹1,24,500', change: '+12%' },
  { label: 'Total Orders', value: '342', change: '+8%' },
  { label: 'Products', value: '48', change: '+3' },
  { label: 'Customers', value: '1,205', change: '+24' },
];

const mockProducts = [
  { id: 'P001', name: 'Sandalwood Dreams Candle', category: 'Candles', price: 650, stock: 45 },
  { id: 'P002', name: 'Jasmine Bloom Perfume', category: 'Fragrances', price: 1800, stock: 12 },
  { id: 'P003', name: 'Ocean Breeze Resin Art', category: 'Resin', price: 950, stock: 8 },
  { id: 'P004', name: 'Rose Petal Soap Bar', category: 'Soaps', price: 550, stock: 67 },
  { id: 'P005', name: 'Lavender Mist Candle', category: 'Candles', price: 400, stock: 30 },
];

const mockOrders = [
  { id: 'ORD-001', customer: 'Priya Sharma', date: 'Feb 20, 2024', total: '₹1,850', status: 'Delivered' },
  { id: 'ORD-002', customer: 'Rahul Mehta', date: 'Feb 19, 2024', total: '₹2,200', status: 'Shipped' },
  { id: 'ORD-003', customer: 'Anita Patel', date: 'Feb 18, 2024', total: '₹950', status: 'Processing' },
  { id: 'ORD-004', customer: 'Vikram Singh', date: 'Feb 17, 2024', total: '₹3,400', status: 'Delivered' },
];

const mockInquiries = [
  { id: 'INQ-001', name: 'Sunita Enterprises', email: 'sunita@example.com', message: 'Interested in bulk order of 500 candles for corporate gifting.', date: 'Feb 20, 2024' },
  { id: 'INQ-002', name: 'Aroma World', email: 'aroma@example.com', message: 'Looking for wholesale pricing on fragrances.', date: 'Feb 18, 2024' },
];

export default function AdminDashboardPage() {
  const { actor } = useActor();
  const { isManuallyAuthenticated, manualUser } = useManualAuth();

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(manualUser?.isAdmin || false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inquiries'>('overview');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      setLoginError('Service not available. Please try again.');
      return;
    }
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const success = await actor.adminCheck(loginEmail.trim(), loginPassword);
      if (success) {
        setIsAdminLoggedIn(true);
      } else {
        setLoginError('Invalid admin credentials. Please try again.');
      }
    } catch (err) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-2">Sign in with admin credentials to continue</p>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-lg p-6 sm:p-8">
            {/* Dev hint */}
            <div className="bg-muted/50 rounded-lg p-3 mb-6 text-xs text-muted-foreground">
              <p className="font-medium mb-1">Development Credentials:</p>
              <p>Username: <code className="bg-muted px-1 rounded">admin</code></p>
              <p>Password: <code className="bg-muted px-1 rounded">Bonitara@2024</code></p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              {loginError && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg px-4 py-3">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
                <input
                  type="text"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="admin"
                  className="w-full h-11 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                  disabled={isLoggingIn}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full h-11 px-4 pr-11 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                    disabled={isLoggingIn}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-11 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
              >
                {isLoggingIn ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In as Admin'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-1">Manage your BONITARA store</p>
            </div>
            <button
              onClick={() => setIsAdminLoggedIn(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 border border-border rounded-lg min-h-[44px]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-background sticky top-16 sm:top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-h-[44px] ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {mockStats.map(stat => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-4 sm:p-6">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="font-serif text-xl sm:text-2xl text-foreground">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change} this month</p>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <h3 className="font-serif text-lg text-foreground mb-4">Recent Orders</h3>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 px-4 sm:px-0">Order ID</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3">Customer</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3">Date</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3">Total</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4 sm:pr-0">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockOrders.map(order => (
                      <tr key={order.id}>
                        <td className="py-3 text-sm text-foreground px-4 sm:px-0">{order.id}</td>
                        <td className="py-3 text-sm text-foreground">{order.customer}</td>
                        <td className="py-3 text-sm text-muted-foreground">{order.date}</td>
                        <td className="py-3 text-sm text-foreground font-medium">{order.total}</td>
                        <td className="py-3 pr-4 sm:pr-0">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between gap-4">
              <h3 className="font-serif text-lg text-foreground">Products</h3>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors min-h-[44px]">
                + Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4 sm:px-6">Product</th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3">Category</th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3">Price</th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3 pr-4 sm:pr-6">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockProducts.map(product => (
                    <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 sm:px-6">
                        <p className="text-sm font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.id}</p>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">{product.category}</td>
                      <td className="py-3 text-sm text-foreground font-medium">₹{product.price}</td>
                      <td className="py-3 pr-4 sm:pr-6">
                        <span className={`text-sm font-medium ${product.stock < 15 ? 'text-red-600' : 'text-green-600'}`}>
                          {product.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-border">
              <h3 className="font-serif text-lg text-foreground">All Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4 sm:px-6">Order ID</th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3">Customer</th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3">Date</th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3">Total</th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3 pr-4 sm:pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockOrders.map(order => (
                    <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 sm:px-6 text-sm font-medium text-foreground">{order.id}</td>
                      <td className="py-3 text-sm text-foreground">{order.customer}</td>
                      <td className="py-3 text-sm text-muted-foreground">{order.date}</td>
                      <td className="py-3 text-sm font-medium text-foreground">{order.total}</td>
                      <td className="py-3 pr-4 sm:pr-6">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-foreground">Wholesale Inquiries</h3>
            {mockInquiries.map(inq => (
              <div key={inq.id} className="bg-card border border-border rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-medium text-foreground">{inq.name}</p>
                    <p className="text-sm text-muted-foreground">{inq.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{inq.date}</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{inq.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

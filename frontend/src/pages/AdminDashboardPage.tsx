import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, MessageSquare, BarChart3, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { useQuery } from '@tanstack/react-query';
import { products as allProducts } from '../data/products';
import { toast } from 'sonner';

type AdminTab = 'overview' | 'products' | 'orders' | 'inquiries';

const mockOrders = [
  { id: 'BON-20250001', customer: 'Priya Sharma', total: 1247, status: 'Processing', date: '2025-12-10' },
  { id: 'BON-20250002', customer: 'Ananya Patel', total: 449, status: 'Shipped', date: '2025-11-28' },
  { id: 'BON-20250003', customer: 'Ritu Verma', total: 2890, status: 'Delivered', date: '2025-11-15' },
];

const mockInquiries = [
  { id: 1, name: 'Sunita Joshi', business: 'Aroma Crafts', email: 'sunita@aromacrafts.in', product: 'Soap Making Ingredients', qty: '100 units', date: '2025-12-08' },
  { id: 2, name: 'Meera Krishnan', business: 'Candle Co.', email: 'meera@candleco.in', product: 'Candle Making Supplies', qty: '50 units', date: '2025-12-05' },
];

export default function AdminDashboardPage() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>({});

  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ['isAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return false;
      try { return await actor.isCallerAdmin(); } catch { return false; }
    },
    enabled: !!actor && !!identity,
  });

  if (!identity) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <LayoutDashboard size={48} className="text-muted-foreground mx-auto mb-4" />
      <h2 className="font-serif text-3xl text-charcoal mb-2">Admin Access Required</h2>
      <p className="font-sans text-sm text-muted-foreground mb-6">Please log in with an admin account.</p>
      <a href="#/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-charcoal text-ivory font-sans text-sm tracking-widest hover:bg-gold transition-colors">GO HOME</a>
    </div>
  );

  if (isLoading) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="font-sans text-sm text-muted-foreground">Checking permissions...</p>
    </div>
  );

  if (!isAdmin) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <X size={48} className="text-destructive mx-auto mb-4" />
      <h2 className="font-serif text-3xl text-charcoal mb-2">Access Denied</h2>
      <p className="font-sans text-sm text-muted-foreground mb-6">You do not have admin privileges.</p>
      <a href="#/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-charcoal text-ivory font-sans text-sm tracking-widest hover:bg-gold transition-colors">GO HOME</a>
    </div>
  );

  const updateOrderStatus = (id: string, status: string) => {
    setOrderStatuses(prev => ({ ...prev, [id]: status }));
    toast.success(`Order ${id} updated to ${status}`);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  ] as const;

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-charcoal py-8 border-b border-ivory/10">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl text-ivory">Admin Dashboard</h1>
          <p className="font-sans text-xs text-ivory/50 mt-1">BONITARA Management Console</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-sans text-sm transition-colors ${tab === item.id ? 'bg-charcoal text-ivory' : 'text-charcoal hover:bg-beige'}`}
                >
                  <item.icon size={16} /> {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-4">
            {tab === 'overview' && (
              <div>
                <h2 className="font-serif text-2xl text-charcoal mb-6">Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Products', value: allProducts.length, icon: Package },
                    { label: 'Total Orders', value: mockOrders.length, icon: ShoppingBag },
                    { label: 'Inquiries', value: mockInquiries.length, icon: MessageSquare },
                    { label: 'Revenue', value: '₹4,586', icon: BarChart3 },
                  ].map(stat => (
                    <div key={stat.label} className="bg-card border border-border p-5 rounded-sm">
                      <stat.icon size={20} className="text-gold mb-2" />
                      <p className="font-serif text-2xl text-charcoal">{stat.value}</p>
                      <p className="font-sans text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-charcoal">Products ({allProducts.length})</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-charcoal text-ivory font-sans text-xs tracking-widest hover:bg-gold transition-colors">
                    <Plus size={14} /> ADD PRODUCT
                  </button>
                </div>
                <div className="bg-card border border-border rounded-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-sans">
                      <thead className="bg-beige border-b border-border">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium tracking-wide">Product</th>
                          <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium tracking-wide">SKU</th>
                          <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium tracking-wide">Price</th>
                          <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium tracking-wide">Stock</th>
                          <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium tracking-wide">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allProducts.slice(0, 20).map(p => (
                          <tr key={p.id} className="border-b border-border hover:bg-beige/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-sm overflow-hidden bg-beige shrink-0">
                                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-charcoal line-clamp-1 max-w-[180px]">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{p.sku}</td>
                            <td className="px-4 py-3 text-charcoal font-medium">₹{p.price}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 text-xs rounded-sm ${p.stock > 50 ? 'bg-green-50 text-green-700' : p.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                                {p.stock}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button className="p-1.5 hover:text-gold transition-colors"><Edit size={14} /></button>
                                <button className="p-1.5 hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {tab === 'orders' && (
              <div>
                <h2 className="font-serif text-2xl text-charcoal mb-6">Orders</h2>
                <div className="space-y-4">
                  {mockOrders.map(order => (
                    <div key={order.id} className="bg-card border border-border p-5 rounded-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-sans font-medium text-sm text-charcoal">{order.id}</p>
                          <p className="font-sans text-xs text-muted-foreground mt-0.5">{order.customer} · {order.date} · ₹{order.total}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={orderStatuses[order.id] || order.status}
                            onChange={e => updateOrderStatus(order.id, e.target.value)}
                            className="px-3 py-1.5 border border-border bg-background font-sans text-xs focus:outline-none focus:border-gold"
                          >
                            <option>Processing</option>
                            <option>Shipped</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                          </select>
                          <button
                            onClick={() => updateOrderStatus(order.id, orderStatuses[order.id] || order.status)}
                            className="p-1.5 bg-charcoal text-ivory hover:bg-gold transition-colors rounded-sm"
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'inquiries' && (
              <div>
                <h2 className="font-serif text-2xl text-charcoal mb-6">Wholesale Inquiries</h2>
                <div className="space-y-4">
                  {mockInquiries.map(inq => (
                    <div key={inq.id} className="bg-card border border-border p-5 rounded-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <p className="font-sans font-medium text-sm text-charcoal">{inq.name} — {inq.business}</p>
                          <p className="font-sans text-xs text-muted-foreground mt-0.5">{inq.email}</p>
                          <p className="font-sans text-xs text-charcoal-light mt-2">
                            <span className="text-gold font-medium">{inq.product}</span> · {inq.qty}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-sans text-xs text-muted-foreground">{inq.date}</p>
                          <button className="mt-2 px-3 py-1.5 border border-gold text-gold font-sans text-xs hover:bg-gold hover:text-white transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

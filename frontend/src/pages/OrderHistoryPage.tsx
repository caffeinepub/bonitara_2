import React from 'react';
import { Package, ChevronRight } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

const mockOrders = [
  { id: 'BON-20250001', date: '2025-12-10', items: 3, total: 1247, status: 'Delivered' },
  { id: 'BON-20250002', date: '2025-11-28', items: 1, total: 449, status: 'Delivered' },
  { id: 'BON-20250003', date: '2025-11-15', items: 5, total: 2890, status: 'Shipped' },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-50 text-green-700',
  Shipped: 'bg-blue-50 text-blue-700',
  Processing: 'bg-yellow-50 text-yellow-700',
  Cancelled: 'bg-red-50 text-red-700',
};

export default function OrderHistoryPage() {
  const { identity } = useInternetIdentity();

  if (!identity) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <Package size={48} className="text-muted-foreground mx-auto mb-4" />
      <h2 className="font-serif text-3xl text-charcoal mb-2">Please log in</h2>
      <p className="font-sans text-sm text-muted-foreground mb-6">Sign in to view your order history.</p>
      <a href="#/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-charcoal text-ivory font-sans text-sm tracking-widest hover:bg-gold transition-colors">GO HOME</a>
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-beige py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl text-charcoal">My Orders</h1>
          <p className="font-sans text-sm text-muted-foreground mt-1">Track and manage your BONITARA orders</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {mockOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={40} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-serif text-2xl text-charcoal mb-2">No orders yet</p>
            <a href="#/category/soap-making" className="text-gold font-sans text-sm">Start Shopping →</a>
          </div>
        ) : (
          <div className="space-y-4">
            {mockOrders.map(order => (
              <div key={order.id} className="bg-card border border-border p-5 rounded-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-beige flex items-center justify-center shrink-0">
                    <Package size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-sans font-medium text-sm text-charcoal">{order.id}</p>
                    <p className="font-sans text-xs text-muted-foreground mt-0.5">
                      {new Date(order.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })} · {order.items} item{order.items > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-sans font-semibold text-sm text-charcoal">₹{order.total}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-sans rounded-sm ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}>
                      {order.status}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

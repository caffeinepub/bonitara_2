import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useManualAuth } from '../hooks/useManualAuth';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: 'January 15, 2024',
    status: 'delivered',
    total: 1850,
    items: [
      { name: 'Sandalwood Dreams Candle', qty: 2, price: 650 },
      { name: 'Rose Petal Soap Bar', qty: 1, price: 550 },
    ],
  },
  {
    id: 'ORD-2024-002',
    date: 'February 3, 2024',
    status: 'shipped',
    total: 2200,
    items: [
      { name: 'Jasmine Bloom Perfume', qty: 1, price: 1800 },
      { name: 'Lavender Mist Candle', qty: 1, price: 400 },
    ],
  },
  {
    id: 'ORD-2024-003',
    date: 'February 20, 2024',
    status: 'processing',
    total: 950,
    items: [
      { name: 'Ocean Breeze Resin Art', qty: 1, price: 950 },
    ],
  },
];

const statusConfig = {
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-blue-600 bg-blue-50' },
  processing: { label: 'Processing', icon: Clock, color: 'text-amber-600 bg-amber-50' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-600 bg-red-50' },
};

export default function OrderHistoryPage() {
  const { identity } = useInternetIdentity();
  const { isManuallyAuthenticated } = useManualAuth();
  const isAuthenticated = !!identity || isManuallyAuthenticated;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-foreground mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your order history.</p>
          <a href="#/login" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground">Order History</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Track and manage your BONITARA orders</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {mockOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-serif text-xl text-foreground mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
            <a href="#/" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
              Shop Now
            </a>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {mockOrders.map(order => {
              const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.processing;
              const StatusIcon = status.icon;
              return (
                <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  {/* Order header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 border-b border-border bg-muted/20">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground">Order ID</p>
                        <p className="font-medium text-foreground text-sm">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-medium text-foreground text-sm">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="font-medium text-foreground text-sm">₹{order.total.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.color} self-start sm:self-auto`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </div>

                  {/* Order items */}
                  <div className="p-4 sm:p-6">
                    <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 bg-muted rounded-full flex items-center justify-center text-xs text-muted-foreground shrink-0">
                              {item.qty}
                            </span>
                            <span className="text-sm text-foreground truncate">{item.name}</span>
                          </div>
                          <span className="text-sm font-medium text-foreground shrink-0">₹{item.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { User, Package, Heart, LogOut } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useWishlist } from '../App';
import { products } from '../data/products';

export default function ProfilePage() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { wishlist } = useWishlist();
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  const wishlisted = products.filter(p => wishlist.includes(p.id));

  if (!identity) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <User size={48} className="text-muted-foreground mx-auto mb-4" />
      <h2 className="font-serif text-3xl text-charcoal mb-2">Please log in</h2>
      <p className="font-sans text-sm text-muted-foreground mb-6">Sign in to view your profile and orders.</p>
      <a href="#/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-charcoal text-ivory font-sans text-sm tracking-widest hover:bg-gold transition-colors">
        GO HOME
      </a>
    </div>
  );

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    window.location.hash = '/';
  };

  const principalStr = identity.getPrincipal().toString();

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-beige py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-charcoal flex items-center justify-center">
              <User size={28} className="text-ivory" />
            </div>
            <div>
              <h1 className="font-serif text-3xl text-charcoal">My Account</h1>
              <p className="font-sans text-xs text-muted-foreground mt-1 truncate max-w-xs">
                {principalStr.slice(0, 24)}...
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            {[
              { icon: User, label: 'Profile', href: '#/profile' },
              { icon: Package, label: 'My Orders', href: '#/orders' },
              { icon: Heart, label: 'Wishlist', href: '#/profile' },
            ].map(item => (
              <a key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-sm hover:border-gold transition-colors font-sans text-sm text-charcoal">
                <item.icon size={16} className="text-gold" /> {item.label}
              </a>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-sm hover:border-destructive transition-colors font-sans text-sm text-charcoal">
              <LogOut size={16} className="text-destructive" /> Logout
            </button>
          </div>

          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile form */}
            <div className="bg-card border border-border p-6 rounded-sm">
              <h2 className="font-serif text-xl text-charcoal mb-4">Profile Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-sans text-xs text-charcoal mb-1.5 tracking-wide">Display Name</label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2.5 border border-border bg-background font-sans text-sm focus:outline-none focus:border-gold transition-colors max-w-sm"
                  />
                </div>
                <button
                  onClick={() => setSaved(true)}
                  className="px-6 py-2.5 bg-charcoal text-ivory font-sans text-sm tracking-widest hover:bg-gold transition-colors"
                >
                  {saved ? 'SAVED ✓' : 'SAVE CHANGES'}
                </button>
              </div>
            </div>

            {/* Wishlist */}
            <div className="bg-card border border-border p-6 rounded-sm">
              <h2 className="font-serif text-xl text-charcoal mb-4">My Wishlist ({wishlisted.length})</h2>
              {wishlisted.length === 0 ? (
                <p className="font-sans text-sm text-muted-foreground">Your wishlist is empty. Browse products and add your favorites.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wishlisted.map(p => (
                    <a key={p.id} href={`#/product/${p.id}`} className="flex gap-3 p-3 border border-border rounded-sm hover:border-gold transition-colors">
                      <div className="w-12 h-12 shrink-0 overflow-hidden rounded-sm bg-beige">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-sans text-xs text-charcoal line-clamp-1">{p.name}</p>
                        <p className="font-sans text-xs text-gold font-medium mt-0.5">₹{p.price}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useManualAuth } from '../hooks/useManualAuth';
import { useActor } from '../hooks/useActor';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWishlist } from '../App';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Loader2, Edit2, Save, X, User, Heart, Package } from 'lucide-react';
import type { UserProfile } from '../backend';

function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { isManuallyAuthenticated, manualUser } = useManualAuth();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { items: wishlistIds } = useWishlist();

  const isAuthenticated = !!identity || isManuallyAuthenticated;

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [setupName, setSetupName] = useState(manualUser?.name || '');
  const [setupEmail, setSetupEmail] = useState(manualUser?.email || '');
  const [activeTab, setActiveTab] = useState<'profile' | 'wishlist' | 'orders'>('profile');

  // For manual auth users, we show a simplified profile
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null && !!identity;

  const saveMutation = useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      setIsEditing(false);
    },
  });

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupName.trim()) return;
    saveMutation.mutate({ name: setupName.trim(), email: setupEmail.trim() });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    saveMutation.mutate({ name: editName.trim(), email: editEmail.trim() });
  };

  const startEdit = () => {
    const profile = userProfile || (manualUser ? { name: manualUser.name, email: manualUser.email } : null);
    setEditName(profile?.name || '');
    setEditEmail(profile?.email || '');
    setIsEditing(true);
  };

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  // Determine display profile
  const displayProfile = userProfile || (manualUser ? { name: manualUser.name, email: manualUser.email } : null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-foreground mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your profile.</p>
          <a href="#/login" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Profile setup modal for II users
  if (showProfileSetup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-foreground mb-2">Complete Your Profile</h2>
          <p className="text-muted-foreground text-sm mb-6">Tell us a bit about yourself to get started.</p>
          <form onSubmit={handleSetupSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
              <input
                type="text"
                value={setupName}
                onChange={e => setSetupName(e.target.value)}
                placeholder="Your name"
                className="w-full h-11 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <input
                type="email"
                value={setupEmail}
                onChange={e => setSetupEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full h-11 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="w-full h-11 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saveMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-muted/30 border-b border-border py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground truncate">
                {displayProfile?.name || 'My Account'}
              </h1>
              {displayProfile?.email && (
                <p className="text-muted-foreground text-sm mt-0.5 truncate">{displayProfile.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-background sticky top-16 sm:top-20 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'wishlist', label: `Wishlist (${wishlistIds.length})`, icon: Heart },
              { id: 'orders', label: 'Orders', icon: Package },
            ].map(tab => (
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
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-lg">
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <h2 className="font-serif text-xl text-foreground mb-4">Edit Profile</h2>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 min-h-[44px]"
                  >
                    {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors min-h-[44px]"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl text-foreground">Profile Information</h2>
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg text-sm hover:bg-muted transition-colors min-h-[44px]"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                    <p className="text-foreground font-medium">{displayProfile?.name || '—'}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Email Address</p>
                    <p className="text-foreground font-medium">{displayProfile?.email || '—'}</p>
                  </div>
                  {manualUser?.isAdmin && (
                    <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                      <p className="text-xs text-primary mb-1">Role</p>
                      <p className="text-primary font-medium">Administrator</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div>
            <h2 className="font-serif text-xl text-foreground mb-6">My Wishlist</h2>
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your wishlist is empty.</p>
                <a href="#/" className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Explore Products
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {wishlistProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="font-serif text-xl text-foreground mb-6">Order History</h2>
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders yet.</p>
              <a href="#/" className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Start Shopping
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

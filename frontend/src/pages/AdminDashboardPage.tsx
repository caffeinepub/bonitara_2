import { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Product, ProductInput } from '../backend';
import { Package, ShoppingBag, MessageSquare, LayoutDashboard, LogOut, Plus, Search, RefreshCw, Edit2, Trash2, Eye, EyeOff, X } from 'lucide-react';

// ── helpers ──────────────────────────────────────────────────────────────────
const CATEGORIES = ['Soap Making', 'Candle Making', 'Resin Art', 'Fragrance'];

const emptyForm = (): ProductInput => ({
  name: '',
  sku: '',
  description: '',
  price: 0n,
  stock: 0n,
  category: '',
  imageUrl: '',
});

// ── sub-components ────────────────────────────────────────────────────────────
function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm">
      <div className="p-3 bg-amber-50 rounded-lg text-amber-700">{icon}</div>
      <div>
        <p className="text-xs text-stone-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-stone-800">{value}</p>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { actor, isFetching: actorFetching } = useActor();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inquiries'>('overview');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [addingProduct, setAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyForm());
  const [formError, setFormError] = useState('');

  // ── queries ──────────────────────────────────────────────────────────────
  const { data: products = [], isLoading, refetch } = useQuery<Product[]>({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProductsAdmin();
    },
    enabled: !!actor && !actorFetching,
  });

  // ── mutations ─────────────────────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: async (input: ProductInput) => {
      if (!actor) throw new Error('No actor');
      return actor.addProduct(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setAddingProduct(false);
      setForm(emptyForm());
      setFormError('');
    },
    onError: (e: any) => setFormError(e.message ?? 'Failed to add product'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: ProductInput }) => {
      if (!actor) throw new Error('No actor');
      return actor.updateProduct(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingProduct(null);
      setForm(emptyForm());
      setFormError('');
    },
    onError: (e: any) => setFormError(e.message ?? 'Failed to update product'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('No actor');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // ── derived ───────────────────────────────────────────────────────────────
  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const visibleProducts = products.filter(p => p.isVisible);
  const totalStock = products.reduce((s, p) => s + Number(p.stock), 0);

  // ── form helpers ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyForm());
    setFormError('');
    setEditingProduct(null);
    setAddingProduct(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      sku: p.sku,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category,
      imageUrl: p.imageUrl,
    });
    setFormError('');
    setAddingProduct(false);
    setEditingProduct(p);
  };

  const closeForm = () => {
    setAddingProduct(false);
    setEditingProduct(null);
    setForm(emptyForm());
    setFormError('');
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.sku.trim() || !form.category) {
      setFormError('Name, SKU, and Category are required.');
      return;
    }
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, input: form });
    } else {
      addMutation.mutate(form);
    }
  };

  const isMutating = addMutation.isPending || updateMutation.isPending;

  // ── product form panel ────────────────────────────────────────────────────
  const ProductForm = ({ title }: { title: string }) => (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-16">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 my-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-stone-800">{title}</h2>
          <button onClick={closeForm} className="p-1 rounded-lg hover:bg-stone-100 text-stone-500">
            <X size={20} />
          </button>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{formError}</div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-stone-700 mb-1">Name *</label>
            <input
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              placeholder="Product name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-stone-700 mb-1">SKU *</label>
            <input
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              placeholder="SKU-001"
              value={form.sku}
              onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white resize-none"
              rows={3}
              placeholder="Product description..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-stone-700 mb-1">Price (₹) *</label>
            <input
              type="number"
              min={0}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              placeholder="0"
              value={Number(form.price)}
              onChange={e => setForm(f => ({ ...f, price: BigInt(Math.max(0, parseInt(e.target.value) || 0)) }))}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-stone-700 mb-1">Stock *</label>
            <input
              type="number"
              min={0}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              placeholder="0"
              value={Number(form.stock)}
              onChange={e => setForm(f => ({ ...f, stock: BigInt(Math.max(0, parseInt(e.target.value) || 0)) }))}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">Category *</label>
            <select
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
            <input
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={isMutating}
            className="flex-1 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            {isMutating && <RefreshCw size={14} className="animate-spin" />}
            {editingProduct ? 'Save Changes' : 'Add Product'}
          </button>
          <button
            onClick={closeForm}
            disabled={isMutating}
            className="flex-1 border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={22} className="text-amber-700" />
          <span className="font-bold text-stone-800 text-lg">Bonitara Admin</span>
        </div>
        <button
          onClick={async () => { await clear(); queryClient.clear(); window.location.hash = '/'; }}
          className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </header>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-40 flex">
        {(['overview', 'products', 'orders', 'inquiries'] as const).map(tab => {
          const icons = { overview: <LayoutDashboard size={20} />, products: <Package size={20} />, orders: <ShoppingBag size={20} />, inquiries: <MessageSquare size={20} /> };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${activeTab === tab ? 'text-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
            >
              {icons[tab]}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="pb-24 px-4 pt-6 max-w-4xl mx-auto">

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-stone-800">Overview</h1>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-stone-200 rounded-xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Total Products" value={products.length} icon={<Package size={20} />} />
                <StatCard label="Visible" value={visibleProducts.length} icon={<Eye size={20} />} />
                <StatCard label="Total Stock" value={totalStock} icon={<ShoppingBag size={20} />} />
                <StatCard label="Categories" value={CATEGORIES.length} icon={<LayoutDashboard size={20} />} />
              </div>
            )}
          </div>
        )}

        {/* Products tab */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-stone-800">Products</h1>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  placeholder="Search by name or SKU..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="">All</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button
                onClick={() => refetch()}
                className="p-2 border border-stone-300 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Product list */}
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-stone-200 rounded-xl animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-stone-500">
                <Package size={40} className="mx-auto mb-3 opacity-30" />
                <p>No products found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(p => (
                  <div key={p.id.toString()} className={`bg-white rounded-xl border border-stone-200 p-4 flex gap-3 shadow-sm ${!p.isVisible ? 'opacity-60' : ''}`}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-cover rounded-lg shrink-0 bg-stone-100" />
                    ) : (
                      <div className="w-16 h-16 bg-stone-100 rounded-lg shrink-0 flex items-center justify-center">
                        <Package size={20} className="text-stone-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-800 truncate">{p.name}</p>
                          <p className="text-xs text-stone-500">{p.sku} · {p.category}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-700 transition-colors" title="Edit">
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => deleteMutation.mutate(p.id)}
                            disabled={deleteMutation.isPending}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-sm font-bold text-amber-700">₹{Number(p.price)}</span>
                        <span className="text-xs text-stone-500">Stock: {Number(p.stock)}</span>
                        {!p.isVisible && <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full flex items-center gap-1"><EyeOff size={10} /> Hidden</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-stone-800">Orders</h1>
            <div className="text-center py-16 text-stone-500">
              <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
              <p>No orders yet.</p>
            </div>
          </div>
        )}

        {/* Inquiries tab */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-stone-800">Inquiries</h1>
            <div className="text-center py-16 text-stone-500">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
              <p>No inquiries yet.</p>
            </div>
          </div>
        )}
      </main>

      {/* Product form modal — rendered as fixed overlay with solid white background */}
      {(addingProduct || editingProduct) && (
        <ProductForm title={editingProduct ? 'Edit Product' : 'Add New Product'} />
      )}
    </div>
  );
}

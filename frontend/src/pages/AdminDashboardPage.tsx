import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Category, Product } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Package,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Plus,
  Pencil,
  Trash2,
  Eye,
  LogOut,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// ─── helpers ────────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: Category.candleMaking, label: 'Candle Making' },
  { value: Category.soapMaking, label: 'Soap Making' },
  { value: Category.fragrance, label: 'Fragrance' },
  { value: Category.resinArt, label: 'Resin Art' },
];

const categoryLabel = (cat: string) => {
  const map: Record<string, string> = {
    candleMaking: 'Candle Making',
    soapMaking: 'Soap Making',
    fragrance: 'Fragrance',
    resinArt: 'Resin Art',
    candle_making: 'Candle Making',
    soap_making: 'Soap Making',
    resin_art: 'Resin Art',
    fragrances: 'Fragrance',
  };
  return map[cat] ?? cat;
};

const resolveImageUrl = (url: string) => {
  if (!url) return '/assets/generated/candle-soy-jar.dim_600x600.png';
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/assets/generated/${url}`;
};

// ─── types ───────────────────────────────────────────────────────────────────

interface AddProductForm {
  name: string;
  description: string;
  price: string;
  category: string; // use string so empty string is valid for the form state
  stock: string;
  imageUrl: string;
}

interface AddProductFormErrors {
  name?: string;
  price?: string;
  category?: string;
}

interface EditProductForm {
  name: string;
  description: string;
  price: string;
  sku: string;
  category: string;
  stock: string;
  imageUrl: string;
}

const emptyAddForm = (): AddProductForm => ({
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  imageUrl: '',
});

// ─── component ───────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  // ── state ──
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<AddProductForm>(emptyAddForm());
  const [addErrors, setAddErrors] = useState<AddProductFormErrors>({});

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<EditProductForm>({
    name: '', description: '', price: '', sku: '', category: '', stock: '', imageUrl: '',
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<bigint | null>(null);

  const [activeTab, setActiveTab] = useState('overview');

  // ── queries ──
  const { actor: actorForQuery, isFetching: actorFetching } = useActor();

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      if (!actorForQuery) return [];
      return actorForQuery.getAllProductsAdmin();
    },
    enabled: !!actorForQuery && !actorFetching,
  });

  // ── mutations ──

  const addProductMutation = useMutation({
    mutationFn: async (form: AddProductForm) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.adminAddProduct({
        name: form.name,
        description: form.description,
        price: BigInt(Math.round(parseFloat(form.price) * 100)),
        category: form.category as Category,
        stock: BigInt(parseInt(form.stock, 10) || 0),
        imageUrl: form.imageUrl || '',
      });
      if (result.__kind__ === 'err') throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added successfully!');
      setShowAddModal(false);
      setAddForm(emptyAddForm());
      setAddErrors({});
    },
    onError: (err: Error) => {
      toast.error(`Failed to add product: ${err.message}`);
    },
  });

  const editProductMutation = useMutation({
    mutationFn: async ({ id, form }: { id: bigint; form: EditProductForm }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.updateProduct(id, {
        name: form.name,
        description: form.description,
        price: BigInt(Math.round(parseFloat(form.price) * 100)),
        sku: form.sku,
        stock: BigInt(parseInt(form.stock, 10) || 0),
        category: form.category,
        imageUrl: form.imageUrl,
      });
      if (result.__kind__ === 'err') throw new Error(result.err.error);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully!');
      setShowEditModal(false);
      setEditingProduct(null);
    },
    onError: (err: Error) => {
      toast.error(`Failed to update product: ${err.message}`);
    },
  });

  const visibilityMutation = useMutation({
    mutationFn: async ({ id, visible }: { id: bigint; visible: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.updateProductVisibility(id, visible);
      if (result.__kind__ === 'err') throw new Error(result.err.error);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: Error) => {
      toast.error(`Failed to update visibility: ${err.message}`);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.deleteProduct(id);
      if (result.__kind__ === 'err') throw new Error(result.err.error);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully!');
      setShowDeleteDialog(false);
      setDeletingProductId(null);
    },
    onError: (err: Error) => {
      toast.error(`Failed to delete product: ${err.message}`);
    },
  });

  // ── validation ──

  const validateAddForm = (): boolean => {
    const errors: AddProductFormErrors = {};
    if (!addForm.name.trim()) errors.name = 'Name is required';
    if (!addForm.price || isNaN(parseFloat(addForm.price)) || parseFloat(addForm.price) <= 0)
      errors.price = 'Valid price is required';
    if (!addForm.category) errors.category = 'Category is required';
    setAddErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── handlers ──

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddForm()) return;
    addProductMutation.mutate(addForm);
  };

  const handleEditOpen = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: (Number(product.price) / 100).toFixed(2),
      sku: product.sku,
      category: product.category,
      stock: product.stock.toString(),
      imageUrl: product.imageUrl,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    editProductMutation.mutate({ id: editingProduct.id, form: editForm });
  };

  const handleDeleteConfirm = () => {
    if (deletingProductId !== null) {
      deleteProductMutation.mutate(deletingProductId);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminSession');
    window.location.hash = '/admin/login';
  };

  // ── stats ──
  const totalProducts = products.length;
  const visibleProducts = products.filter(p => p.isVisible).length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.stock), 0);

  // ── render ──

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/bonitara-logo.dim_400x120.png" alt="Bonitara" className="h-8 object-contain" />
            <span className="text-sm font-medium text-muted-foreground border-l border-border pl-3">Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" /> Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="w-4 h-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="gap-2">
              <MessageSquare className="w-4 h-4" /> Inquiries
            </TabsTrigger>
          </TabsList>

          {/* ── Overview ── */}
          <TabsContent value="overview">
            <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard icon={<Package className="w-6 h-6" />} label="Total Products" value={totalProducts} />
              <StatCard icon={<Eye className="w-6 h-6" />} label="Visible Products" value={visibleProducts} />
              <StatCard icon={<ShoppingCart className="w-6 h-6" />} label="Total Stock Units" value={totalStock} />
            </div>
          </TabsContent>

          {/* ── Products ── */}
          <TabsContent value="products">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Product Management</h2>
              <Button
                onClick={() => { setAddForm(emptyAddForm()); setAddErrors({}); setShowAddModal(true); }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </Button>
            </div>

            {productsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No products yet. Add your first product!</p>
              </div>
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Visible</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product.id.toString()}>
                        <TableCell>
                          <img
                            src={resolveImageUrl(product.imageUrl)}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={e => {
                              (e.target as HTMLImageElement).src = '/assets/generated/candle-soy-jar.dim_600x600.png';
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{categoryLabel(product.category)}</Badge>
                        </TableCell>
                        <TableCell>₹{(Number(product.price) / 100).toFixed(2)}</TableCell>
                        <TableCell>{product.stock.toString()}</TableCell>
                        <TableCell>
                          <Switch
                            checked={product.isVisible}
                            onCheckedChange={v => visibilityMutation.mutate({ id: product.id, visible: v })}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditOpen(product)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => { setDeletingProductId(product.id); setShowDeleteDialog(true); }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* ── Orders ── */}
          <TabsContent value="orders">
            <h2 className="text-2xl font-semibold mb-6">Orders</h2>
            <div className="text-center py-16 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No orders yet.</p>
            </div>
          </TabsContent>

          {/* ── Inquiries ── */}
          <TabsContent value="inquiries">
            <h2 className="text-2xl font-semibold mb-6">Inquiries</h2>
            <div className="text-center py-16 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No inquiries yet.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Add Product Modal ── */}
      <Dialog
        open={showAddModal}
        onOpenChange={open => { if (!addProductMutation.isPending) setShowAddModal(open); }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Fill in the details below to add a new product to the catalog.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 mt-2">
            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="add-name">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="add-name"
                value={addForm.name}
                onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Soy Wax Candle Kit"
              />
              {addErrors.name && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{addErrors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label htmlFor="add-desc">Description</Label>
              <Textarea
                id="add-desc"
                value={addForm.description}
                onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Product description..."
                rows={3}
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <Label htmlFor="add-price">
                Price (₹) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="add-price"
                type="number"
                min="0"
                step="0.01"
                value={addForm.price}
                onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))}
                placeholder="e.g. 499.00"
              />
              {addErrors.price && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{addErrors.price}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1">
              <Label>
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={addForm.category}
                onValueChange={v => setAddForm(f => ({ ...f, category: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {addErrors.category && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{addErrors.category}
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="space-y-1">
              <Label htmlFor="add-stock">Stock Quantity</Label>
              <Input
                id="add-stock"
                type="number"
                min="0"
                step="1"
                value={addForm.stock}
                onChange={e => setAddForm(f => ({ ...f, stock: e.target.value }))}
                placeholder="e.g. 50"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-1">
              <Label htmlFor="add-image">Image URL</Label>
              <Input
                id="add-image"
                value={addForm.imageUrl}
                onChange={e => setAddForm(f => ({ ...f, imageUrl: e.target.value }))}
                placeholder="e.g. /assets/generated/candle-soy-jar.dim_600x600.png"
              />
              <p className="text-xs text-muted-foreground">Leave blank to use a default image.</p>
            </div>

            {/* Preview */}
            {addForm.imageUrl && (
              <div className="rounded-lg overflow-hidden border border-border h-32 flex items-center justify-center bg-muted">
                <img
                  src={resolveImageUrl(addForm.imageUrl)}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).src = '/assets/generated/candle-soy-jar.dim_600x600.png';
                  }}
                />
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddModal(false)}
                disabled={addProductMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addProductMutation.isPending} className="gap-2">
                {addProductMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {addProductMutation.isPending ? 'Adding…' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Edit Product Modal ── */}
      <Dialog
        open={showEditModal}
        onOpenChange={open => { if (!editProductMutation.isPending) setShowEditModal(open); }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea
                id="edit-desc"
                value={editForm.description}
                onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-price">Price (₹)</Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                value={editForm.price}
                onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-sku">SKU</Label>
              <Input
                id="edit-sku"
                value={editForm.sku}
                onChange={e => setEditForm(f => ({ ...f, sku: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <Select
                value={editForm.category}
                onValueChange={v => setEditForm(f => ({ ...f, category: v }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                  <SelectItem value="candle_making">Candle Making (legacy)</SelectItem>
                  <SelectItem value="soap_making">Soap Making (legacy)</SelectItem>
                  <SelectItem value="resin_art">Resin Art (legacy)</SelectItem>
                  <SelectItem value="fragrances">Fragrance (legacy)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-stock">Stock Quantity</Label>
              <Input
                id="edit-stock"
                type="number"
                min="0"
                step="1"
                value={editForm.stock}
                onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-image">Image URL</Label>
              <Input
                id="edit-image"
                value={editForm.imageUrl}
                onChange={e => setEditForm(f => ({ ...f, imageUrl: e.target.value }))}
              />
            </div>
            {editForm.imageUrl && (
              <div className="rounded-lg overflow-hidden border border-border h-32 flex items-center justify-center bg-muted">
                <img
                  src={resolveImageUrl(editForm.imageUrl)}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).src = '/assets/generated/candle-soy-jar.dim_600x600.png';
                  }}
                />
              </div>
            )}
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
                disabled={editProductMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editProductMutation.isPending} className="gap-2">
                {editProductMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {editProductMutation.isPending ? 'Saving…' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <Dialog
        open={showDeleteDialog}
        onOpenChange={open => { if (!deleteProductMutation.isPending) setShowDeleteDialog(open); }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteProductMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteProductMutation.isPending}
              className="gap-2"
            >
              {deleteProductMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {deleteProductMutation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── StatCard ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
      <div className="p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

interface Props { slug: string; }

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

export default function CategoryPage({ slug }: Props) {
  const category = categories.find(c => c.slug === slug);
  const [sort, setSort] = useState<SortOption>('default');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const catKey = slug as 'soap-making' | 'candle-making' | 'resin-art' | 'fragrance';
  const filtered = useMemo(() => {
    let list = products.filter(p => p.category === catKey && p.price <= maxPrice);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === 'name-asc') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [catKey, sort, maxPrice]);

  if (!category) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="font-serif text-3xl text-charcoal">Category not found</h2>
      <a href="#/" className="text-gold font-sans text-sm mt-4 inline-block">← Back to Home</a>
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative h-48 md:h-64 overflow-hidden bg-charcoal">
        <img src={category.image} alt={category.name} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-2">Collection</p>
          <h1 className="font-serif text-4xl md:text-5xl text-ivory">{category.name}</h1>
          <p className="font-sans text-ivory/60 text-sm mt-2 max-w-md">{category.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
          <p className="font-sans text-sm text-muted-foreground">{filtered.length} products</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-sans hover:border-gold transition-colors"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="px-4 py-2 border border-border bg-card text-sm font-sans focus:outline-none focus:border-gold"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A–Z</option>
            </select>
          </div>
        </div>

        {/* Filters panel */}
        {filtersOpen && (
          <div className="bg-card border border-border p-6 mb-8 rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-charcoal">Filters</h3>
              <button onClick={() => setFiltersOpen(false)}><X size={16} /></button>
            </div>
            <div className="max-w-xs">
              <label className="font-sans text-sm text-charcoal block mb-2">
                Max Price: <span className="text-gold font-medium">₹{maxPrice}</span>
              </label>
              <input
                type="range" min={100} max={2000} step={50}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-sans mt-1">
                <span>₹100</span><span>₹2000</span>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-charcoal mb-2">No products found</p>
            <p className="font-sans text-sm text-muted-foreground">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

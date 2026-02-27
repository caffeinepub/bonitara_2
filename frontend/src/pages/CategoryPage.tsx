import React, { useState, useEffect } from 'react';
import { useActor } from '../hooks/useActor';
import { Product } from '../backend';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

interface CategoryPageProps {
  category: string;
}

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'soap-making': 'Soap Making',
  'candle-making': 'Candle Making',
  'resin-art': 'Resin Art',
  'fragrance': 'Fragrance',
  'soap': 'Soap Making',
  'candle': 'Candle Making',
  'resin': 'Resin Art',
  'Soap Making': 'Soap Making',
  'Candle Making': 'Candle Making',
  'Resin Art': 'Resin Art',
  'Fragrance': 'Fragrance',
};

const CATEGORY_IMAGES: Record<string, string> = {
  'soap-making': '/assets/generated/category-soap.dim_600x400.png',
  'candle-making': '/assets/generated/category-candle.dim_600x400.png',
  'resin-art': '/assets/generated/category-resin.dim_600x400.png',
  'fragrance': '/assets/generated/category-fragrance.dim_600x400.png',
  'soap': '/assets/generated/category-soap.dim_600x400.png',
  'candle': '/assets/generated/category-candle.dim_600x400.png',
  'resin': '/assets/generated/category-resin.dim_600x400.png',
};

// Map URL slug to backend category string
function getCategoryBackendName(slug: string): string {
  const map: Record<string, string> = {
    'soap-making': 'Soap Making',
    'candle-making': 'Candle Making',
    'resin-art': 'Resin Art',
    'fragrance': 'Fragrance',
    'soap': 'Soap Making',
    'candle': 'Candle Making',
    'resin': 'Resin Art',
  };
  // If it's already a display name, return as-is
  if (Object.values(map).includes(slug)) return slug;
  return map[slug] || slug;
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const { actor, isFetching: actorFetching } = useActor();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [maxPrice, setMaxPrice] = useState(100000);

  const backendCategory = getCategoryBackendName(category);
  const displayName = CATEGORY_DISPLAY_NAMES[category] || backendCategory;
  const categoryImage = CATEGORY_IMAGES[category];

  useEffect(() => {
    if (!actor || actorFetching) return;

    setLoading(true);
    setError(null);

    actor.getProductsByCategory(backendCategory)
      .then(result => {
        setProducts(result);
        if (result.length > 0) {
          const max = Math.max(...result.map(p => Number(p.price)));
          setMaxPrice(max);
          setPriceRange([0, max]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products by category:', err);
        setError('Failed to load products. Please try again.');
        setLoading(false);
      });
  }, [actor, actorFetching, backendCategory]);

  const filteredProducts = products
    .filter(p => {
      const price = Number(p.price);
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Category Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        {categoryImage ? (
          <img
            src={categoryImage}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-primary/10" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="font-display text-3xl md:text-5xl mb-2">{displayName}</h1>
            <p className="font-body text-white/80">
              {loading ? '...' : `${filteredProducts.length} products`}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
            <SlidersHorizontal className="w-4 h-4" />
            <span>
              {loading ? 'Loading...' : `Showing ${filteredProducts.length} of ${products.length} products`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-body text-muted-foreground">Sort by:</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none bg-background border border-border rounded-sm px-3 py-1.5 pr-8 text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-sm" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive font-body mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-sm font-body hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground font-body mb-6">
              {products.length === 0
                ? `No products are available in the "${displayName}" category yet.`
                : 'No products match your current filters.'}
            </p>
            <a
              href="#/"
              className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-sm font-body hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id.toString()} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

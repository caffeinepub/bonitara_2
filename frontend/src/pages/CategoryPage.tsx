import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Product } from '../backend';
import ProductCard from '../components/ProductCard';
import { useCart, useWishlist } from '../App';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal } from 'lucide-react';

interface CategoryPageProps {
  category: string;
}

// Maps URL slug → all possible backend category strings (both new camelCase and legacy snake_case)
const slugToCategoryStrings: Record<string, string[]> = {
  'candle-making': ['candleMaking', 'candle_making'],
  'soap-making': ['soapMaking', 'soap_making'],
  'fragrance': ['fragrance', 'fragrances'],
  'resin-art': ['resinArt', 'resin_art'],
};

const slugToDisplayName: Record<string, string> = {
  'candle-making': 'Candle Making',
  'soap-making': 'Soap Making',
  'fragrance': 'Fragrance',
  'resin-art': 'Resin Art',
};

const slugToBannerImage: Record<string, string> = {
  'candle-making': '/assets/generated/category-candle.dim_600x400.png',
  'soap-making': '/assets/generated/category-soap.dim_600x400.png',
  'fragrance': '/assets/generated/category-fragrance.dim_600x400.png',
  'resin-art': '/assets/generated/category-resin.dim_600x400.png',
};

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const arr = [...products];
  switch (sort) {
    case 'price-asc': return arr.sort((a, b) => Number(a.price) - Number(b.price));
    case 'price-desc': return arr.sort((a, b) => Number(b.price) - Number(a.price));
    case 'name-asc': return arr.sort((a, b) => a.name.localeCompare(b.name));
    default: return arr;
  }
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const { actor, isFetching: actorFetching } = useActor();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [sort, setSort] = useState<SortOption>('default');

  // Normalize the slug — strip any trailing /product/... segment
  const slug = category.replace(/\/product\/.*$/, '');

  const categoryStrings = slugToCategoryStrings[slug] ?? [slug];
  const displayName = slugToDisplayName[slug] ?? slug;
  const bannerImage = slugToBannerImage[slug] ?? '/assets/generated/category-candle.dim_600x400.png';

  // Fetch all products and filter client-side to handle both legacy and new category strings
  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !actorFetching,
  });

  const products = allProducts.filter(p => categoryStrings.includes(p.category));
  const sorted = sortProducts(products, sort);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img src={bannerImage} alt={displayName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-sm uppercase tracking-widest mb-2 opacity-80">Shop</p>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold">{displayName}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <a href="#/" className="hover:text-primary transition-colors">Home</a>
          <span className="mx-2">/</span>
          <span className="text-foreground">{displayName}</span>
        </nav>

        {/* Sort bar */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Loading…' : `${sorted.length} product${sorted.length !== 1 ? 's' : ''}`}
          </p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <Select value={sort} onValueChange={v => setSort(v as SortOption)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No products found in this category.</p>
            <a href="#/" className="mt-4 inline-block text-primary hover:underline">Back to Home</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {sorted.map(product => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                isWishlisted={isWishlisted(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

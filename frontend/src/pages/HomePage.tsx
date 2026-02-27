import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Product } from '../backend';
import ProductCard from '../components/ProductCard';
import { useCart, useWishlist } from '../App';
import { useAllProductRatings } from '../hooks/useProductReviews';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, ArrowRight, Flame, Leaf, Sparkles, Droplets } from 'lucide-react';

// ─── hero slides ─────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    image: '/assets/generated/hero-banner.dim_1920x900.png',
    title: 'Craft Your Perfect Candle',
    subtitle: 'Premium soy wax, fragrance oils, and everything you need to create beautiful candles at home.',
    cta: 'Shop Candle Making',
    href: '#/category/candle-making',
  },
  {
    image: '/assets/generated/category-soap.dim_600x400.png',
    title: 'Artisan Soap Supplies',
    subtitle: 'Cold process, melt & pour, and specialty soap bases for every skill level.',
    cta: 'Shop Soap Making',
    href: '#/category/soap-making',
  },
  {
    image: '/assets/generated/category-fragrance.dim_600x400.png',
    title: 'Signature Fragrances',
    subtitle: 'Explore our curated collection of essential oils and fragrance blends.',
    cta: 'Shop Fragrance',
    href: '#/category/fragrance',
  },
];

// ─── categories ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  { slug: 'candle-making', label: 'Candle Making', image: '/assets/generated/category-candle.dim_600x400.png', icon: <Flame className="w-5 h-5" /> },
  { slug: 'soap-making', label: 'Soap Making', image: '/assets/generated/category-soap.dim_600x400.png', icon: <Leaf className="w-5 h-5" /> },
  { slug: 'fragrance', label: 'Fragrance', image: '/assets/generated/category-fragrance.dim_600x400.png', icon: <Sparkles className="w-5 h-5" /> },
  { slug: 'resin-art', label: 'Resin Art', image: '/assets/generated/category-resin.dim_600x400.png', icon: <Droplets className="w-5 h-5" /> },
];

// ─── features ────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹999' },
  { icon: '🌿', title: 'Natural Ingredients', desc: 'Ethically sourced materials' },
  { icon: '🎨', title: 'Expert Guidance', desc: 'Tutorials & recipes included' },
  { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
];

// ─── testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  { name: 'Priya S.', text: 'The soy wax flakes are absolutely top quality. My candles have never looked better!', rating: 5 },
  { name: 'Rahul M.', text: 'Fast shipping and great packaging. The fragrance oils smell divine.', rating: 5 },
  { name: 'Ananya K.', text: 'Bonitara has everything I need for my soap-making hobby. Highly recommend!', rating: 5 },
];

// ─── component ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const { actor, isFetching: actorFetching } = useActor();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { data: ratingsMap } = useAllProductRatings();

  const [heroIndex, setHeroIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !actorFetching,
  });

  const featured = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Slider ── */}
      <section className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <div className="text-center text-white max-w-2xl px-6">
                <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-4 leading-tight">{slide.title}</h1>
                <p className="text-base sm:text-lg mb-8 opacity-90">{slide.subtitle}</p>
                <a
                  href={slide.href}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  {slide.cta} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
        {/* Arrows */}
        <button
          onClick={() => setHeroIndex(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setHeroIndex(i => (i + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === heroIndex ? 'bg-white w-6' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* ── Features Bar ── */}
      <section className="bg-primary text-primary-foreground py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-center gap-3">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-xs opacity-80">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-primary mb-2">Browse</p>
          <h2 className="text-3xl font-serif font-bold">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {CATEGORIES.map(cat => (
            <a
              key={cat.slug}
              href={`#/category/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] block"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/50 transition-colors flex flex-col items-center justify-center text-white gap-2">
                {cat.icon}
                <span className="font-semibold text-sm sm:text-base">{cat.label}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-widest text-primary mb-2">Bestsellers</p>
            <h2 className="text-3xl font-serif font-bold">Featured Products</h2>
          </div>

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
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map(product => {
                // ratingsMap is Map<number, number> — the value is the average rating directly
                const avgRating = ratingsMap?.get(Number(product.id)) ?? null;
                return (
                  <ProductCard
                    key={product.id.toString()}
                    product={product}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={isWishlisted(product.id)}
                    averageRating={avgRating}
                  />
                );
              })}
            </div>
          )}

          {!isLoading && products.length > 8 && (
            <div className="text-center mt-10">
              <a
                href="#/category/candle-making"
                className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                View All Products <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Brand Story ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary mb-3">Our Story</p>
            <h2 className="text-3xl font-serif font-bold mb-5">Crafted with Passion, Delivered with Care</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Bonitara was born from a love of handmade crafts and a desire to make premium supplies accessible to every maker in India. We source the finest natural waxes, fragrance oils, and soap bases so you can focus on creating.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Whether you're a hobbyist or a professional, our curated range has everything you need to bring your creative vision to life.
            </p>
            <a
              href="#/category/candle-making"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/assets/generated/candle-wax-flakes.dim_600x600.png"
              alt="Wax flakes"
              className="rounded-2xl object-cover aspect-square"
            />
            <img
              src="/assets/generated/soap-base.dim_600x600.png"
              alt="Soap base"
              className="rounded-2xl object-cover aspect-square mt-8"
            />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-widest text-primary mb-2">Reviews</p>
          <h2 className="text-3xl font-serif font-bold mb-10">What Our Customers Say</h2>
          <div className="relative min-h-[120px]">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`transition-opacity duration-500 ${i === testimonialIndex ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
              >
                <div className="flex justify-center mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-amber-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-lg text-foreground italic mb-4">"{t.text}"</p>
                <p className="font-semibold text-primary">— {t.name}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIndex(i)}
                className={`h-2 rounded-full transition-all ${i === testimonialIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30 w-2'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-3xl p-10 text-center text-primary-foreground">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">Join the Bonitara Community</h2>
          <p className="opacity-90 mb-6">Get exclusive recipes, tutorials, and early access to new products.</p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={e => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2.5 rounded-full text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-background text-primary rounded-full font-medium hover:bg-background/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

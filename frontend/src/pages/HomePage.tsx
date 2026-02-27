import React, { useState, useEffect, useRef } from 'react';
import { useActor } from '../hooks/useActor';
import { Product } from '../backend';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronLeft,
  ChevronRight,
  Leaf,
  Award,
  Truck,
  HeartHandshake,
  Quote,
  ArrowRight,
  Mail,
} from 'lucide-react';

const HERO_SLIDES = [
  {
    image: '/assets/generated/hero-banner.dim_1920x900.png',
    title: 'Pure Craft Supplies',
    subtitle: 'Premium ingredients for soap making, candle crafting, resin art & fragrance',
    cta: 'Shop Now',
    ctaHref: '#/category/soap-making',
  },
  {
    image: '/assets/generated/hero-banner.dim_1920x900.png',
    title: 'Wholesale Available',
    subtitle: 'Bulk pricing for businesses and serious crafters',
    cta: 'Learn More',
    ctaHref: '#/wholesale',
  },
];

const CATEGORIES = [
  {
    label: 'Soap Making',
    slug: 'soap-making',
    image: '/assets/generated/category-soap.dim_600x400.png',
    description: 'Bases, oils, colorants & molds',
  },
  {
    label: 'Candle Making',
    slug: 'candle-making',
    image: '/assets/generated/category-candle.dim_600x400.png',
    description: 'Waxes, wicks, fragrances & containers',
  },
  {
    label: 'Resin Art',
    slug: 'resin-art',
    image: '/assets/generated/category-resin.dim_600x400.png',
    description: 'Epoxy resins, pigments & molds',
  },
  {
    label: 'Fragrance',
    slug: 'fragrance',
    image: '/assets/generated/category-fragrance.dim_600x400.png',
    description: 'Essential oils & fragrance blends',
  },
];

const FEATURES = [
  { icon: Leaf, title: 'Natural Ingredients', desc: 'Ethically sourced, pure quality' },
  { icon: Award, title: 'Premium Quality', desc: 'Lab-tested for consistency' },
  { icon: Truck, title: 'Fast Shipping', desc: 'Pan-India delivery' },
  { icon: HeartHandshake, title: 'Crafter Support', desc: 'Expert guidance always' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Soap Artisan',
    text: 'Bonitara\'s soap bases are absolutely incredible. The quality is consistent and my customers love the results.',
  },
  {
    name: 'Rahul Mehta',
    role: 'Candle Maker',
    text: 'I\'ve tried many suppliers but Bonitara stands out. Their soy wax burns cleanly and the fragrance throw is amazing.',
  },
  {
    name: 'Ananya Patel',
    role: 'Resin Artist',
    text: 'The epoxy resin from Bonitara is crystal clear and cures perfectly every time. Highly recommend!',
  },
];

export default function HomePage() {
  const { actor, isFetching: actorFetching } = useActor();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [heroSlide, setHeroSlide] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const heroTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance hero
  useEffect(() => {
    heroTimerRef.current = setInterval(() => {
      setHeroSlide(s => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => { if (heroTimerRef.current) clearInterval(heroTimerRef.current); };
  }, []);

  // Fetch featured products
  useEffect(() => {
    if (!actor || actorFetching) return;
    setProductsLoading(true);
    actor.getAllProducts()
      .then(products => {
        setFeaturedProducts(products.slice(0, 8));
        setProductsLoading(false);
      })
      .catch(() => setProductsLoading(false));
  }, [actor, actorFetching]);

  const prevHero = () => setHeroSlide(s => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextHero = () => setHeroSlide(s => (s + 1) % HERO_SLIDES.length);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Section 1: Hero Slider ── */}
      <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === heroSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-3xl">
                <h1 className="font-display text-4xl md:text-6xl mb-4 animate-fadeIn">{slide.title}</h1>
                <p className="font-body text-lg md:text-xl text-white/85 mb-8 animate-slideUp">{slide.subtitle}</p>
                <a
                  href={slide.ctaHref}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-sm font-body font-medium hover:bg-primary/90 transition-colors"
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
        {/* Arrows */}
        <button
          onClick={prevHero}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextHero}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroSlide(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === heroSlide ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* ── Section 2: Features Bar ── */}
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-body font-semibold text-white text-sm">{f.title}</p>
                  <p className="font-body text-white/75 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Featured Categories ── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-3">Shop by Category</h2>
            <p className="font-body text-muted-foreground max-w-xl mx-auto">
              Explore our curated collection of premium craft supplies
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map(cat => (
              <a
                key={cat.slug}
                href={`#/category/${cat.slug}`}
                className="group relative overflow-hidden rounded-sm aspect-[3/2] block"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <h3 className="font-display text-xl text-white mb-1">{cat.label}</h3>
                  <p className="font-body text-white/75 text-sm">{cat.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Best Sellers ── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">Best Sellers</h2>
            <p className="font-body text-muted-foreground">Our most loved products by crafters across India</p>
          </div>
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-sm" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground font-body">
              <p>No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          )}
          {featuredProducts.length > 0 && (
            <div className="text-center mt-10">
              <a
                href="#/category/soap-making"
                className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-2.5 rounded-sm font-body hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                View All Products
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Section 5: Brand Story ── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-6">Our Story</h2>
            <p className="font-body text-muted-foreground text-lg leading-relaxed mb-6">
              Bonitara was born from a passion for handcrafted beauty. We believe that the finest creations
              start with the finest ingredients. Our mission is to empower crafters across India with
              premium, ethically sourced supplies that bring their creative visions to life.
            </p>
            <span className="font-display text-primary text-xl italic">
              "Crafting beauty, one ingredient at a time."
            </span>
          </div>
        </div>
      </section>

      {/* ── Section 6: Testimonials ── */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">What Crafters Say</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-sm p-8 text-center relative">
              <Quote className="w-8 h-8 text-primary/30 mx-auto mb-4" />
              <p className="font-body text-white text-lg leading-relaxed mb-6">
                "{TESTIMONIALS[testimonialIndex].text}"
              </p>
              <p className="font-display text-foreground font-semibold">{TESTIMONIALS[testimonialIndex].name}</p>
              <p className="font-body text-muted-foreground text-sm">{TESTIMONIALS[testimonialIndex].role}</p>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setTestimonialIndex(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === testimonialIndex ? 'bg-primary' : 'bg-border'}`}
                />
              ))}
              <button
                onClick={() => setTestimonialIndex(i => (i + 1) % TESTIMONIALS.length)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: Newsletter ── */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <Mail className="w-10 h-10 text-white/60 mx-auto mb-4" />
          <h2 className="font-display text-3xl md:text-4xl text-white mb-3">Stay Inspired</h2>
          <p className="font-body text-white/80 mb-8 max-w-md mx-auto">
            Get crafting tips, new product alerts, and exclusive offers delivered to your inbox.
          </p>
          {subscribed ? (
            <p className="font-body text-white font-medium">🎉 Thank you for subscribing!</p>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-2.5 rounded-sm font-body text-sm bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="bg-white text-primary px-6 py-2.5 rounded-sm font-body font-medium hover:bg-white/90 transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}

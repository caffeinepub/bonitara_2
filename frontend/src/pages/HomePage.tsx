import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ArrowRight, Truck, Shield, Leaf, Award } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const heroSlides = [
  {
    image: '/assets/generated/hero-banner.dim_1920x900.png',
    title: 'Luxury Handcrafted',
    subtitle: 'Home Fragrances',
    description: 'Elevate your space with our artisanal candles, perfumes, and resin art — crafted with the finest natural ingredients.',
    cta: 'Shop Now',
    href: '#/category/candles',
  },
  {
    image: '/assets/generated/hero-banner.dim_1920x900.png',
    title: 'Pure & Natural',
    subtitle: 'Soap Collection',
    description: 'Indulge in our handmade soaps infused with botanical extracts and essential oils for a luxurious bathing experience.',
    cta: 'Explore Soaps',
    href: '#/category/soaps',
  },
  {
    image: '/assets/generated/hero-banner.dim_1920x900.png',
    title: 'Artisan Resin',
    subtitle: 'Unique Creations',
    description: 'Each piece is a one-of-a-kind work of art, handcrafted with premium resin and natural elements.',
    cta: 'View Collection',
    href: '#/category/resin',
  },
];

const categories = [
  { name: 'Candles', image: '/assets/generated/category-candle.dim_600x400.png', slug: 'candles', count: '24 Products' },
  { name: 'Fragrances', image: '/assets/generated/category-fragrance.dim_600x400.png', slug: 'fragrances', count: '18 Products' },
  { name: 'Resin Art', image: '/assets/generated/category-resin.dim_600x400.png', slug: 'resin', count: '12 Products' },
  { name: 'Soaps', image: '/assets/generated/category-soap.dim_600x400.png', slug: 'soaps', count: '20 Products' },
];

const features = [
  { icon: Leaf, title: 'Natural Ingredients', desc: '100% natural, sustainably sourced' },
  { icon: Award, title: 'Handcrafted Quality', desc: 'Made with love and expertise' },
  { icon: Truck, title: 'Pan India Delivery', desc: 'Fast & secure shipping' },
  { icon: Shield, title: 'Satisfaction Guaranteed', desc: 'Easy returns & exchanges' },
];

const testimonials = [
  { name: 'Priya Sharma', location: 'Mumbai', rating: 5, text: 'The Sandalwood Dreams candle is absolutely divine! The fragrance fills my entire home and lasts for hours. BONITARA has become my go-to for all home fragrance needs.' },
  { name: 'Rahul Mehta', location: 'Delhi', rating: 5, text: 'Ordered the resin art piece as a gift and my wife was absolutely thrilled. The craftsmanship is exceptional and the packaging was beautiful.' },
  { name: 'Anita Patel', location: 'Bangalore', rating: 5, text: 'The soap collection is incredible. My skin feels so soft and the natural ingredients make such a difference. Will definitely be ordering again!' },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const bestSellers = products.slice(0, 8);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Slider */}
      <section className="relative h-[60vh] sm:h-[70vh] lg:h-[85vh] overflow-hidden">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/40" />
            <div className="absolute inset-0 flex items-center justify-center sm:justify-start">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl text-center sm:text-left">
                  <p className="text-primary text-sm sm:text-base font-medium tracking-widest uppercase mb-2 sm:mb-3 animate-fadeIn">
                    {slide.subtitle}
                  </p>
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight mb-3 sm:mb-4 animate-slideUp">
                    {slide.title}
                  </h1>
                  <p className="text-white/80 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed animate-fadeIn hidden sm:block">
                    {slide.description}
                  </p>
                  <a
                    href={slide.href}
                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:gap-3 text-sm sm:text-base min-h-[44px]"
                  >
                    {slide.cta} <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider controls */}
        <button
          onClick={() => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % heroSlides.length)}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-primary w-6' : 'bg-white/50'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-muted/30 border-y border-border py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map(f => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{f.title}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-primary text-xs sm:text-sm font-medium tracking-widest uppercase mb-2">Explore</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {categories.map(cat => (
              <a
                key={cat.slug}
                href={`#/category/${cat.slug}`}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[3/4] block"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
                  <h3 className="font-serif text-lg sm:text-xl lg:text-2xl text-white">{cat.name}</h3>
                  <p className="text-white/70 text-xs sm:text-sm mt-0.5">{cat.count}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <p className="text-primary text-xs sm:text-sm font-medium tracking-widest uppercase mb-2">Popular</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground">Best Sellers</h2>
            </div>
            <a href="#/category/candles" className="flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all self-start sm:self-auto">
              View All <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-primary text-xs sm:text-sm font-medium tracking-widest uppercase mb-3">Our Story</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground mb-4 sm:mb-6">
                Crafted with <span className="text-primary italic">Passion</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                BONITARA was born from a deep love for natural fragrances and artisanal craftsmanship. Every product we create is a labor of love, made with the finest natural ingredients sourced from across India.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
                Our mission is to bring luxury home fragrances to every Indian home, celebrating the rich tradition of natural scents while embracing modern aesthetics.
              </p>
              <a href="#/wholesale" className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-all text-sm min-h-[44px]">
                Learn More <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <img
                  src="/assets/generated/category-candle.dim_600x400.png"
                  alt="Our Story"
                  className="w-full rounded-2xl object-cover aspect-[4/3]"
                />
                <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground p-4 sm:p-6 rounded-xl shadow-lg">
                  <p className="font-serif text-2xl sm:text-3xl">5+</p>
                  <p className="text-xs sm:text-sm opacity-90">Years of Craft</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-primary text-xs sm:text-sm font-medium tracking-widest uppercase mb-2">Reviews</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-medium text-foreground text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 sm:py-16 lg:py-20 bg-primary/5 border-y border-primary/20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-primary text-xs sm:text-sm font-medium tracking-widest uppercase mb-3">Stay Connected</p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground mb-3 sm:mb-4">
            Join the BONITARA Family
          </h2>
          <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
            Subscribe for exclusive offers, new arrivals, and fragrance inspiration delivered to your inbox.
          </p>
          {subscribed ? (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-6 py-4 text-sm font-medium">
              🎉 Thank you for subscribing! Welcome to the BONITARA family.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 h-12 px-4 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                required
              />
              <button
                type="submit"
                className="h-12 px-6 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors text-sm whitespace-nowrap min-h-[44px]"
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

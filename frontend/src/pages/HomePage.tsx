import React, { useState } from 'react';
import { ArrowRight, Star, Shield, Truck, Award, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import { toast } from 'sonner';

const reviews = [
  { name: 'Priya Sharma', rating: 5, text: 'Absolutely love the quality of BONITARA products! The goat milk soap base is incredibly creamy and my customers keep coming back for more.', location: 'Mumbai' },
  { name: 'Ananya Patel', rating: 5, text: 'The soy wax and wooden wicks are top-notch. My candles have never burned so cleanly. Highly recommend for serious candle makers!', location: 'Ahmedabad' },
  { name: 'Ritu Verma', rating: 5, text: 'The epoxy resin is crystal clear with minimal bubbles. The pigment set is vibrant and the customer service is exceptional.', location: 'Delhi' },
  { name: 'Meera Krishnan', rating: 5, text: 'Best fragrance oils I have ever used. The oud and rose blend is absolutely divine. Fast shipping and beautiful packaging too!', location: 'Bangalore' },
  { name: 'Sunita Joshi', rating: 5, text: 'BONITARA has transformed my small business. The wholesale pricing is fair and the quality is consistently excellent.', location: 'Pune' },
];

const whyUs = [
  { icon: Award, title: 'Premium Quality', desc: 'Every ingredient is sourced from trusted suppliers and tested to meet cosmetic-grade standards.' },
  { icon: Shield, title: 'Cosmetic Grade', desc: 'All products are certified cosmetic grade, safe for skin contact and professional use.' },
  { icon: Leaf, title: 'Trusted Ingredients', desc: 'Natural, ethically sourced ingredients with full transparency on origin and specifications.' },
  { icon: Truck, title: 'Fast Shipping', desc: 'Orders dispatched within 1–3 business days with reliable pan-India delivery.' },
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 8);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success('Thank you for subscribing!');
  };

  const prevReview = () => setReviewIdx(i => (i === 0 ? reviews.length - 1 : i - 1));
  const nextReview = () => setReviewIdx(i => (i === reviews.length - 1 ? 0 : i + 1));

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-charcoal">
        <img
          src="/assets/generated/hero-banner.dim_1920x900.png"
          alt="BONITARA Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in-up">
          <p className="font-sans text-gold tracking-[0.3em] text-sm uppercase mb-4">Welcome to</p>
          <h1 className="font-serif text-6xl md:text-8xl text-ivory font-light mb-4 leading-none">
            BONITARA
          </h1>
          <p className="font-serif text-xl md:text-2xl text-ivory/80 italic mb-8">
            Inspired By Elegance
          </p>
          <p className="font-sans text-ivory/60 text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed">
            Premium cosmetic-grade raw materials for soap making, candle making, resin art, and fragrance crafting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#/category/soap-making"
              className="px-8 py-3 bg-gold text-white font-sans font-medium text-sm tracking-widest hover:bg-gold-dark transition-colors duration-200"
            >
              SHOP NOW
            </a>
            <a
              href="#/category/soap-making"
              className="px-8 py-3 border border-ivory/40 text-ivory font-sans font-medium text-sm tracking-widest hover:border-gold hover:text-gold transition-colors duration-200"
            >
              EXPLORE CATEGORIES
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/40">
          <span className="font-sans text-xs tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-ivory/20" />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-3">Explore</p>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal">Our Collections</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(cat => (
              <a key={cat.slug} href={`#/category/${cat.slug}`} className="group relative overflow-hidden rounded-sm aspect-[3/4] block">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl text-ivory mb-1">{cat.name}</h3>
                  <p className="font-sans text-ivory/60 text-xs mb-3 line-clamp-2">{cat.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-gold font-sans text-xs tracking-widest group-hover:gap-3 transition-all duration-200">
                    SHOP NOW <ArrowRight size={12} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-padding bg-beige">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-3">Curated For You</p>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal">Best Sellers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-10">
            <a href="#/category/soap-making" className="inline-flex items-center gap-2 px-8 py-3 border border-charcoal text-charcoal font-sans text-sm tracking-widest hover:bg-charcoal hover:text-ivory transition-all duration-200">
              VIEW ALL PRODUCTS <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-4">Our Story</p>
              <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-6 leading-tight">
                Crafted With<br />Passion & Purpose
              </h2>
              <p className="font-sans text-charcoal-light text-sm leading-relaxed mb-4">
                BONITARA was born from a deep love of artisan crafting and a belief that every maker deserves access to the finest ingredients. We source our raw materials from trusted suppliers across India and the world, ensuring every product meets the highest cosmetic-grade standards.
              </p>
              <p className="font-sans text-charcoal-light text-sm leading-relaxed mb-6">
                From the lavender fields of Bulgaria to the sandalwood forests of Mysore, we bring the world's finest ingredients to your workshop. Whether you are a hobbyist discovering the joy of soap making or a professional building a luxury brand, BONITARA is your trusted partner.
              </p>
              <a href="#/wholesale" className="inline-flex items-center gap-2 text-gold font-sans text-sm tracking-widest hover:gap-4 transition-all duration-200">
                EXPLORE WHOLESALE <ArrowRight size={14} />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square overflow-hidden rounded-sm">
                <img src="/assets/generated/category-soap.dim_600x400.png" alt="Soap Making" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-sm mt-8">
                <img src="/assets/generated/category-candle.dim_600x400.png" alt="Candle Making" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-sm -mt-8">
                <img src="/assets/generated/category-resin.dim_600x400.png" alt="Resin Art" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-sm">
                <img src="/assets/generated/category-fragrance.dim_600x400.png" alt="Fragrance" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-charcoal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-3">Why BONITARA</p>
            <h2 className="font-serif text-4xl md:text-5xl text-ivory">The BONITARA Difference</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map(item => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center mx-auto mb-4">
                  <item.icon size={22} className="text-gold" />
                </div>
                <h3 className="font-serif text-xl text-ivory mb-2">{item.title}</h3>
                <p className="font-sans text-ivory/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-padding bg-beige">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-3">Testimonials</p>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal">What Our Customers Say</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border p-8 rounded-sm text-center luxury-shadow">
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: reviews[reviewIdx].rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="font-serif text-xl text-charcoal italic mb-6 leading-relaxed">
                "{reviews[reviewIdx].text}"
              </p>
              <p className="font-sans font-medium text-charcoal text-sm">{reviews[reviewIdx].name}</p>
              <p className="font-sans text-muted-foreground text-xs mt-1">{reviews[reviewIdx].location}</p>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={prevReview} className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button key={i} onClick={() => setReviewIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === reviewIdx ? 'bg-gold' : 'bg-border'}`} />
                ))}
              </div>
              <button onClick={nextReview} className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <p className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-3">Stay Connected</p>
            <h2 className="font-serif text-4xl text-charcoal mb-4">Join Our Community</h2>
            <p className="font-sans text-muted-foreground text-sm mb-8">
              Subscribe for exclusive offers, new product launches, crafting tips, and inspiration delivered to your inbox.
            </p>
            {subscribed ? (
              <div className="bg-beige border border-gold/30 rounded-sm p-6">
                <p className="font-serif text-xl text-charcoal">Thank you for subscribing!</p>
                <p className="font-sans text-sm text-muted-foreground mt-2">You'll receive our next newsletter soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-0">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-4 py-3 border border-border bg-card font-sans text-sm focus:outline-none focus:border-gold transition-colors"
                />
                <button type="submit" className="px-6 py-3 bg-charcoal text-ivory font-sans text-sm tracking-widest hover:bg-gold transition-colors duration-200 whitespace-nowrap">
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

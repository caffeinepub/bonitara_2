import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { blogPosts } from '../data/products';

export default function BlogListingPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-beige py-16 text-center px-4 border-b border-border">
        <p className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-3">Insights & Inspiration</p>
        <h1 className="font-serif text-5xl text-charcoal">The BONITARA Journal</h1>
        <p className="font-sans text-muted-foreground text-sm mt-3 max-w-md mx-auto">
          Crafting tips, ingredient guides, and inspiration for soap makers, candle crafters, resin artists, and fragrance enthusiasts.
        </p>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map(post => (
            <a key={post.id} href={`#/blog/${post.id}`} className="group block bg-card border border-border rounded-sm overflow-hidden hover-lift luxury-shadow">
              <div className="aspect-video overflow-hidden bg-beige">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-sans text-xs text-gold tracking-widest uppercase">{post.category}</span>
                  <span className="text-border">·</span>
                  <span className="flex items-center gap-1 font-sans text-xs text-muted-foreground">
                    <Calendar size={11} />
                    {new Date(post.date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                  </span>
                </div>
                <h2 className="font-serif text-xl text-charcoal mb-2 group-hover:text-gold transition-colors">{post.title}</h2>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-gold font-sans text-xs tracking-widest group-hover:gap-3 transition-all duration-200">
                  READ MORE <ArrowRight size={12} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

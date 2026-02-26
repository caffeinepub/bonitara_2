import React from 'react';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { blogPosts } from '../data/products';

interface Props { postId: string; }

export default function BlogPostPage({ postId }: Props) {
  const post = blogPosts.find(p => p.id === postId);

  if (!post) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="font-serif text-3xl text-charcoal">Post not found</h2>
      <a href="#/blog" className="text-gold font-sans text-sm mt-4 inline-block">← Back to Blog</a>
    </div>
  );

  const related = blogPosts.filter(p => p.id !== post.id).slice(0, 2);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-charcoal">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-3">{post.category}</span>
          <h1 className="font-serif text-3xl md:text-5xl text-ivory max-w-2xl">{post.title}</h1>
          <div className="flex items-center gap-2 mt-4 text-ivory/60 font-sans text-xs">
            <Calendar size={12} />
            {new Date(post.date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <a href="#/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors font-sans text-sm mb-8">
          <ArrowLeft size={14} /> Back to Journal
        </a>

        <div className="prose prose-sm max-w-none font-sans text-charcoal-light leading-relaxed">
          {post.content.split('\n\n').map((para, i) => (
            <p key={i} className="mb-4">{para}</p>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={14} className="text-gold" />
            {['Crafting', post.category, 'BONITARA', 'Tutorial'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-beige border border-border font-sans text-xs text-charcoal rounded-sm">{tag}</span>
            ))}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="font-serif text-2xl text-charcoal mb-6">More from the Journal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map(p => (
                <a key={p.id} href={`#/blog/${p.id}`} className="group block bg-card border border-border rounded-sm overflow-hidden hover-lift">
                  <div className="aspect-video overflow-hidden bg-beige">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <span className="font-sans text-xs text-gold tracking-widest uppercase">{p.category}</span>
                    <h4 className="font-serif text-base text-charcoal mt-1 group-hover:text-gold transition-colors">{p.title}</h4>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';
import { SiInstagram, SiFacebook, SiYoutube } from 'react-icons/si';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    toast.success('Message sent successfully!');
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-beige py-16 text-center px-4 border-b border-border">
        <p className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-3">Get In Touch</p>
        <h1 className="font-serif text-5xl text-charcoal">Contact Us</h1>
        <p className="font-sans text-muted-foreground text-sm mt-3 max-w-md mx-auto">
          We'd love to hear from you. Reach out for product queries, wholesale inquiries, or just to say hello.
        </p>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="font-serif text-3xl text-charcoal mb-8">Get In Touch</h2>
            <div className="space-y-6 mb-8">
              {[
                { icon: Mail, label: 'Email', value: 'hello@bonitara.in', href: 'mailto:hello@bonitara.in' },
                { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                { icon: MapPin, label: 'Address', value: 'Mumbai, Maharashtra, India – 400001', href: '#' },
                { icon: Clock, label: 'Business Hours', value: 'Monday–Saturday: 10:00 AM – 6:00 PM IST', href: '#' },
              ].map(item => (
                <div key={item.label} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center shrink-0">
                    <item.icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-sans text-xs text-muted-foreground mb-0.5">{item.label}</p>
                    <a href={item.href} className="font-sans text-sm text-charcoal hover:text-gold transition-colors">{item.value}</a>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="font-sans text-xs text-muted-foreground mb-3 tracking-widest uppercase">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { icon: SiInstagram, href: '#', label: 'Instagram' },
                  { icon: SiFacebook, href: '#', label: 'Facebook' },
                  { icon: SiYoutube, href: '#', label: 'YouTube' },
                ].map(s => (
                  <a key={s.label} href={s.href} className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors text-charcoal">
                    <s.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
            {/* Map placeholder */}
            <div className="mt-8 h-48 bg-beige border border-border rounded-sm flex items-center justify-center">
              <div className="text-center">
                <MapPin size={24} className="text-gold mx-auto mb-2" />
                <p className="font-sans text-sm text-muted-foreground">Mumbai, Maharashtra, India</p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="font-sans text-xs text-gold hover:underline mt-1 inline-block">View on Google Maps →</a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-serif text-3xl text-charcoal mb-8">Send a Message</h2>
            {submitted ? (
              <div className="bg-card border border-gold/30 p-8 rounded-sm text-center">
                <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                <h3 className="font-serif text-2xl text-charcoal mb-2">Message Sent!</h3>
                <p className="font-sans text-sm text-muted-foreground">We'll get back to you within 24 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name:'name', label:'Your Name', type:'text' },
                  { name:'email', label:'Email Address', type:'email' },
                  { name:'subject', label:'Subject', type:'text' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block font-sans text-xs text-charcoal mb-1.5 tracking-wide">{f.label} *</label>
                    <input
                      type={f.type} name={f.name}
                      value={form[f.name as keyof typeof form]}
                      onChange={handleChange} required
                      className="w-full px-3 py-2.5 border border-border bg-card font-sans text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="block font-sans text-xs text-charcoal mb-1.5 tracking-wide">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                    className="w-full px-3 py-2.5 border border-border bg-card font-sans text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-charcoal text-ivory font-sans text-sm tracking-widest hover:bg-gold transition-colors disabled:opacity-60">
                  {loading ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

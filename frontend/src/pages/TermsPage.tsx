import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-beige py-16 text-center px-4 border-b border-border">
        <p className="font-sans text-gold tracking-[0.25em] text-xs uppercase mb-3">Legal</p>
        <h1 className="font-serif text-5xl text-charcoal">Terms & Conditions</h1>
        <p className="font-sans text-muted-foreground text-sm mt-3">Last updated: January 2026</p>
      </div>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="space-y-8 font-sans text-sm text-charcoal-light leading-relaxed">
          {[
            {
              title: '1. Use of Website',
              content: 'By accessing and using the BONITARA website, you agree to be bound by these Terms and Conditions. The website is intended for users who are 18 years of age or older. BONITARA reserves the right to modify these terms at any time without prior notice. Continued use of the website constitutes acceptance of the updated terms.'
            },
            {
              title: '2. Pricing Policy',
              content: 'All prices displayed on the website are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. BONITARA reserves the right to change prices at any time without prior notice. Prices at the time of order placement will be honored. Wholesale pricing is subject to separate agreements.'
            },
            {
              title: '3. Product Information',
              content: 'We make every effort to ensure product descriptions, images, and specifications are accurate. However, slight variations in color, texture, or appearance may occur due to photography and screen settings. Product formulations may be updated to improve quality. Always read product labels and safety information before use.'
            },
            {
              title: '4. Intellectual Property',
              content: 'All content on the BONITARA website, including text, images, logos, product descriptions, and design elements, is the intellectual property of BONITARA and is protected by Indian copyright law. Unauthorized reproduction, distribution, or use of any content is strictly prohibited and may result in legal action.'
            },
            {
              title: '5. Product Usage Disclaimer',
              content: 'BONITARA products are raw materials intended for use in cosmetic and craft formulations. Users are responsible for ensuring their final products comply with applicable regulations. BONITARA is not responsible for any adverse reactions resulting from improper use, incorrect formulation, or failure to follow safety guidelines. Always conduct patch tests before use.'
            },
            {
              title: '6. Limitation of Liability',
              content: 'BONITARA\'s liability is limited to the purchase price of the product in question. We are not liable for any indirect, incidental, special, or consequential damages arising from the use of our products or website. This includes but is not limited to loss of profits, business interruption, or personal injury.'
            },
            {
              title: '7. Privacy Policy',
              content: 'We collect and process personal information in accordance with our Privacy Policy. By using our website, you consent to the collection and use of your information as described. We do not sell or share personal information with third parties except as required for order fulfillment and legal compliance.'
            },
            {
              title: '8. Governing Law',
              content: 'These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.'
            },
          ].map(section => (
            <section key={section.title}>
              <h2 className="font-serif text-xl text-charcoal mb-3">{section.title}</h2>
              <p>{section.content}</p>
            </section>
          ))}
          <div className="bg-beige border border-border p-4 rounded-sm">
            <p className="text-xs text-muted-foreground">For questions about these Terms & Conditions, please contact us at <a href="mailto:legal@bonitara.in" className="text-gold hover:underline">legal@bonitara.in</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

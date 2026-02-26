# Specification

## Summary
**Goal:** Build BONITARA, a full luxury eCommerce platform for craft/DIY supply products (Soap Making, Candle Making, Resin Art, Fragrance) with storefront, admin dashboard, user accounts, and supporting pages — all with an elegant ivory/beige/gold/charcoal visual theme.

**Planned changes:**
- **Home page:** Full-width hero (brand name "BONITARA" + tagline "Inspired By Elegance"), featured category cards (4 categories), best sellers product grid (8+ products), brand story section, customer reviews carousel, newsletter signup
- **Category pages (×4):** Soap Making, Candle Making, Resin Art, Fragrance — each listing 25+ products with price-range filtering and sort options (price, popularity, newest)
- **Product detail pages:** Image gallery, description, SKU, price, stock status, Add to Cart, Add to Wishlist, related products section (4+ items)
- **Shopping cart:** Add/remove/update quantity, real-time subtotal, persistent across navigation, proceed to checkout
- **Checkout page:** Shipping address form, order summary, payment method selector (Razorpay placeholder, Stripe placeholder, UPI "coming soon")
- **User accounts:** Registration, login, profile management (saved address), order history, order tracking
- **Wholesale page:** Tiered bulk pricing table, MOQ info, private label details, GST info, inquiry form (business name, contact, email, product interest, quantity)
- **Static/info pages:** FAQ (accordion), Shipping Policy, Terms & Conditions, Return & Refund Policy, Contact Us (form with name/email/subject/message)
- **Admin dashboard:** Product CRUD across all categories, inventory level updates, order management (status: Processing/Shipped/Delivered), view wholesale and contact inquiries, blog post management
- **Blog section:** Listing page (title, excerpt, date, thumbnail) and individual post detail pages
- **Luxury UI theme:** Ivory (#FFFFF0), beige (#F5F0E8), soft gold (#C9A84C), charcoal (#2C2C2C) palette; serif headings, sans-serif body; smooth hover transitions on cards and buttons; fully mobile-responsive
- **Static assets:** Hero banner image and BONITARA logo served from `frontend/public/assets/generated`, displayed in header, footer, and hero section
- **Backend (single Motoko actor):** Product catalog, cart/order data, user accounts, wholesale inquiries, contact submissions, blog posts

**User-visible outcome:** Visitors can browse luxury craft supply products across four categories, view product details, manage a cart, check out with placeholder payment options, create accounts, track orders, read the blog, and submit wholesale/contact inquiries. Admins can manage all products, inventory, orders, inquiries, and blog content via a dashboard.

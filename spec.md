# Specification

## Summary
**Goal:** Add manual email/password login and registration to the BONITARA site alongside the existing Internet Identity option, and make all pages fully mobile-responsive.

**Planned changes:**
- Add manual login page with two options: email/password form and Internet Identity, with error handling for invalid credentials
- Add manual registration page with two options: name/email/password/confirm-password form and Internet Identity, with password mismatch validation
- Store registered user credentials in the Motoko backend and validate logins against stored records
- Support admin login with username `admin` and password `Bonitara@2024` via the manual login path
- Redirect authenticated users away from login/register pages; redirect unauthenticated users from protected pages (Profile, OrderHistory) to login
- Perform a full responsive layout pass across all pages (Home, Category, ProductDetail, Cart, Checkout, Profile, OrderHistory, Blog, Wholesale, FAQ, ShippingPolicy, Terms, ReturnPolicy, ContactUs, AdminDashboard)
- Ensure all pages render without overflow at 320px, 768px, and 1280px breakpoints
- Reflow product grids to 1 column on mobile, 2 on tablet, 3-4 on desktop
- Ensure all interactive elements have minimum 44px touch targets
- Fix hamburger menu, modals, forms, and Admin Dashboard tables for mobile usability
- Scale images and typography appropriately across all breakpoints

**User-visible outcome:** Users and the admin can log in or register using email and password (in addition to Internet Identity), and the entire BONITARA site is fully usable on mobile, tablet, and desktop devices without layout issues.

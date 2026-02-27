# Specification

## Summary
**Goal:** Secure the admin panel with a dedicated login page and remove the admin nav link from the main header, while adding a sign-up option to the regular user login page.

**Planned changes:**
- Remove the admin panel link from the main navigation header so it is no longer visible to any user
- Create a new `/admin/login` page with a username/password form using hardcoded credentials (admin / admin123)
- On successful admin login, store a session flag in localStorage/sessionStorage and redirect to `/admin`
- On failed admin login, display an error message
- Protect the `/admin` route so unauthenticated users are redirected to `/admin/login`
- Add a logout button to the admin dashboard that clears the session and redirects to `/admin/login`
- Update the router to handle `/admin/login` and guard the `/admin` route
- Update the Sign In page to include both a "Sign In" and a "Sign Up" option, both using Internet Identity

**User-visible outcome:** Regular users can no longer see or accidentally reach the admin panel via the header. Admins access the panel by navigating directly to `/admin/login` and entering credentials. The main Sign In page offers both sign-in and sign-up via Internet Identity.

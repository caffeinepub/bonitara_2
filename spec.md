# Specification

## Summary
**Goal:** Fix the admin panel routing in App.tsx so that navigating to `/admin` correctly renders the admin pages instead of a blank screen or 404.

**Planned changes:**
- Update the routing configuration in `App.tsx` to properly handle the `/admin` route and all sub-routes (e.g., `/admin/dashboard`)
- Ensure `AdminLoginPage` renders when visiting `/admin` unauthenticated
- Ensure `AdminProtectedRoute` correctly guards `/admin/dashboard` and redirects unauthenticated users to the admin login page
- Ensure the admin routes do not render the shared `Header` and `Footer` components
- Verify all other existing routes continue to work correctly

**User-visible outcome:** Navigating to the `/admin` route opens the admin login page, and after successful authentication, the admin dashboard loads correctly.

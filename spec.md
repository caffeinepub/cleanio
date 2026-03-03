# Specification

## Summary
**Goal:** Restore a visible Admin navigation link in the Cleanio app's Layout component so users can access the /admin route from any page.

**Planned changes:**
- Add an "Admin" link/button to the Layout component (`frontend/src/components/Layout.tsx`) in both the header navigation and footer
- Ensure the Admin link is visible on all pages (desktop and mobile/hamburger menu)
- Style the link/button using the existing Cleanio brand palette (deep charcoal + electric orange)
- Link navigates to the `/admin` route (which remains protected by `ProtectedAdminRoute`)

**User-visible outcome:** An "Admin" link is visible in the site header and/or footer on every page, allowing navigation to the protected admin area from anywhere in the app.

# Specification

## Summary
**Goal:** Add a discreet admin login entry point on the customer-facing site so admins can navigate to the admin panel without it being prominently visible to customers.

**Planned changes:**
- Add a small, unobtrusive "Admin" link in the footer (or header) that navigates to `/admin`
- Ensure unauthenticated users visiting `/admin` are shown the admin login form via the existing `ProtectedAdminRoute`

**User-visible outcome:** Admins can access the admin login page from the production site via a subtle footer link, while customers are unlikely to notice it. Unauthenticated visitors who follow the link see the password gate, not the admin dashboard.

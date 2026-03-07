# Cleanio

## Current State
- Two-wheeler doorstep service app with Full Service, Repair, Cleaning (with sub-options), and AI repair bot
- Bookings stored in stable Map on backend, admin panel with mechanic assignment and status updates
- Admin login protected with password, QR code modal in admin panel
- WhatsApp floating button and Support section
- Electric vehicle support with ₹999 flat rate
- QR code uses a custom inline generator that fails on long URLs (crashes or shows nothing)

## Requested Changes (Diff)

### Add
- Premium Annual Plans page: 3-service plan and 4-service plan with Stripe checkout
- Stripe payment integration for premium plans (createCheckoutSession + success/failure routes)
- PaymentSuccess and PaymentFailure pages at /payment-success and /payment-failure
- Stripe admin configuration UI (StripeConfiguration) accessible from admin panel
- qrcode npm library replacing the broken custom QR canvas generator

### Modify
- QRCode.tsx: Replace custom implementation with proper `qrcode` npm library (canvas API)
- AdminBookingsPage: Add Stripe configuration link in admin panel
- HomePage: Add "Premium Plans" card/section linking to /premium-plans
- App.tsx / router: Add routes for /premium-plans, /payment-success, /payment-failure

### Remove
- The entire custom QR code math implementation in QRCode.tsx (GF tables, RS encode, buildQRMatrix)

## Implementation Plan
1. Install `qrcode` npm library and `@types/qrcode`
2. Rewrite QRCode.tsx to use `qrcode` library to render QR to canvas element
3. Generate updated Motoko backend with Stripe ShoppingItem type and createCheckoutSession
4. Add PremiumPlansPage with 3-service (₹2499) and 4-service (₹2999) annual plan cards + Stripe checkout
5. Add PaymentSuccessPage and PaymentFailurePage 
6. Add useCreateCheckoutSession hook
7. Add /premium-plans, /payment-success, /payment-failure routes to router
8. Add Stripe admin config section in AdminBookingsPage
9. Add Premium Plans entry point from HomePage services section or nav

# Cleanio

## Current State
Customers book a service, see a confirmation page with their Booking ID, and can manually enter that ID into `/track-booking` to check status. There is no way for a customer to see all their past bookings without individually re-entering each Booking ID. Booking IDs are not stored anywhere on the customer's device.

## Requested Changes (Diff)

### Add
- New `/my-bookings` page: displays a list of all Booking IDs the customer has used on this device, retrieved from localStorage. Each booking is shown as an expandable card with full booking details (status, service, vehicle, mechanic, address).
- Auto-save Booking ID to localStorage (`cleanio_booking_ids`) on the BookingConfirmationPage after a successful booking.
- "My Bookings" nav link in both desktop and mobile menus, and a History button on the Track Booking page.
- New route `/my-bookings` registered in App.tsx.

### Modify
- `BookingConfirmationPage.tsx`: on mount, save the bookingId to localStorage under key `cleanio_booking_ids` (array of IDs, deduplicated).
- `Layout.tsx`: add "My Bookings" nav link.
- `App.tsx`: add `/my-bookings` route.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/pages/MyBookingsPage.tsx` — reads booking IDs from localStorage, fetches each booking via `useGetBooking`, renders status cards. Allow customer to also manually add a Booking ID. Show empty state if none saved.
2. Update `BookingConfirmationPage.tsx` — save bookingId to localStorage on render.
3. Update `App.tsx` — import and register `/my-bookings` route.
4. Update `Layout.tsx` — add "My Bookings" nav link (desktop + mobile).

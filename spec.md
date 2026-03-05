# Cleanio

## Current State
Full-stack two-wheeler doorstep service app with booking forms for Full Service, Repair, and Cleaning. Backend stores bookings in a stable Map. The backend recently had `generate_motoko_code` run which added `(with migration = Migration.run)` actor syntax and introduced a `migration.mo` module. The `useCreateBooking` hook calls the actor's `createBooking` function. The WhatsApp floating button and admin panel (with notification badge and QR code) are all working. Booking is currently failing.

## Requested Changes (Diff)

### Add
- Nothing new to add

### Modify
- Fix `useQueries.ts` `useCreateBooking` to add a retry mechanism and more robust error handling, including a check that actor is initialized before submitting
- Add a loading/retry state to `BookingForm.tsx` so if the actor isn't ready yet, it shows "Initializing..." and retries after a short delay rather than immediately failing
- Ensure the `useActor` hook properly waits for the actor to be ready before allowing booking submissions

### Remove
- Nothing to remove

## Implementation Plan
1. In `useQueries.ts`: update `useCreateBooking` so if actor is null, wait up to 3 seconds for actor to become available (poll every 500ms) before throwing the "not ready" error
2. In `BookingForm.tsx`: show a subtle "Connecting to service..." state if actor is not yet ready, and disable the submit button with that message instead of failing silently
3. Ensure the submit button shows clear feedback at all stages: idle, loading, error
4. The actual backend API signature and types remain unchanged

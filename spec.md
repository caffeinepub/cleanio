# Cleanio

## Current State
Full-stack two-wheeler doorstep service app. Backend has VehicleType with only `#scooter` and `#motorcycle`. Frontend added an "Electric" vehicle category that maps to `VehicleType.scooter` as a workaround, but this causes a booking failure because the type encoding doesn't match what the backend expects when the variant is sent.

## Requested Changes (Diff)

### Add
- `#electric` variant to backend `VehicleType` type

### Modify
- Backend `createBooking` to accept `#electric` as a valid VehicleType
- Frontend `BookingForm` to send `VehicleType.electric` directly instead of falling back to scooter

### Remove
- The workaround mapping of electric -> scooter in BookingForm

## Implementation Plan
1. Regenerate Motoko backend with VehicleType = { #scooter; #motorcycle; #electric }
2. Update BookingForm.tsx: change vehicleType derivation to include `VehicleType.electric` for "electric" category
3. Update AdminBookingsPage to display electric badge using new VehicleType.electric value
4. Validate and deploy

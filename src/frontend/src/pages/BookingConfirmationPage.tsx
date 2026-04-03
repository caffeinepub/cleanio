import { Button } from "@/components/ui/button";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Home,
  Loader2,
  Phone,
  UserCheck,
} from "lucide-react";
import { useGetBooking } from "../hooks/useQueries";

const SERVICE_LABELS: Record<string, string> = {
  fullService: "Full Service",
  repair: "Repair",
  cleaning: "Cleaning",
};

function getCleaningSubOptionLabel(
  booking: { cleaningSubOption?: { __kind__: string } } | null,
): string | null {
  if (!booking?.cleaningSubOption) return null;
  if (booking.cleaningSubOption.__kind__ === "colourFoamWashing")
    return "Colour Foam Washing ₹199";
  if (booking.cleaningSubOption.__kind__ === "normalFoamWashing")
    return "Normal Foam Washing ₹149";
  return null;
}

export default function BookingConfirmationPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/confirmation" });
  const { bookingId, name, service, slot } = search as {
    bookingId: string;
    name: string;
    service: string;
    slot: string;
  };

  const { data: booking, isLoading } = useGetBooking(bookingId);

  const cleaningLabel = getCleaningSubOptionLabel(booking ?? null);
  const serviceDisplay = cleaningLabel
    ? `Cleaning – ${cleaningLabel}`
    : SERVICE_LABELS[service] || service;

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <div className="bg-card border border-border rounded-3xl p-8 text-center shadow-card animate-fade-in-up">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-brand-orange/10 border-2 border-brand-orange/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-orange">
          <CheckCircle className="w-10 h-10 text-brand-orange" />
        </div>

        <h1 className="font-display font-black text-3xl text-foreground mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-muted-foreground mb-8">
          Your service has been booked successfully. Our technician will be at
          your doorstep on time.
        </p>

        {/* Booking Details */}
        <div className="bg-charcoal-light border border-border rounded-2xl p-5 text-left space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Booking ID</span>
            <span className="text-brand-orange font-mono font-bold text-sm">
              {bookingId}
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Customer</span>
            <span className="text-foreground font-medium text-sm">{name}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Service</span>
            <span className="text-foreground font-medium text-sm text-right max-w-[60%]">
              {serviceDisplay}
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Time Slot
            </span>
            <span className="text-foreground font-medium text-sm">{slot}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Status</span>
            <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-semibold px-2 py-1 rounded-full">
              Pending
            </span>
          </div>
          <div className="h-px bg-border" />
          {/* Mechanic Assignment */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> Assigned Mechanic
            </span>
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
            ) : (
              <span
                className={`text-sm font-medium ${
                  booking?.mechanicName
                    ? "text-foreground"
                    : "text-muted-foreground italic"
                }`}
              >
                {booking?.mechanicName ?? "Not yet assigned"}
              </span>
            )}
          </div>
        </div>

        {/* Call Confirmation Banner */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 mb-8 text-left">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Phone className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-foreground font-semibold mb-1">
                Our team will call you to confirm
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A Cleanio team member will call you on your registered number
                shortly to confirm your booking, share the technician's details,
                and answer any questions. Please keep your phone handy!
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate({ to: "/" })}
            className="w-full bg-brand-orange hover:bg-brand-orange-light text-charcoal font-bold py-3 rounded-xl shadow-orange-glow transition-all"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/admin/bookings" })}
            className="w-full border-border text-foreground hover:bg-charcoal-light hover:border-brand-orange rounded-xl transition-all"
          >
            View All Bookings
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

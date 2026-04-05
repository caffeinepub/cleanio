import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Search,
  UserCheck,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useGetBooking } from "../hooks/useQueries";

const SERVICE_LABELS: Record<string, string> = {
  fullService: "Full Service",
  repair: "Repair",
  cleaning: "Cleaning",
};

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    icon: <Clock className="w-4 h-4" />,
    message:
      "Your booking is received. Our team will call you to confirm shortly.",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: <CheckCircle className="w-4 h-4" />,
    message:
      "Your booking is confirmed! A technician has been assigned and will arrive at your doorstep.",
  },
  completed: {
    label: "Completed",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: <CheckCircle className="w-4 h-4" />,
    message: "Service completed! Thank you for choosing Cleanio.",
  },
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

function BookingDetails({ bookingId }: { bookingId: string }) {
  const { data: booking, isLoading, isError } = useGetBooking(bookingId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
        <p className="text-muted-foreground text-sm">
          Looking up your booking…
        </p>
      </div>
    );
  }

  if (isError || booking === null || booking === undefined) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
        <p className="text-red-400 font-semibold mb-1">Booking Not Found</p>
        <p className="text-muted-foreground text-sm">
          No booking found with that ID. Please double-check your Booking ID and
          try again.
        </p>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const cleaningLabel = getCleaningSubOptionLabel(booking);
  const serviceDisplay = cleaningLabel
    ? `Cleaning – ${cleaningLabel}`
    : SERVICE_LABELS[booking.serviceType] || booking.serviceType;
  const isEV = booking.vehicleType === "electric";

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Status Banner */}
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl border ${statusConfig.color}`}
      >
        <div className="mt-0.5">{statusConfig.icon}</div>
        <div>
          <p className="font-semibold text-sm">{statusConfig.label}</p>
          <p className="text-xs opacity-80 mt-0.5">{statusConfig.message}</p>
        </div>
      </div>

      {/* Booking Info Card */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-brand-orange" />
          Booking Details
        </h3>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Booking ID</span>
          <span className="text-brand-orange font-mono font-bold text-sm">
            {booking.id}
          </span>
        </div>
        <div className="h-px bg-border" />

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Customer</span>
          <span className="text-foreground font-medium text-sm">
            {booking.customerName}
          </span>
        </div>
        <div className="h-px bg-border" />

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Service</span>
          <span className="text-foreground font-medium text-sm text-right max-w-[60%]">
            {serviceDisplay}
          </span>
        </div>
        <div className="h-px bg-border" />

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Vehicle</span>
          <span className="flex items-center gap-1 text-foreground font-medium text-sm">
            {isEV && <Zap className="w-3.5 h-3.5 text-green-400" />}
            {booking.vehicleType === "scooter"
              ? "Scooter"
              : booking.vehicleType === "motorcycle"
                ? "Motorcycle"
                : "Electric"}
            {!isEV && (
              <span className="text-muted-foreground text-xs ml-1">
                ({booking.capacity === "upTo200cc" ? "≤200cc" : ">200cc"})
              </span>
            )}
          </span>
        </div>
        <div className="h-px bg-border" />

        <div className="flex justify-between items-start">
          <span className="text-muted-foreground text-sm flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Address
          </span>
          <span className="text-foreground text-sm text-right max-w-[60%]">
            {booking.address}
          </span>
        </div>
        <div className="h-px bg-border" />

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" /> Mechanic
          </span>
          <span
            className={`text-sm font-medium ${
              booking.mechanicName
                ? "text-foreground"
                : "text-muted-foreground italic"
            }`}
          >
            {booking.mechanicName ?? "Not yet assigned"}
          </span>
        </div>

        {booking.repairDetails && (
          <>
            <div className="h-px bg-border" />
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground text-sm flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" /> Issue
              </span>
              <span className="text-foreground text-sm text-right max-w-[60%]">
                {booking.repairDetails}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Need help? Chat with us on{" "}
          <a
            href="https://wa.me/919637113065"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-orange font-medium hover:underline"
          >
            WhatsApp
          </a>{" "}
          and mention your Booking ID.
        </p>
      </div>
    </div>
  );
}

export default function TrackBookingPage() {
  const [inputId, setInputId] = useState("");
  const [searchId, setSearchId] = useState("");

  const handleSearch = () => {
    const trimmed = inputId.trim();
    if (trimmed) setSearchId(trimmed);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-brand-orange" />
        </div>
        <h1 className="font-display font-black text-3xl text-foreground mb-2">
          Track Your Booking
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your Booking ID to check the status of your service.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <label
          htmlFor="booking-id-input"
          className="text-sm font-medium text-foreground mb-2 block"
        >
          Booking ID
        </label>
        <div className="flex gap-2">
          <Input
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            id="booking-id-input"
            placeholder="e.g. BK-123456"
            className="bg-charcoal-light border-border text-foreground placeholder:text-muted-foreground focus:border-brand-orange flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <Button
            onClick={handleSearch}
            disabled={!inputId.trim()}
            className="bg-brand-orange hover:bg-brand-orange-light text-charcoal font-semibold px-5"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Your Booking ID was shown on the confirmation page after booking.
        </p>
      </div>

      {/* Results */}
      {searchId && <BookingDetails bookingId={searchId} />}
    </div>
  );
}

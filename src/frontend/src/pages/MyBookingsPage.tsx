import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  History,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  UserCheck,
  Wrench,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Booking } from "../backend";
import { useGetBooking } from "../hooks/useQueries";

const LS_KEY = "cleanio_booking_ids";

const SERVICE_LABELS: Record<string, string> = {
  fullService: "Full Service",
  repair: "Repair",
  cleaning: "Cleaning",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  completed: {
    label: "Completed",
    color: "bg-green-500/10 text-green-400 border border-green-500/20",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
};

function getCleaningLabel(booking: Booking | null | undefined): string | null {
  if (!booking?.cleaningSubOption) return null;
  if (booking.cleaningSubOption.__kind__ === "colourFoamWashing")
    return "Colour Foam Washing ₹199";
  if (booking.cleaningSubOption.__kind__ === "normalFoamWashing")
    return "Normal Foam Washing ₹149";
  return null;
}

function BookingCard({
  bookingId,
  index,
  onRemove,
}: {
  bookingId: string;
  index: number;
  onRemove: (id: string) => void;
}) {
  const { data: booking, isLoading, isError } = useGetBooking(bookingId);

  const statusCfg = booking
    ? (STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending)
    : null;
  const cleaningLabel = getCleaningLabel(booking);
  const serviceDisplay = booking
    ? cleaningLabel
      ? `Cleaning – ${cleaningLabel}`
      : SERVICE_LABELS[booking.serviceType] || booking.serviceType
    : null;
  const isEV = booking?.vehicleType === "electric";

  return (
    <div
      data-ocid={`bookings.item.${index + 1}`}
      className="bg-card border border-border rounded-2xl p-5 space-y-4 transition-all hover:border-brand-orange/40"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
            Booking ID
          </p>
          <span className="text-brand-orange font-mono font-bold text-lg tracking-wide">
            {bookingId}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {statusCfg && (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusCfg.color}`}
            >
              {statusCfg.icon}
              {statusCfg.label}
            </span>
          )}
          <button
            type="button"
            data-ocid={`bookings.delete_button.${index + 1}`}
            onClick={() => onRemove(bookingId)}
            aria-label={`Remove booking ${bookingId}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          data-ocid={`bookings.loading_state.${index + 1}`}
          className="flex items-center gap-2 text-muted-foreground text-sm py-2"
        >
          <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
          Loading booking details…
        </div>
      )}

      {/* Error */}
      {(isError || (!isLoading && booking === null)) && (
        <div
          data-ocid={`bookings.error_state.${index + 1}`}
          className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400"
        >
          Booking not found. It may have been removed or the ID is invalid.
        </div>
      )}

      {/* Content */}
      {!isLoading && booking && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-charcoal-light rounded-xl p-3">
              <p className="text-muted-foreground text-xs mb-1">Service</p>
              <p className="text-foreground font-medium text-sm">
                {serviceDisplay}
              </p>
            </div>
            <div className="bg-charcoal-light rounded-xl p-3">
              <p className="text-muted-foreground text-xs mb-1">Vehicle</p>
              <p className="text-foreground font-medium text-sm flex items-center gap-1">
                {isEV && <Zap className="w-3.5 h-3.5 text-green-400" />}
                {booking.vehicleType === "scooter"
                  ? "Scooter"
                  : booking.vehicleType === "motorcycle"
                    ? "Motorcycle"
                    : "Electric"}
                {!isEV && (
                  <span className="text-muted-foreground text-xs">
                    ({booking.capacity === "upTo200cc" ? "≤200cc" : ">200cc"})
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start justify-between gap-2 text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              {booking.customerName}
            </span>
            <span className="text-muted-foreground flex items-center gap-1 text-right max-w-[55%] text-xs">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">{booking.address}</span>
            </span>
          </div>

          {booking.timeSlot && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {booking.timeSlot}
            </div>
          )}

          {booking.mechanicName && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              Mechanic:{" "}
              <span className="text-foreground font-medium ml-0.5">
                {booking.mechanicName}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookingIds, setBookingIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || "[]") as string[];
    } catch {
      return [];
    }
  });
  const [addInput, setAddInput] = useState("");
  const [addError, setAddError] = useState("");

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(bookingIds));
  }, [bookingIds]);

  function handleAdd() {
    const trimmed = addInput.trim().toUpperCase();
    if (!trimmed) {
      setAddError("Please enter a Booking ID.");
      return;
    }
    if (bookingIds.includes(trimmed)) {
      setAddError("This Booking ID is already in your list.");
      return;
    }
    setBookingIds((prev) => [trimmed, ...prev]);
    setAddInput("");
    setAddError("");
  }

  function handleRemove(id: string) {
    setBookingIds((prev) => prev.filter((b) => b !== id));
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <History className="w-8 h-8 text-brand-orange" />
        </div>
        <h1 className="font-display font-black text-3xl text-foreground mb-2">
          My Bookings
        </h1>
        <p className="text-muted-foreground text-sm">
          All your saved booking IDs in one place. Track status anytime.
        </p>
      </div>

      {/* Add Booking ID */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-8">
        <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-orange" />
          Add a Booking ID manually
        </p>
        <div className="flex gap-2">
          <Input
            data-ocid="bookings.input"
            value={addInput}
            onChange={(e) => {
              setAddInput(e.target.value);
              setAddError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            placeholder="e.g. BK-1234567890-ABCD"
            className="bg-charcoal-light border-border text-foreground placeholder:text-muted-foreground focus:border-brand-orange flex-1"
          />
          <Button
            data-ocid="bookings.add_button"
            onClick={handleAdd}
            disabled={!addInput.trim()}
            className="bg-brand-orange hover:bg-brand-orange-light text-charcoal font-semibold px-5"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {addError && (
          <p
            data-ocid="bookings.error_state"
            className="text-red-400 text-xs mt-2"
          >
            {addError}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Booking IDs are saved automatically after you book a service.
        </p>
      </div>

      {/* List */}
      {bookingIds.length === 0 ? (
        <div
          data-ocid="bookings.empty_state"
          className="flex flex-col items-center gap-4 py-16 text-center"
        >
          <div className="w-20 h-20 bg-charcoal-light border border-border rounded-full flex items-center justify-center mb-2">
            <BookOpen className="w-9 h-9 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            No saved bookings yet
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            Your Booking IDs are saved automatically after booking. You can also
            add them manually above.
          </p>
          <Button
            data-ocid="bookings.primary_button"
            onClick={() => navigate({ to: "/full-service" })}
            className="bg-brand-orange hover:bg-brand-orange-light text-charcoal font-bold px-6 py-3 rounded-xl shadow-orange-glow transition-all"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book a Service
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground text-right">
            {bookingIds.length} booking{bookingIds.length !== 1 ? "s" : ""}{" "}
            saved
          </p>
          {bookingIds.map((id, idx) => (
            <BookingCard
              key={id}
              bookingId={id}
              index={idx}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

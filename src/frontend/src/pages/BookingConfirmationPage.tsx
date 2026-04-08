import { Button } from "@/components/ui/button";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Calendar,
  Check,
  CheckCircle,
  Copy,
  History,
  Home,
  MessageCircle,
  Phone,
  Search,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useGetBooking } from "../hooks/useQueries";

const LS_KEY = "cleanio_booking_ids";

const SERVICE_LABELS: Record<string, string> = {
  fullService: "Full Service",
  repair: "Repair",
  cleaning: "Cleaning",
};

function getCleaningLabel(
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
  const [copied, setCopied] = useState(false);

  // Auto-save booking ID to localStorage
  useEffect(() => {
    if (!bookingId) return;
    try {
      const existing: string[] = JSON.parse(
        localStorage.getItem(LS_KEY) || "[]",
      );
      if (!existing.includes(bookingId)) {
        existing.unshift(bookingId);
        localStorage.setItem(LS_KEY, JSON.stringify(existing));
      }
    } catch {
      // ignore storage errors
    }
  }, [bookingId]);

  const cleaningLabel = getCleaningLabel(booking ?? null);
  const serviceDisplay = cleaningLabel
    ? `Cleaning – ${cleaningLabel}`
    : SERVICE_LABELS[service] || service;

  function handleCopy() {
    navigator.clipboard.writeText(bookingId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const whatsappMessage = encodeURIComponent(
    `Hi Cleanio! 👋\nI just booked a service.\nBooking ID: ${bookingId}\nService: ${serviceDisplay}\nSlot: ${slot}\n\nCan you confirm my booking?`,
  );
  const whatsappUrl = `https://wa.me/919637113065?text=${whatsappMessage}`;

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <div className="bg-card border border-border rounded-3xl p-8 shadow-card animate-fade-in-up">
        {/* Success Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center mb-5 animate-pulse-orange">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="font-display font-black text-3xl text-foreground mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
            Your service request has been received. Our team will call you
            shortly to confirm.
          </p>
        </div>

        {/* Booking ID — prominent orange box */}
        <div
          data-ocid="booking.id.panel"
          className="bg-brand-orange/10 border-2 border-brand-orange/40 rounded-2xl px-6 py-5 mb-6 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-2">
            Your Booking ID
          </p>
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="text-brand-orange font-mono font-black text-2xl tracking-wider">
              {bookingId}
            </span>
            <button
              data-ocid="booking.id.button"
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy Booking ID"}
              className="flex items-center gap-1.5 bg-brand-orange/20 hover:bg-brand-orange/30 border border-brand-orange/40 text-brand-orange rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Save this ID to track your booking anytime
          </p>
        </div>

        {/* Service Details */}
        <div className="bg-charcoal-light border border-border rounded-2xl p-5 space-y-3 mb-5">
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
            <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-semibold px-2.5 py-1 rounded-full">
              Pending Confirmation
            </span>
          </div>
          {!isLoading && booking?.mechanicName && (
            <>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> Mechanic
                </span>
                <span className="text-foreground font-medium text-sm">
                  {booking.mechanicName}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Call Confirmation Banner */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Phone className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-400 mb-0.5">
                Our team will call you to confirm
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A Cleanio technician will call you on your registered number
                shortly to confirm your booking slot and share their ETA.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            data-ocid="booking.track.button"
            onClick={() => navigate({ to: "/track-booking" })}
            className="w-full bg-brand-orange hover:bg-brand-orange-light text-charcoal font-bold py-3 rounded-xl shadow-orange-glow transition-all"
          >
            <Search className="w-4 h-4 mr-2" />
            Track My Booking
          </Button>
          <Button
            data-ocid="booking.history.button"
            onClick={() => navigate({ to: "/my-bookings" })}
            variant="outline"
            className="w-full border-brand-orange/40 text-brand-orange hover:bg-brand-orange/10 hover:border-brand-orange rounded-xl transition-all"
          >
            <History className="w-4 h-4 mr-2" />
            View All My Bookings
          </Button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="booking.whatsapp.button"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 transition-all text-sm font-semibold"
          >
            <MessageCircle className="w-4 h-4" />
            Share via WhatsApp
          </a>
          <Button
            data-ocid="booking.home.button"
            onClick={() => navigate({ to: "/" })}
            variant="outline"
            className="w-full border-border text-foreground hover:bg-charcoal-light hover:border-brand-orange/50 rounded-xl transition-all"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

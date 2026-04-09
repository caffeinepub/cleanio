import { Button } from "@/components/ui/button";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Calendar,
  Check,
  CheckCircle,
  Copy,
  History,
  Home,
  Phone,
  Search,
  UserCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Booking } from "../backend";
import { VehicleType } from "../backend";
import { useGetBooking } from "../hooks/useQueries";

const LS_KEY = "cleanio_booking_ids";

const SERVICE_LABELS: Record<string, string> = {
  fullService: "Full Service",
  repair: "Repair",
  cleaning: "Cleaning",
};

function getCleaningLabel(booking: Booking | null): string | null {
  if (!booking?.cleaningSubOption) return null;
  if (booking.cleaningSubOption.__kind__ === "colourFoamWashing")
    return "Colour Foam Washing ₹199";
  if (booking.cleaningSubOption.__kind__ === "normalFoamWashing")
    return "Normal Foam Washing ₹149";
  return null;
}

/** Format a raw 10-digit phone number to WhatsApp-compatible E.164 (no leading +) */
function formatPhoneForWhatsApp(raw: string): string {
  let cleaned = raw.replace(/[\s-]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = `91${cleaned.slice(1)}`;
  }
  if (!cleaned.startsWith("+") && cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  }
  cleaned = cleaned.replace(/^\+/, "");
  return cleaned;
}

function getVehicleDisplay(booking: Booking | null): string {
  if (booking?.vehicleType === VehicleType.electric)
    return "⚡ Electric Vehicle";
  if (booking?.vehicleType === VehicleType.motorcycle) return "Motorcycle";
  return "Scooter";
}

function buildWhatsAppUrl(opts: {
  bookingId: string;
  serviceDisplay: string;
  vehicleDisplay: string;
  slot: string;
  trackingLink: string;
  phone?: string;
}): string {
  const {
    bookingId,
    serviceDisplay,
    vehicleDisplay,
    slot,
    trackingLink,
    phone,
  } = opts;
  const msg = encodeURIComponent(
    `Hi! Your Cleanio booking is confirmed! 🎉\n\n🔖 *Booking ID:* ${bookingId}\n🔧 *Service:* ${serviceDisplay}\n🚗 *Vehicle:* ${vehicleDisplay}\n🕐 *Time Slot:* ${slot}\n\n📍 *Track your booking here:*\n${trackingLink}\n\nSave this message to track your booking anytime.`,
  );
  if (phone) {
    const formatted = formatPhoneForWhatsApp(phone);
    return `https://wa.me/${formatted}?text=${msg}`;
  }
  return `https://wa.me/?text=${msg}`;
}

export default function BookingConfirmationPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/confirmation" });
  const { bookingId, name, service, slot, phone } = search as {
    bookingId: string;
    name: string;
    service: string;
    slot: string;
    phone?: string;
  };

  const { data: booking, isLoading } = useGetBooking(bookingId);
  const [copied, setCopied] = useState(false);
  const autoOpenedRef = useRef(false);

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

  const vehicleDisplay = getVehicleDisplay(booking ?? null);
  const trackingLink = `${window.location.origin}/track-booking`;

  // Auto-open WhatsApp on mount (best-effort — browsers may block without user gesture)
  useEffect(() => {
    if (autoOpenedRef.current || !bookingId) return;
    autoOpenedRef.current = true;
    const url = buildWhatsAppUrl({
      bookingId,
      serviceDisplay,
      vehicleDisplay,
      slot,
      trackingLink,
      phone,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  }, [bookingId, serviceDisplay, vehicleDisplay, slot, trackingLink, phone]);

  function handleCopy() {
    navigator.clipboard.writeText(bookingId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const hasPhone = !!phone;
  const whatsAppUrl = buildWhatsAppUrl({
    bookingId,
    serviceDisplay,
    vehicleDisplay,
    slot,
    trackingLink,
    phone,
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <div className="bg-card border border-border rounded-3xl p-8 shadow-card animate-fade-in-up">
        {/* Success Icon */}
        <div className="flex flex-col items-center text-center mb-6">
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

        {/* WhatsApp auto-send notice */}
        <div
          data-ocid="booking.whatsapp.notice"
          className={`rounded-2xl px-4 py-3 mb-6 flex items-start gap-3 ${
            hasPhone
              ? "bg-green-500/10 border border-green-500/30"
              : "bg-muted/50 border border-border"
          }`}
        >
          <span className="text-xl flex-shrink-0 mt-0.5">
            {hasPhone ? "✅" : "💬"}
          </span>
          <p className="text-sm text-foreground leading-relaxed">
            {hasPhone
              ? "Booking details have been sent to your WhatsApp!"
              : "Tap the button below to get your booking details on WhatsApp."}
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

          {/* WhatsApp resend — secondary CTA (auto-send already happened) */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="booking.whatsapp.self.button"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-[#25D366]/50 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-all text-sm font-semibold"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 flex-shrink-0"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Resend Booking Details on WhatsApp
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

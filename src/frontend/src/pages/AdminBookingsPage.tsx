import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  ClipboardList,
  CreditCard,
  Download,
  Loader2,
  LogOut,
  QrCode,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type Booking, Status, VehicleType } from "../backend";
import { QRCodeCanvas } from "../components/QRCode";
import { useActor } from "../hooks/useActor";
import { useAdminAuth } from "../hooks/useAdminAuth";
import {
  useAssignMechanic,
  useGetBookings,
  useUpdateBookingStatus,
} from "../hooks/useQueries";

const LS_KEY = "cleanio_last_seen_booking_count";

const SERVICE_LABELS: Record<string, string> = {
  fullService: "Full Service",
  repair: "Repair",
  cleaning: "Cleaning",
};

const VEHICLE_LABELS: Record<string, string> = {
  scooter: "🛵 Scooter",
  motorcycle: "🏍️ Motorcycle",
  electric: "⚡ Electric",
};

const CAPACITY_LABELS: Record<string, string> = {
  upTo200cc: "Upto 200cc",
  above200cc: "Above 200cc",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
};

function getCleaningSubOptionLabel(booking: Booking): string | null {
  if (!booking.cleaningSubOption) return null;
  if (booking.cleaningSubOption.__kind__ === "colourFoamWashing") {
    return "Colour Foam Washing ₹199";
  }
  if (booking.cleaningSubOption.__kind__ === "normalFoamWashing") {
    return "Normal Foam Washing ₹149";
  }
  return null;
}

function BookingCard({ booking }: { booking: Booking }) {
  const updateStatus = useUpdateBookingStatus();
  const assignMechanic = useAssignMechanic();
  const [localStatus, setLocalStatus] = useState<Status>(booking.status);
  const [mechanicInput, setMechanicInput] = useState(
    booking.mechanicName ?? "",
  );
  const [mechanicSaved, setMechanicSaved] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    const status = newStatus as Status;
    setLocalStatus(status);
    try {
      await updateStatus.mutateAsync({ id: booking.id, newStatus: status });
    } catch {
      setLocalStatus(booking.status);
    }
  };

  const handleAssignMechanic = async () => {
    if (!mechanicInput.trim()) return;
    try {
      await assignMechanic.mutateAsync({
        id: booking.id,
        mechanicName: mechanicInput.trim(),
      });
      setMechanicSaved(true);
      setTimeout(() => setMechanicSaved(false), 2000);
    } catch {
      // error handled silently
    }
  };

  const cleaningLabel = getCleaningSubOptionLabel(booking);
  const isEV = booking.vehicleType === VehicleType.electric;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-brand-orange/50 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">
                {booking.customerName}
              </p>
              <p className="text-sm text-muted-foreground">
                {booking.phoneNumber}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[booking.status]}`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          {/* Service Info */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-brand-orange/10 text-brand-orange border border-brand-orange/20 text-xs font-medium px-2.5 py-1 rounded-full">
              {SERVICE_LABELS[booking.serviceType] || booking.serviceType}
              {cleaningLabel && ` – ${cleaningLabel}`}
            </span>
            {isEV ? (
              <span className="bg-green-500/10 text-green-400 border border-green-500/30 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                ⚡ Electric Vehicle
              </span>
            ) : (
              <span className="bg-charcoal-light border border-border text-muted-foreground text-xs px-2.5 py-1 rounded-full">
                {VEHICLE_LABELS[booking.vehicleType] || booking.vehicleType}
              </span>
            )}
            {!isEV && (
              <span className="bg-charcoal-light border border-border text-muted-foreground text-xs px-2.5 py-1 rounded-full">
                {CAPACITY_LABELS[booking.capacity] || booking.capacity}
              </span>
            )}
          </div>

          {/* Address */}
          <p className="text-xs text-muted-foreground">📍 {booking.address}</p>

          {/* Repair Details */}
          {booking.repairDetails && (
            <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                🔧 Repair Issue
              </p>
              <p className="text-xs text-foreground">{booking.repairDetails}</p>
            </div>
          )}

          {/* Mechanic Assignment */}
          <div className="bg-charcoal-light border border-border rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <UserCheck className="w-3.5 h-3.5 text-brand-orange" />
              <p className="text-xs text-muted-foreground font-medium">
                Assigned Mechanic
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                value={mechanicInput}
                onChange={(e) => setMechanicInput(e.target.value)}
                placeholder="Enter mechanic name"
                className="bg-charcoal border-border text-foreground placeholder:text-muted-foreground focus:border-brand-orange text-xs h-8 flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAssignMechanic();
                  }
                }}
              />
              <Button
                size="sm"
                onClick={handleAssignMechanic}
                disabled={assignMechanic.isPending || !mechanicInput.trim()}
                className={`h-8 px-3 text-xs font-semibold transition-all ${
                  mechanicSaved
                    ? "bg-green-600 hover:bg-green-600 text-white"
                    : "bg-brand-orange hover:bg-brand-orange-light text-charcoal"
                }`}
              >
                {assignMechanic.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : mechanicSaved ? (
                  "✓ Saved"
                ) : (
                  "Assign"
                )}
              </Button>
            </div>
          </div>

          {/* Booking ID */}
          <p className="text-xs text-muted-foreground font-mono">
            ID: {booking.id}
          </p>
        </div>

        {/* Status Update */}
        <div className="sm:w-40 flex-shrink-0">
          <p className="text-xs text-muted-foreground mb-1.5 font-medium">
            Update Status
          </p>
          <Select
            value={localStatus}
            onValueChange={handleStatusChange}
            disabled={updateStatus.isPending}
          >
            <SelectTrigger className="bg-charcoal-light border-border text-foreground text-xs h-9">
              {updateStatus.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <SelectValue />
              )}
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem
                value={Status.pending}
                className="text-foreground text-xs"
              >
                Pending
              </SelectItem>
              <SelectItem
                value={Status.confirmed}
                className="text-foreground text-xs"
              >
                Confirmed
              </SelectItem>
              <SelectItem
                value={Status.completed}
                className="text-foreground text-xs"
              >
                Completed
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

// ---------- Stripe Config Modal ----------
function StripeConfigModal() {
  const { actor } = useActor();
  const [open, setOpen] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checkingConfig, setCheckingConfig] = useState(false);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if Stripe is already configured when the modal opens
  useEffect(() => {
    if (!open || !actor) return;
    setCheckingConfig(true);
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (actor as any)
      .isStripeConfigured()
      .then((result: boolean) => {
        setIsConfigured(result);
      })
      .catch(() => {
        setIsConfigured(false);
      })
      .finally(() => {
        setCheckingConfig(false);
      });
  }, [open, actor]);

  const handleSave = async () => {
    if (!actor || !secretKey.trim()) return;
    setSaving(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).setStripeConfiguration({
        secretKey: secretKey.trim(),
        allowedCountries: ["IN"],
      });
      setSaved(true);
      setIsConfigured(true);
      setSecretKey("");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Failed to save: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          data-ocid="admin.stripe_config.open_modal_button"
          className={`border-border text-foreground hover:bg-charcoal-light hover:border-brand-orange transition-all ${
            isConfigured ? "border-green-500/50 text-green-400" : ""
          }`}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {isConfigured === true ? "Payments ✓" : "Setup Payments"}
        </Button>
      </DialogTrigger>
      <DialogContent
        data-ocid="admin.stripe_config.dialog"
        className="bg-card border-border max-w-sm w-full"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground font-display text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-orange" />
            Stripe Payment Setup
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {checkingConfig ? (
            <div
              className="flex items-center gap-2 text-muted-foreground text-sm"
              data-ocid="admin.stripe_config.loading_state"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking configuration…
            </div>
          ) : isConfigured ? (
            <div
              className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4"
              data-ocid="admin.stripe_config.success_state"
            >
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-sm font-semibold text-green-400">
                  Payments Configured
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Stripe is active. Customers can pay online for Premium Plans.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-xl p-3 text-xs text-muted-foreground leading-relaxed">
              Enter your Stripe Secret Key to enable online payments for Premium
              Plans. You can find this in your{" "}
              <span className="text-brand-orange">Stripe Dashboard</span> →
              Developers → API keys.
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="stripe-secret-key"
              className="text-xs text-muted-foreground font-medium"
            >
              {isConfigured ? "Update Stripe Secret Key" : "Stripe Secret Key"}
            </label>
            <Input
              id="stripe-secret-key"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="sk_live_... or sk_test_..."
              data-ocid="admin.stripe_config.input"
              className="bg-charcoal border-border text-foreground placeholder:text-muted-foreground focus:border-brand-orange text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>

          {error && (
            <p
              className="text-xs text-red-400"
              data-ocid="admin.stripe_config.error_state"
            >
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              onClick={handleSave}
              disabled={saving || !secretKey.trim()}
              data-ocid="admin.stripe_config.save_button"
              className={`flex-1 font-semibold transition-all ${
                saved
                  ? "bg-green-600 hover:bg-green-600 text-white"
                  : "bg-brand-orange hover:bg-brand-orange-light text-charcoal"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : saved ? (
                "✓ Saved!"
              ) : (
                "Save Configuration"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              data-ocid="admin.stripe_config.cancel_button"
              className="border-border text-muted-foreground hover:text-foreground hover:bg-charcoal-light"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- QR Code Modal ----------
function QRCodeModal() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [open, setOpen] = useState(false);

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://cleanio.icp0.io";

  const handleDownload = useCallback(() => {
    // Find the canvas element rendered by QRCodeCanvas inside the ref container
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "cleanio-booking-qr.png";
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          data-ocid="admin.qr_code.open_modal_button"
          className="border-brand-orange/50 text-brand-orange hover:bg-brand-orange hover:text-charcoal transition-all"
        >
          <QrCode className="w-4 h-4 mr-2" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent
        data-ocid="admin.qr_code.dialog"
        className="bg-card border-border max-w-sm w-full"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground font-display text-lg flex items-center gap-2">
            <QrCode className="w-5 h-5 text-brand-orange" />
            Customer Booking QR Code
          </DialogTitle>
        </DialogHeader>

        {/* QR Card */}
        <div className="flex flex-col items-center gap-5 py-2">
          {/* White QR background for scan compatibility */}
          <div
            ref={canvasRef}
            className="bg-white rounded-2xl p-5 shadow-lg border-4 border-brand-orange/30"
          >
            <QRCodeCanvas
              value={siteUrl}
              size={240}
              bgColor="#ffffff"
              fgColor="#111111"
            />
          </div>

          {/* Branding label */}
          <div className="text-center space-y-1">
            <p className="font-poppins text-xl font-bold">
              <span className="text-brand-orange">Clean</span>
              <span className="text-white">io</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Scan to book doorstep two-wheeler service
            </p>
            <p className="text-xs text-muted-foreground/60 font-mono truncate max-w-[220px]">
              {siteUrl}
            </p>
          </div>

          {/* Action buttons */}
          <Button
            onClick={handleDownload}
            data-ocid="admin.qr_code.download.button"
            className="w-full bg-brand-orange hover:bg-brand-orange-light text-charcoal font-semibold transition-all"
          >
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>

          {downloaded && (
            <p
              data-ocid="admin.qr_code.success_state"
              className="text-xs text-green-400 text-center"
            >
              ✓ QR code download started
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Main Page ----------
export default function AdminBookingsPage() {
  const { data: bookings, isLoading, refetch, isFetching } = useGetBookings();
  const { logout } = useAdminAuth();
  const [filter, setFilter] = useState<string>("all");

  // ── Notification badge logic ──────────────────────────────────────────────
  const totalCount = bookings?.length ?? 0;

  const readLastSeenFromStorage = useCallback((): number => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      return stored !== null ? Number.parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  }, []);

  const [lastSeenCount, setLastSeenCount] = useState<number>(
    readLastSeenFromStorage,
  );
  const newBookingCount = Math.max(0, totalCount - lastSeenCount);

  // Once we have real data and page is loaded, mark all as seen
  useEffect(() => {
    if (!isLoading && bookings !== undefined && totalCount > 0) {
      try {
        localStorage.setItem(LS_KEY, String(totalCount));
        setLastSeenCount(totalCount);
      } catch {
        // ignore
      }
    }
  }, [isLoading, bookings, totalCount]);

  // ── Publish new count to Layout badge via custom event ────────────────────
  useEffect(() => {
    const prevSeen = readLastSeenFromStorage();
    const count = isLoading ? 0 : Math.max(0, totalCount - prevSeen);
    window.dispatchEvent(
      new CustomEvent("cleanio:new-booking-count", { detail: { count } }),
    );
  }, [isLoading, totalCount, readLastSeenFromStorage]);

  // ── Filters ───────────────────────────────────────────────────────────────
  const filtered =
    bookings?.filter((b) => filter === "all" || b.status === filter) ?? [];

  const counts = {
    all: bookings?.length ?? 0,
    pending: bookings?.filter((b) => b.status === Status.pending).length ?? 0,
    confirmed:
      bookings?.filter((b) => b.status === Status.confirmed).length ?? 0,
    completed:
      bookings?.filter((b) => b.status === Status.completed).length ?? 0,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-orange/10 border border-brand-orange/20 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-foreground">
              Bookings
            </h1>
            <p className="text-muted-foreground text-sm">
              {counts.all} total bookings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Stripe Config button */}
          <StripeConfigModal />

          {/* QR Code button */}
          <QRCodeModal />

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            data-ocid="admin.bookings.secondary_button"
            className="border-border text-foreground hover:bg-charcoal-light hover:border-brand-orange transition-all"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            data-ocid="admin.logout.button"
            className="border-border text-muted-foreground hover:text-foreground hover:bg-charcoal-light hover:border-red-500/50 transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* New Bookings Banner */}
      {newBookingCount > 0 && (
        <div
          data-ocid="admin.new_bookings.success_state"
          className="flex items-center gap-3 mb-6 px-4 py-3 bg-brand-orange/10 border border-brand-orange/30 rounded-xl"
        >
          <Bell className="w-4 h-4 text-brand-orange flex-shrink-0 animate-pulse" />
          <p className="text-sm text-brand-orange font-medium">
            {newBookingCount} new{" "}
            {newBookingCount === 1 ? "booking" : "bookings"} since your last
            visit
          </p>
        </div>
      )}

      {/* Filter Tabs */}
      <div
        className="flex gap-2 mb-6 overflow-x-auto pb-1"
        data-ocid="admin.bookings.tab"
      >
        {[
          { key: "all", label: "All", count: counts.all },
          { key: "pending", label: "Pending", count: counts.pending },
          { key: "confirmed", label: "Confirmed", count: counts.confirmed },
          { key: "completed", label: "Completed", count: counts.completed },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              filter === tab.key
                ? "bg-brand-orange text-charcoal shadow-orange-glow"
                : "bg-charcoal-light border border-border text-muted-foreground hover:text-foreground hover:border-brand-orange/50"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === tab.key ? "bg-charcoal/20" : "bg-charcoal-mid"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-4" data-ocid="admin.bookings.loading_state">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <Skeleton className="h-4 w-40 mb-3 bg-charcoal-light" />
              <Skeleton className="h-3 w-24 mb-4 bg-charcoal-light" />
              <Skeleton className="h-3 w-full bg-charcoal-light" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-16"
          data-ocid="admin.bookings.empty_state"
        >
          <div className="w-16 h-16 bg-charcoal-light border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            No bookings found
          </h3>
          <p className="text-muted-foreground text-sm">
            {filter === "all"
              ? "No bookings have been made yet."
              : `No ${filter} bookings at the moment.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4" data-ocid="admin.bookings.list">
          {filtered.map((booking, idx) => (
            <div key={booking.id} data-ocid={`admin.bookings.item.${idx + 1}`}>
              <BookingCard booking={booking} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

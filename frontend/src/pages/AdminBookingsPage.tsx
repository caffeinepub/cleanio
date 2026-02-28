import { useState } from 'react';
import { Loader2, RefreshCw, ClipboardList, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetBookings, useUpdateBookingStatus, useAssignMechanic } from '../hooks/useQueries';
import { type Booking, Status } from '../backend';

const SERVICE_LABELS: Record<string, string> = {
  fullService: 'Full Service',
  repair: 'Repair',
  cleaning: 'Cleaning',
};

const VEHICLE_LABELS: Record<string, string> = {
  scooter: '🛵 Scooter',
  motorcycle: '🏍️ Motorcycle',
};

const CAPACITY_LABELS: Record<string, string> = {
  upTo200cc: 'Upto 200cc',
  above200cc: 'Above 200cc',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
};

function getCleaningSubOptionLabel(booking: Booking): string | null {
  if (!booking.cleaningSubOption) return null;
  if (booking.cleaningSubOption.__kind__ === 'colourFoamWashing') {
    return 'Colour Foam Washing ₹199';
  }
  if (booking.cleaningSubOption.__kind__ === 'normalFoamWashing') {
    return 'Normal Foam Washing ₹149';
  }
  return null;
}

function BookingCard({ booking }: { booking: Booking }) {
  const updateStatus = useUpdateBookingStatus();
  const assignMechanic = useAssignMechanic();
  const [localStatus, setLocalStatus] = useState<Status>(booking.status);
  const [mechanicInput, setMechanicInput] = useState(booking.mechanicName ?? '');
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
      await assignMechanic.mutateAsync({ id: booking.id, mechanicName: mechanicInput.trim() });
      setMechanicSaved(true);
      setTimeout(() => setMechanicSaved(false), 2000);
    } catch {
      // error handled silently
    }
  };

  const cleaningLabel = getCleaningSubOptionLabel(booking);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-brand-orange/50 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">{booking.customerName}</p>
              <p className="text-sm text-muted-foreground">{booking.phoneNumber}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[booking.status]}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          {/* Service Info */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-brand-orange/10 text-brand-orange border border-brand-orange/20 text-xs font-medium px-2.5 py-1 rounded-full">
              {SERVICE_LABELS[booking.serviceType] || booking.serviceType}
              {cleaningLabel && ` – ${cleaningLabel}`}
            </span>
            <span className="bg-charcoal-light border border-border text-muted-foreground text-xs px-2.5 py-1 rounded-full">
              {VEHICLE_LABELS[booking.vehicleType] || booking.vehicleType}
            </span>
            <span className="bg-charcoal-light border border-border text-muted-foreground text-xs px-2.5 py-1 rounded-full">
              {CAPACITY_LABELS[booking.capacity] || booking.capacity}
            </span>
          </div>

          {/* Address */}
          <p className="text-xs text-muted-foreground">
            📍 {booking.address}
          </p>

          {/* Repair Details */}
          {booking.repairDetails && (
            <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">🔧 Repair Issue</p>
              <p className="text-xs text-foreground">{booking.repairDetails}</p>
            </div>
          )}

          {/* Mechanic Assignment */}
          <div className="bg-charcoal-light border border-border rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <UserCheck className="w-3.5 h-3.5 text-brand-orange" />
              <p className="text-xs text-muted-foreground font-medium">Assigned Mechanic</p>
            </div>
            <div className="flex gap-2">
              <Input
                value={mechanicInput}
                onChange={(e) => setMechanicInput(e.target.value)}
                placeholder="Enter mechanic name"
                className="bg-charcoal border-border text-foreground placeholder:text-muted-foreground focus:border-brand-orange text-xs h-8 flex-1"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAssignMechanic(); } }}
              />
              <Button
                size="sm"
                onClick={handleAssignMechanic}
                disabled={assignMechanic.isPending || !mechanicInput.trim()}
                className={`h-8 px-3 text-xs font-semibold transition-all ${
                  mechanicSaved
                    ? 'bg-green-600 hover:bg-green-600 text-white'
                    : 'bg-brand-orange hover:bg-brand-orange-light text-charcoal'
                }`}
              >
                {assignMechanic.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : mechanicSaved ? (
                  '✓ Saved'
                ) : (
                  'Assign'
                )}
              </Button>
            </div>
          </div>

          {/* Booking ID */}
          <p className="text-xs text-muted-foreground font-mono">ID: {booking.id}</p>
        </div>

        {/* Status Update */}
        <div className="sm:w-40 flex-shrink-0">
          <p className="text-xs text-muted-foreground mb-1.5 font-medium">Update Status</p>
          <Select value={localStatus} onValueChange={handleStatusChange} disabled={updateStatus.isPending}>
            <SelectTrigger className="bg-charcoal-light border-border text-foreground text-xs h-9">
              {updateStatus.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <SelectValue />
              )}
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value={Status.pending} className="text-foreground text-xs">Pending</SelectItem>
              <SelectItem value={Status.confirmed} className="text-foreground text-xs">Confirmed</SelectItem>
              <SelectItem value={Status.completed} className="text-foreground text-xs">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default function AdminBookingsPage() {
  const { data: bookings, isLoading, refetch, isFetching } = useGetBookings();
  const [filter, setFilter] = useState<string>('all');

  const filtered = bookings?.filter((b) => filter === 'all' || b.status === filter) ?? [];

  const counts = {
    all: bookings?.length ?? 0,
    pending: bookings?.filter((b) => b.status === Status.pending).length ?? 0,
    confirmed: bookings?.filter((b) => b.status === Status.confirmed).length ?? 0,
    completed: bookings?.filter((b) => b.status === Status.completed).length ?? 0,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-orange/10 border border-brand-orange/20 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-foreground">Bookings</h1>
            <p className="text-muted-foreground text-sm">{counts.all} total bookings</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="border-border text-foreground hover:bg-charcoal-light hover:border-brand-orange transition-all"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All', count: counts.all },
          { key: 'pending', label: 'Pending', count: counts.pending },
          { key: 'confirmed', label: 'Confirmed', count: counts.confirmed },
          { key: 'completed', label: 'Completed', count: counts.completed },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              filter === tab.key
                ? 'bg-brand-orange text-charcoal shadow-orange-glow'
                : 'bg-charcoal-light border border-border text-muted-foreground hover:text-foreground hover:border-brand-orange/50'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              filter === tab.key ? 'bg-charcoal/20' : 'bg-charcoal-mid'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5">
              <Skeleton className="h-4 w-40 mb-3 bg-charcoal-light" />
              <Skeleton className="h-3 w-24 mb-4 bg-charcoal-light" />
              <Skeleton className="h-3 w-full bg-charcoal-light" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-charcoal-light border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">No bookings found</h3>
          <p className="text-muted-foreground text-sm">
            {filter === 'all' ? 'No bookings have been made yet.' : `No ${filter} bookings.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}

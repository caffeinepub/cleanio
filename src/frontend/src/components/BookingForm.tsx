import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Capacity,
  type CleaningSubOption,
  ServiceType,
  VehicleType,
} from "../backend";
import { useCreateBooking } from "../hooks/useQueries";

interface BookingFormProps {
  serviceType: ServiceType;
  repairDetails?: string;
  defaultCapacity?: Capacity;
  showCapacitySelector?: boolean;
  showPricing?: boolean;
  cleaningSubOption?: "colourFoam" | "normalFoam";
  cleaningPrice?: number;
}

const TIME_SLOTS = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
];

const CLEANING_OPTION_LABELS: Record<string, string> = {
  colourFoam: "Colour Foam Washing",
  normalFoam: "Normal Foam Washing",
};

export default function BookingForm({
  serviceType,
  repairDetails,
  defaultCapacity = Capacity.upTo200cc,
  showCapacitySelector = false,
  showPricing = false,
  cleaningSubOption,
  cleaningPrice,
}: BookingFormProps) {
  const navigate = useNavigate();
  const createBooking = useCreateBooking();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>(
    VehicleType.scooter,
  );
  const [capacity, setCapacity] = useState<Capacity>(defaultCapacity);
  const [timeSlot, setTimeSlot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const price = capacity === Capacity.upTo200cc ? 899 : 1199;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!phone.trim() || !/^\d{10}$/.test(phone.trim()))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!timeSlot) newErrors.timeSlot = "Please select a time slot";
    return newErrors;
  };

  const buildCleaningSubOption = (): CleaningSubOption | null => {
    if (serviceType !== ServiceType.cleaning || !cleaningSubOption) return null;
    if (cleaningSubOption === "colourFoam") {
      return { __kind__: "colourFoamWashing", colourFoamWashing: BigInt(199) };
    }
    return { __kind__: "normalFoamWashing", normalFoamWashing: BigInt(149) };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitError(null);

    const bookingId = `BK-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const fullAddress = `${address} | Slot: ${timeSlot}`;

    const subOption = buildCleaningSubOption();

    try {
      await createBooking.mutateAsync({
        id: bookingId,
        customerName: name.trim(),
        phoneNumber: phone.trim(),
        address: fullAddress,
        vehicleType,
        capacity,
        serviceType,
        repairDetails: repairDetails ? repairDetails : null,
        cleaningSubOption: subOption,
      });

      navigate({
        to: "/confirmation",
        search: {
          bookingId,
          name: name.trim(),
          service: serviceType,
          slot: timeSlot,
        },
      });
    } catch (err) {
      console.error("[BookingForm] Booking submission error:", err);
      const message = err instanceof Error ? err.message : String(err);
      setSubmitError(message || "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Capacity Selector with Pricing */}
      {showCapacitySelector && (
        <div className="space-y-3">
          <Label className="text-foreground font-semibold">
            Engine Capacity
          </Label>
          <RadioGroup
            value={capacity}
            onValueChange={(v) => setCapacity(v as Capacity)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <label
              htmlFor="upto200"
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                capacity === Capacity.upTo200cc
                  ? "border-brand-orange bg-brand-orange/10"
                  : "border-border hover:border-brand-orange/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={Capacity.upTo200cc} id="upto200" />
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Upto 200cc
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Scooters, small bikes
                  </p>
                </div>
              </div>
              <span className="text-brand-orange font-black text-lg">₹899</span>
            </label>

            <label
              htmlFor="above200"
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                capacity === Capacity.above200cc
                  ? "border-brand-orange bg-brand-orange/10"
                  : "border-border hover:border-brand-orange/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={Capacity.above200cc} id="above200" />
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Above 200cc
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sports, cruiser bikes
                  </p>
                </div>
              </div>
              <span className="text-brand-orange font-black text-lg">
                ₹1199
              </span>
            </label>
          </RadioGroup>

          {showPricing && (
            <div className="flex items-center justify-between p-4 bg-brand-orange/10 border border-brand-orange/30 rounded-xl">
              <span className="text-foreground font-medium">Total Amount</span>
              <span className="text-brand-orange font-black text-2xl">
                ₹{price}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Cleaning Sub-Option Summary */}
      {serviceType === ServiceType.cleaning &&
        cleaningSubOption &&
        cleaningPrice && (
          <div className="flex items-center justify-between p-4 bg-brand-orange/10 border border-brand-orange/30 rounded-xl">
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-0.5">
                Selected Wash
              </p>
              <p className="text-sm font-semibold text-foreground">
                {CLEANING_OPTION_LABELS[cleaningSubOption]}
              </p>
            </div>
            <span className="text-brand-orange font-black text-2xl">
              ₹{cleaningPrice}
            </span>
          </div>
        )}

      {/* Vehicle Type */}
      <div className="space-y-3">
        <Label className="text-foreground font-semibold">Vehicle Type</Label>
        <RadioGroup
          value={vehicleType}
          onValueChange={(v) => setVehicleType(v as VehicleType)}
          className="flex gap-4"
        >
          <label
            htmlFor="scooter"
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all flex-1 ${
              vehicleType === VehicleType.scooter
                ? "border-brand-orange bg-brand-orange/10"
                : "border-border hover:border-brand-orange/50"
            }`}
          >
            <RadioGroupItem value={VehicleType.scooter} id="scooter" />
            <span className="text-sm font-medium text-foreground">
              🛵 Scooter
            </span>
          </label>
          <label
            htmlFor="motorcycle"
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all flex-1 ${
              vehicleType === VehicleType.motorcycle
                ? "border-brand-orange bg-brand-orange/10"
                : "border-border hover:border-brand-orange/50"
            }`}
          >
            <RadioGroupItem value={VehicleType.motorcycle} id="motorcycle" />
            <span className="text-sm font-medium text-foreground">
              🏍️ Motorcycle
            </span>
          </label>
        </RadioGroup>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground font-semibold">
          Full Name
        </Label>
        <Input
          id="name"
          data-ocid="booking.input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className="bg-charcoal-light border-border text-foreground placeholder:text-muted-foreground focus:border-brand-orange"
        />
        {errors.name && (
          <p className="text-destructive text-xs">{errors.name}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground font-semibold">
          Phone Number
        </Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="10-digit mobile number"
          maxLength={10}
          className="bg-charcoal-light border-border text-foreground placeholder:text-muted-foreground focus:border-brand-orange"
        />
        {errors.phone && (
          <p className="text-destructive text-xs">{errors.phone}</p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-foreground font-semibold">
          Doorstep Address
        </Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Full address for doorstep service"
          className="bg-charcoal-light border-border text-foreground placeholder:text-muted-foreground focus:border-brand-orange"
        />
        {errors.address && (
          <p className="text-destructive text-xs">{errors.address}</p>
        )}
      </div>

      {/* Time Slot */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">
          Preferred Time Slot
        </Label>
        <Select value={timeSlot} onValueChange={setTimeSlot}>
          <SelectTrigger className="bg-charcoal-light border-border text-foreground focus:border-brand-orange">
            <SelectValue placeholder="Select a time slot" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {TIME_SLOTS.map((slot) => (
              <SelectItem
                key={slot}
                value={slot}
                className="text-foreground hover:bg-charcoal-light"
              >
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.timeSlot && (
          <p className="text-destructive text-xs">{errors.timeSlot}</p>
        )}
      </div>

      {/* Repair Details Preview */}
      {repairDetails && (
        <div className="p-4 bg-brand-orange/10 border border-brand-orange/30 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1 font-medium">
            Issue Summary
          </p>
          <p className="text-sm text-foreground">{repairDetails}</p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        data-ocid="booking.submit_button"
        disabled={createBooking.isPending}
        className="w-full bg-brand-orange hover:bg-brand-orange-light text-charcoal font-bold py-3 rounded-xl text-base shadow-orange-glow hover:shadow-orange-glow-lg transition-all active:scale-95"
      >
        {createBooking.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Booking...
          </>
        ) : (
          "Confirm Booking"
        )}
      </Button>

      {(submitError || createBooking.isError) && (
        <div
          data-ocid="booking.error_state"
          className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl"
        >
          <p className="text-destructive text-sm font-semibold mb-1">
            Booking Failed
          </p>
          <p className="text-destructive/80 text-xs leading-relaxed">
            {submitError ||
              (createBooking.error instanceof Error
                ? createBooking.error.message
                : "Something went wrong. Please try again.")}
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitError(null);
              createBooking.reset();
            }}
            className="mt-2 text-xs text-destructive underline underline-offset-2 hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </form>
  );
}

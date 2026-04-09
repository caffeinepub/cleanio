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
import { useActor } from "../hooks/useActor";
import { useCreateBooking } from "../hooks/useQueries";

export type VehicleCategory = "scooter" | "motorcycle" | "electric";

interface BookingFormProps {
  serviceType: ServiceType;
  repairDetails?: string;
  defaultCapacity?: Capacity;
  showCapacitySelector?: boolean;
  showPricing?: boolean;
  cleaningSubOption?: "colourFoam" | "normalFoam";
  cleaningPrice?: number;
  vehicleCategory?: VehicleCategory;
  onVehicleCategoryChange?: (cat: VehicleCategory) => void;
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

// ─── Bike brands & models ────────────────────────────────────────────────────

type BrandModels = Record<string, string[]>;

const BIKE_BRANDS_MODELS: BrandModels = {
  Hero: [
    "Splendor Plus",
    "HF Deluxe",
    "Passion Pro",
    "Glamour",
    "Xtreme 160R",
    "Destini 125",
    "Maestro Edge",
    "Pleasure+",
    "Xoom",
    "Super Splendor",
    "Other",
  ],
  Honda: [
    "Activa 6G",
    "Activa 125",
    "Shine 100",
    "Shine 125",
    "Unicorn",
    "CB Hornet 2.0",
    "CB350",
    "CB300R",
    "SP125",
    "Dio",
    "Grazia",
    "Cliq",
    "Other",
  ],
  Bajaj: [
    "Pulsar 150",
    "Pulsar 160NS",
    "Pulsar 180",
    "Pulsar 200NS",
    "Pulsar 220F",
    "Pulsar RS200",
    "Pulsar N250",
    "Dominar 250",
    "Dominar 400",
    "Platina 100",
    "CT100",
    "Avenger 160",
    "Avenger 220",
    "Chetak (Electric)",
    "Other",
  ],
  TVS: [
    "Jupiter",
    "Jupiter 125",
    "Ntorq 125",
    "Apache RTR 160",
    "Apache RTR 160 4V",
    "Apache RTR 200 4V",
    "Apache RR 310",
    "Sport",
    "Star City+",
    "Radeon",
    "Raider 125",
    "Ronin",
    "iQube Electric",
    "Other",
  ],
  Yamaha: [
    "FZ-S FI",
    "FZ 25",
    "MT-15",
    "R15 V4",
    "R3",
    "Fascino 125",
    "Ray ZR 125",
    "Ray ZR Street Rally",
    "Aerox 155",
    "Saluto 125",
    "Other",
  ],
  Suzuki: [
    "Access 125",
    "Burgman Street",
    "Gixxer",
    "Gixxer SF",
    "Gixxer 250",
    "Gixxer SF 250",
    "V-Strom SX",
    "Hayabusa",
    "Other",
  ],
  "Royal Enfield": [
    "Classic 350",
    "Bullet 350",
    "Meteor 350",
    "Thunderbird 350X",
    "Himalayan",
    "Scram 411",
    "Hunter 350",
    "Super Meteor 650",
    "Interceptor 650",
    "Continental GT 650",
    "Other",
  ],
  Kawasaki: [
    "Ninja 300",
    "Ninja 400",
    "Ninja 650",
    "Ninja ZX-6R",
    "Ninja ZX-10R",
    "Z650",
    "Z900",
    "Versys 650",
    "W175",
    "Other",
  ],
  KTM: [
    "Duke 125",
    "Duke 200",
    "Duke 250",
    "Duke 390",
    "RC 200",
    "RC 390",
    "Adventure 250",
    "Adventure 390",
    "Other",
  ],
  Jawa: ["Jawa 42", "Jawa 350", "Perak", "42 FJ", "Other"],
  Yezdi: ["Roadster", "Scrambler", "Adventure", "Other"],
  Triumph: [
    "Street Triple",
    "Tiger Sport 660",
    "Speed Triple",
    "Bonneville T100",
    "Bonneville T120",
    "Scrambler 400 X",
    "Speed 400",
    "Other",
  ],
  "Harley-Davidson": [
    "Street 750",
    "Iron 883",
    "Forty-Eight",
    "Fat Boy",
    "Road Glide",
    "Street Glide",
    "Pan America",
    "X440",
    "Other",
  ],
  BMW: [
    "G 310 R",
    "G 310 GS",
    "F 850 GS",
    "R 1250 GS",
    "S 1000 RR",
    "CE 04 (Electric)",
    "Other",
  ],
  Benelli: [
    "Imperiale 400",
    "Leoncino 500",
    "TRK 502",
    "302R",
    "502C",
    "Other",
  ],
  Aprilia: [
    "SR 125",
    "SR 160",
    "SR GT 125",
    "RS 457",
    "Tuono 660",
    "RS 660",
    "Other",
  ],
  Vespa: [
    "SXL 125",
    "VXL 125",
    "SXL 150",
    "VXL 150",
    "ZX 125",
    "Elegante 150",
    "Other",
  ],
  Piaggio: ["Fly 125", "Medley", "MP3", "Other"],
  Mahindra: ["Mojo 300", "Mojo UT300", "Other"],
  Other: ["Other"],
};

const BRAND_LIST = Object.keys(BIKE_BRANDS_MODELS);

// ─────────────────────────────────────────────────────────────────────────────

export default function BookingForm({
  serviceType,
  repairDetails,
  defaultCapacity = Capacity.upTo200cc,
  showCapacitySelector = false,
  showPricing = false,
  cleaningSubOption,
  cleaningPrice,
  vehicleCategory: vehicleCategoryProp,
  onVehicleCategoryChange,
}: BookingFormProps) {
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const { actor, isFetching: actorFetching } = useActor();
  const isActorReady = !!actor && !actorFetching;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [internalVehicleCategory, setInternalVehicleCategory] =
    useState<VehicleCategory>("scooter");
  const [capacity, setCapacity] = useState<Capacity>(defaultCapacity);
  const [timeSlot, setTimeSlot] = useState("");
  const [bikeBrand, setBikeBrand] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Use controlled prop if provided, otherwise use internal state
  const vehicleCategory = vehicleCategoryProp ?? internalVehicleCategory;
  const setVehicleCategory = (cat: VehicleCategory) => {
    setInternalVehicleCategory(cat);
    onVehicleCategoryChange?.(cat);
    // Reset brand/model when switching to electric
    if (cat === "electric") {
      setBikeBrand("");
      setBikeModel("");
    }
  };

  // Derive backend vehicleType from vehicleCategory
  const vehicleType: VehicleType =
    vehicleCategory === "motorcycle"
      ? VehicleType.motorcycle
      : vehicleCategory === "electric"
        ? VehicleType.electric
        : VehicleType.scooter;

  const isElectric = vehicleCategory === "electric";
  const showBrandModel = !isElectric;
  const availableModels = bikeBrand
    ? (BIKE_BRANDS_MODELS[bikeBrand] ?? [])
    : [];

  // Reset model when brand changes
  const handleBrandChange = (brand: string) => {
    setBikeBrand(brand);
    setBikeModel("");
  };

  // Updated pricing: electric = ₹999 flat; under 200cc = ₹899; above 200cc = ₹1199
  const price = isElectric ? 999 : capacity === Capacity.upTo200cc ? 899 : 1199;

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

    const evTag = isElectric ? " [Electric Vehicle]" : "";
    const fullAddress = `${address}${evTag}`;

    const subOption = buildCleaningSubOption();

    // For cleaning, ensure subOption is provided
    if (serviceType === ServiceType.cleaning && !subOption) {
      setSubmitError("Please select a cleaning option before booking.");
      return;
    }

    try {
      // The mutation generates a fresh booking ID per attempt internally
      // and returns the successfully stored ID.
      const confirmedId = await createBooking.mutateAsync({
        customerName: name.trim(),
        phoneNumber: phone.trim(),
        address: fullAddress,
        vehicleType,
        capacity: isElectric ? Capacity.upTo200cc : capacity,
        serviceType,
        repairDetails: repairDetails ? repairDetails : null,
        cleaningSubOption: subOption,
        timeSlot: timeSlot || null,
        bikeBrand: bikeBrand || undefined,
        bikeModel: bikeModel || undefined,
      });

      navigate({
        to: "/confirmation",
        search: {
          bookingId: confirmedId,
          name: name.trim(),
          service: serviceType,
          slot: timeSlot,
          phone: phone.trim(),
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

          {isElectric ? (
            /* Electric flat-rate card */
            <div className="flex items-center justify-between p-4 rounded-xl border-2 border-green-500/60 bg-green-500/10">
              <div className="flex items-center gap-3">
                <span className="text-xl">⚡</span>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Electric – Flat Rate
                  </p>
                  <p className="text-xs text-muted-foreground">
                    All electric two-wheelers
                  </p>
                </div>
              </div>
              <span className="text-green-400 font-black text-lg">₹999</span>
            </div>
          ) : (
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
                <span className="text-brand-orange font-black text-lg">
                  ₹899
                </span>
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
          )}

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
          value={vehicleCategory}
          onValueChange={(v) => setVehicleCategory(v as VehicleCategory)}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <label
            htmlFor="scooter"
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
              vehicleCategory === "scooter"
                ? "border-brand-orange bg-brand-orange/10"
                : "border-border hover:border-brand-orange/50"
            }`}
          >
            <RadioGroupItem value="scooter" id="scooter" />
            <span className="text-sm font-medium text-foreground">
              🛵 Scooter
            </span>
          </label>
          <label
            htmlFor="motorcycle"
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
              vehicleCategory === "motorcycle"
                ? "border-brand-orange bg-brand-orange/10"
                : "border-border hover:border-brand-orange/50"
            }`}
          >
            <RadioGroupItem value="motorcycle" id="motorcycle" />
            <span className="text-sm font-medium text-foreground">
              🏍️ Motorcycle
            </span>
          </label>
          <label
            htmlFor="electric"
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
              vehicleCategory === "electric"
                ? "border-green-500 bg-green-500/10"
                : "border-border hover:border-green-500/50"
            }`}
          >
            <RadioGroupItem value="electric" id="electric" />
            <span className="text-sm font-medium text-foreground">
              ⚡ Electric
            </span>
          </label>
        </RadioGroup>
      </div>

      {/* Bike Brand & Model — only for non-electric */}
      {showBrandModel && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-foreground font-semibold">
              Bike Brand &amp; Model
            </Label>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Optional
            </span>
          </div>

          {/* Brand dropdown */}
          <Select value={bikeBrand} onValueChange={handleBrandChange}>
            <SelectTrigger
              data-ocid="booking.brand_select"
              className="bg-charcoal-light border-border text-foreground focus:border-brand-orange data-[placeholder]:text-muted-foreground"
            >
              <SelectValue placeholder="Select Brand (Optional)" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border max-h-64">
              {BRAND_LIST.map((brand) => (
                <SelectItem
                  key={brand}
                  value={brand}
                  className="text-foreground hover:bg-charcoal-light"
                >
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Model dropdown — shown only after brand is selected */}
          {bikeBrand && bikeBrand !== "Other" && (
            <Select value={bikeModel} onValueChange={setBikeModel}>
              <SelectTrigger
                data-ocid="booking.model_select"
                className="bg-charcoal-light border-border text-foreground focus:border-brand-orange data-[placeholder]:text-muted-foreground"
              >
                <SelectValue placeholder="Select Model (Optional)" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border max-h-64">
                {availableModels.map((model) => (
                  <SelectItem
                    key={model}
                    value={model}
                    className="text-foreground hover:bg-charcoal-light"
                  >
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

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
        disabled={createBooking.isPending || !isActorReady}
        className="w-full bg-brand-orange hover:bg-brand-orange-light text-charcoal font-bold py-3 rounded-xl text-base shadow-orange-glow hover:shadow-orange-glow-lg transition-all active:scale-95 disabled:opacity-60"
      >
        {createBooking.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Booking...
          </>
        ) : !isActorReady ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting to service...
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

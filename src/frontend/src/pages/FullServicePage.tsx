import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { ServiceType } from "../backend";
import BookingForm, { type VehicleCategory } from "../components/BookingForm";

const PETROL_INCLUDED = [
  "Engine oil change",
  "Air filter cleaning",
  "Spark plug check",
  "Chain lubrication",
  "Brake adjustment",
  "Tyre pressure check",
  "Battery check",
  "Full wash & clean",
  "25-point inspection",
];

const EV_INCLUDED = [
  "Battery health check",
  "Motor inspection",
  "Controller & wiring check",
  "Tyre pressure check",
  "Brake adjustment",
  "Full wash & clean",
  "Regenerative braking check",
  "Charging port inspection",
  "25-point EV inspection",
];

export default function FullServicePage() {
  const navigate = useNavigate();
  const [vehicleCategory, setVehicleCategory] =
    useState<VehicleCategory>("scooter");

  const isElectric = vehicleCategory === "electric";
  const includedItems = isElectric ? EV_INCLUDED : PETROL_INCLUDED;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate({ to: "/" })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Back to Home</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex items-center justify-center text-2xl">
            🔧
          </div>
          <div>
            <h1 className="font-display font-black text-2xl md:text-3xl text-foreground">
              Full Service
            </h1>
            <p className="text-muted-foreground text-sm">
              Complete two-wheeler maintenance
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-card border border-border rounded-2xl p-5 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground text-sm">
              What's Included
            </h3>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                isElectric
                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : "bg-brand-orange/10 text-brand-orange border-brand-orange/30"
              }`}
            >
              {isElectric ? "⚡ Electric" : "⛽ Petrol"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {includedItems.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle
                  className={`w-3.5 h-3.5 flex-shrink-0 ${
                    isElectric ? "text-green-400" : "text-brand-orange"
                  }`}
                />
                <span className="text-xs text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-6">
          Book Your Service
        </h2>
        <BookingForm
          serviceType={ServiceType.fullService}
          showCapacitySelector={true}
          showPricing={true}
          vehicleCategory={vehicleCategory}
          onVehicleCategoryChange={setVehicleCategory}
        />
      </div>
    </div>
  );
}

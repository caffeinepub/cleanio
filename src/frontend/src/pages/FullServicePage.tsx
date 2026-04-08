import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, Info } from "lucide-react";
import { useState } from "react";
import { ServiceType } from "../backend";
import BookingForm, { type VehicleCategory } from "../components/BookingForm";

const PETROL_INCLUDED = [
  "Engine oil change",
  "Air filter cleaning",
  "Spark plug check & clean",
  "Chain lubrication",
  "Brake adjustment",
  "Tyre pressure check",
  "Battery & terminals check",
  "Full exterior wash & clean",
  "Throttle & cable check",
  "Suspension inspection",
  "Lights & indicators check",
  "25-point inspection report",
];

const EV_INCLUDED = [
  "Battery health & charge check",
  "Motor inspection",
  "Controller & wiring check",
  "Tyre pressure & condition",
  "Brake adjustment",
  "Full exterior wash & clean",
  "Regenerative braking check",
  "Charging port inspection",
  "Software & firmware check",
  "Suspension inspection",
  "Lights & indicators check",
  "25-point EV inspection report",
];

export default function FullServicePage() {
  const [vehicleCategory, setVehicleCategory] =
    useState<VehicleCategory>("scooter");

  const isElectric = vehicleCategory === "electric";
  const includedItems = isElectric ? EV_INCLUDED : PETROL_INCLUDED;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Back to Home</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            🔧
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-black text-2xl md:text-3xl text-foreground">
                Full Service
              </h1>
              <Badge className="bg-brand-orange/10 text-brand-orange border-brand-orange/20 text-xs font-semibold">
                Most Popular
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Complete two-wheeler maintenance at your doorstep
            </p>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">≤ 200cc</p>
            <p className="text-brand-orange font-black text-xl">₹899</p>
            <p className="text-xs text-muted-foreground">Scooters</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">&gt; 200cc</p>
            <p className="text-brand-orange font-black text-xl">₹1199</p>
            <p className="text-xs text-muted-foreground">Motorcycles</p>
          </div>
          <div className="bg-card border border-green-500/30 rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Electric</p>
            <p className="text-green-400 font-black text-xl">₹999</p>
            <p className="text-xs text-muted-foreground">Flat rate</p>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-card border border-border rounded-2xl p-5 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground text-sm">
                What's Included
              </h3>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
                isElectric
                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : "bg-brand-orange/10 text-brand-orange border-brand-orange/30"
              }`}
            >
              {isElectric ? "⚡ Electric" : "⛽ Petrol / Petrol-Electric"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-3">
            {includedItems.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle
                  className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                    isElectric ? "text-green-400" : "text-brand-orange"
                  }`}
                />
                <span className="text-xs text-muted-foreground leading-snug">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info note */}
        <div className="mt-3 flex items-start gap-2 p-3 bg-brand-orange/5 border border-brand-orange/20 rounded-xl">
          <span className="text-base flex-shrink-0">📞</span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            After booking, our team will{" "}
            <span className="text-foreground font-semibold">
              call you to confirm
            </span>{" "}
            the appointment and verify your address.
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <div
        className="bg-card border border-border rounded-2xl p-6"
        data-ocid="fullservice.booking_form"
      >
        <h2 className="font-display font-bold text-xl text-foreground mb-1">
          Book Your Service
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Select your vehicle type and fill in your details below.
        </p>
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

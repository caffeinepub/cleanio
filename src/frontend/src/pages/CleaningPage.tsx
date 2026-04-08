import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, Droplets, Sparkles } from "lucide-react";
import { useState } from "react";
import { Capacity, ServiceType } from "../backend";
import BookingForm from "../components/BookingForm";

const CLEANING_FEATURES = [
  "Exterior pressure wash",
  "Engine degreasing",
  "Rim & tyre cleaning",
  "Seat & panel wipe-down",
  "Mirror & light polish",
  "Chain cleaning",
  "Underbody wash",
  "Air dry & finishing",
];

type CleaningOption = "colourFoam" | "normalFoam";

const CLEANING_OPTIONS: {
  id: CleaningOption;
  label: string;
  price: number;
  description: string;
  emoji: string;
  badge: string;
  badgeClass: string;
  highlights: string[];
}[] = [
  {
    id: "colourFoam",
    label: "Colour Foam Washing",
    price: 199,
    description:
      "Premium coloured foam wash with deep cleaning action and a vibrant showroom finish.",
    emoji: "🌈",
    badge: "Premium",
    badgeClass: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
    highlights: [
      "Coloured foam treatment",
      "Deep stain removal",
      "Shine enhancer",
      "UV protectant coating",
    ],
  },
  {
    id: "normalFoam",
    label: "Normal Foam Washing",
    price: 149,
    description:
      "Standard foam wash that removes dirt and grime, leaving your bike clean and fresh.",
    emoji: "🫧",
    badge: "Budget Friendly",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    highlights: [
      "Standard foam wash",
      "Dirt & grime removal",
      "Quick dry finish",
      "Eco-friendly agents",
    ],
  },
];

export default function CleaningPage() {
  const [selectedOption, setSelectedOption] = useState<CleaningOption | null>(
    null,
  );

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
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-black text-2xl md:text-3xl text-foreground">
                Cleaning Service
              </h1>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs font-semibold">
                Quick Service
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Showroom-finish doorstep cleaning for your two-wheeler
            </p>
          </div>
        </div>

        {/* What's included */}
        <div className="bg-card border border-border rounded-2xl p-5 mt-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-brand-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Droplets className="w-4 h-4 text-brand-orange" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-1">
                Deep Clean Package
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every cleaning includes these steps — done by our trained team
                at your doorstep using eco-friendly, bike-safe products.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-3">
            {CLEANING_FEATURES.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-brand-orange flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Eco highlight */}
        <div className="mt-3 p-3 bg-brand-orange/5 border border-brand-orange/20 rounded-xl flex items-center gap-3">
          <span className="text-xl flex-shrink-0">🌿</span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Eco-Friendly Products
            </p>
            <p className="text-xs text-muted-foreground">
              We use biodegradable, bike-safe cleaning agents
            </p>
          </div>
        </div>
      </div>

      {/* Washing Type Selector */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brand-orange" />
          <h2 className="font-display font-bold text-lg text-foreground">
            Choose Washing Type
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CLEANING_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              data-ocid={`cleaning.option.${option.id}`}
              onClick={() => setSelectedOption(option.id)}
              className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                selectedOption === option.id
                  ? "border-brand-orange bg-brand-orange/10 shadow-orange-glow"
                  : "border-border bg-card hover:border-brand-orange/50 hover:bg-brand-orange/5"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{option.emoji}</span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs border ${option.badgeClass}`}
                  >
                    {option.badge}
                  </Badge>
                  <span className="text-brand-orange font-black text-xl">
                    ₹{option.price}
                  </span>
                </div>
              </div>
              <p className="font-bold text-foreground text-sm mb-1.5">
                {option.label}
              </p>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {option.description}
              </p>
              <div className="space-y-1.5">
                {option.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-brand-orange flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{h}</span>
                  </div>
                ))}
              </div>
              {selectedOption === option.id && (
                <div className="mt-3 pt-3 border-t border-brand-orange/20">
                  <span className="text-xs font-bold text-brand-orange">
                    ✓ Selected
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {!selectedOption && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            👆 Select a washing type above to proceed with booking
          </p>
        )}
      </div>

      {/* Booking Form — shown after option selected */}
      {selectedOption && (
        <div
          className="bg-card border border-border rounded-2xl p-6 animate-fade-in-up"
          data-ocid="cleaning.booking_form"
        >
          <h2 className="font-display font-bold text-lg text-foreground mb-1">
            Book Your Slot
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Fill in your details and we'll come to your doorstep.
          </p>

          {/* Call confirmation note */}
          <div className="flex items-start gap-2 p-3 bg-brand-orange/5 border border-brand-orange/20 rounded-xl mb-6">
            <span className="text-base flex-shrink-0">📞</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              After booking, our team will{" "}
              <span className="text-foreground font-semibold">
                call you to confirm
              </span>{" "}
              the time slot and your address.
            </p>
          </div>

          <BookingForm
            serviceType={ServiceType.cleaning}
            defaultCapacity={Capacity.upTo200cc}
            showCapacitySelector={false}
            showPricing={false}
            cleaningSubOption={selectedOption}
            cleaningPrice={selectedOption === "colourFoam" ? 199 : 149}
          />
        </div>
      )}
    </div>
  );
}

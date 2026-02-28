import { useState } from 'react';
import { ArrowLeft, CheckCircle, Droplets, Sparkles } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import BookingForm from '../components/BookingForm';
import { ServiceType, Capacity } from '../backend';

const CLEANING_FEATURES = [
  'Exterior pressure wash',
  'Engine degreasing',
  'Rim & tyre cleaning',
  'Seat & panel wipe-down',
  'Mirror & light polish',
  'Chain cleaning',
  'Underbody wash',
  'Air dry & finishing',
];

type CleaningOption = 'colourFoam' | 'normalFoam';

const CLEANING_OPTIONS: {
  id: CleaningOption;
  label: string;
  price: number;
  description: string;
  emoji: string;
  highlights: string[];
}[] = [
  {
    id: 'colourFoam',
    label: 'Colour Foam Washing',
    price: 199,
    description: 'Premium coloured foam wash with deep cleaning action and a vibrant finish.',
    emoji: '🌈',
    highlights: ['Coloured foam treatment', 'Deep stain removal', 'Shine enhancer'],
  },
  {
    id: 'normalFoam',
    label: 'Normal Foam Washing',
    price: 149,
    description: 'Standard foam wash that removes dirt and grime, leaving your bike clean and fresh.',
    emoji: '🫧',
    highlights: ['Standard foam wash', 'Dirt & grime removal', 'Quick dry finish'],
  },
];

export default function CleaningPage() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<CleaningOption | null>(null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Back Button */}
      <button
        onClick={() => navigate({ to: '/' })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Back to Home</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex items-center justify-center text-2xl">
            ✨
          </div>
          <div>
            <h1 className="font-display font-black text-2xl md:text-3xl text-foreground">Cleaning Service</h1>
            <p className="text-muted-foreground text-sm">Showroom-finish doorstep cleaning</p>
          </div>
        </div>

        {/* Service Description */}
        <div className="bg-card border border-border rounded-2xl p-5 mt-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-brand-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Droplets className="w-4 h-4 text-brand-orange" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-1">Deep Clean Package</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our professional cleaning service uses eco-friendly products and high-pressure washing to restore your bike's shine. Perfect for regular maintenance or before special occasions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {CLEANING_FEATURES.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-brand-orange flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="mt-4 p-4 bg-brand-orange/10 border border-brand-orange/30 rounded-xl flex items-center gap-3">
          <span className="text-2xl">🌟</span>
          <div>
            <p className="text-sm font-semibold text-foreground">Eco-Friendly Products</p>
            <p className="text-xs text-muted-foreground">We use biodegradable, bike-safe cleaning agents</p>
          </div>
        </div>
      </div>

      {/* Washing Option Selector */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brand-orange" />
          <h2 className="font-display font-bold text-lg text-foreground">Choose Washing Type</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CLEANING_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedOption(option.id)}
              className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                selectedOption === option.id
                  ? 'border-brand-orange bg-brand-orange/10 shadow-orange-glow'
                  : 'border-border bg-card hover:border-brand-orange/50 hover:bg-brand-orange/5'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-brand-orange font-black text-xl">₹{option.price}</span>
              </div>
              <p className="font-bold text-foreground text-sm mb-1">{option.label}</p>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{option.description}</p>
              <div className="space-y-1">
                {option.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-brand-orange flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{h}</span>
                  </div>
                ))}
              </div>
              {selectedOption === option.id && (
                <div className="mt-3 pt-3 border-t border-brand-orange/20">
                  <span className="text-xs font-semibold text-brand-orange">✓ Selected</span>
                </div>
              )}
            </button>
          ))}
        </div>
        {!selectedOption && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Please select a washing type to proceed with booking
          </p>
        )}
      </div>

      {/* Booking Form */}
      {selectedOption && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-foreground mb-5">Book Your Slot</h2>
          <BookingForm
            serviceType={ServiceType.cleaning}
            defaultCapacity={Capacity.upTo200cc}
            showCapacitySelector={false}
            showPricing={false}
            cleaningSubOption={selectedOption}
            cleaningPrice={selectedOption === 'colourFoam' ? 199 : 149}
          />
        </div>
      )}
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Battery,
  CalendarDays,
  CheckCircle2,
  Crown,
  Gauge,
  Loader2,
  MapPin,
  Star,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  type ShoppingItem,
  useCreateCheckoutSession,
} from "../hooks/useCreateCheckoutSession";

interface Plan {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  savings: number;
  services: number;
  badge: string;
  badgeVariant: "popular" | "best";
  color: string;
  borderColor: string;
  icon: React.ReactNode;
  features: Array<{ icon: React.ReactNode; text: string }>;
  items: ShoppingItem[];
}

const plans: Plan[] = [
  {
    id: "plan-3",
    name: "Standard Annual",
    subtitle: "3 Full Services / Year",
    price: 2499,
    originalPrice: 2697,
    savings: 198,
    services: 3,
    badge: "Most Popular",
    badgeVariant: "popular",
    color: "from-orange-500/15 via-orange-500/5 to-transparent",
    borderColor: "border-brand-orange/50 hover:border-brand-orange",
    icon: <Star className="w-6 h-6" />,
    features: [
      {
        icon: <CalendarDays className="w-4 h-4" />,
        text: "3 Full Service visits at your doorstep",
      },
      {
        icon: <Zap className="w-4 h-4" />,
        text: "Priority booking slot",
      },
      {
        icon: <Gauge className="w-4 h-4" />,
        text: "Free tyre pressure check each visit",
      },
      {
        icon: <CalendarDays className="w-4 h-4" />,
        text: "Valid for 12 months from purchase",
      },
      {
        icon: <MapPin className="w-4 h-4" />,
        text: "Doorstep service anywhere in the city",
      },
    ],
    items: [
      {
        currency: "inr",
        productName: "Cleanio Standard Annual Plan",
        productDescription:
          "3 Full Service visits at your doorstep per year. Priority booking, free tyre pressure check each visit. Valid 12 months.",
        priceInCents: 249900,
        quantity: 1,
      },
    ],
  },
  {
    id: "plan-4",
    name: "Premium Annual",
    subtitle: "4 Full Services / Year",
    price: 2999,
    originalPrice: 3596,
    savings: 597,
    services: 4,
    badge: "Best Value",
    badgeVariant: "best",
    color: "from-yellow-500/15 via-yellow-500/5 to-transparent",
    borderColor: "border-yellow-500/50 hover:border-yellow-400",
    icon: <Crown className="w-6 h-6" />,
    features: [
      {
        icon: <CalendarDays className="w-4 h-4" />,
        text: "4 Full Service visits at your doorstep",
      },
      {
        icon: <Zap className="w-4 h-4" />,
        text: "Priority booking slot",
      },
      {
        icon: <Gauge className="w-4 h-4" />,
        text: "Free tyre pressure check each visit",
      },
      {
        icon: <Battery className="w-4 h-4" />,
        text: "Free battery health check each visit",
      },
      {
        icon: <CalendarDays className="w-4 h-4" />,
        text: "Valid for 12 months from purchase",
      },
      {
        icon: <MapPin className="w-4 h-4" />,
        text: "Doorstep service anywhere in the city",
      },
    ],
    items: [
      {
        currency: "inr",
        productName: "Cleanio Premium Annual Plan",
        productDescription:
          "4 Full Service visits at your doorstep per year. Priority booking, free tyre pressure + battery check each visit. Valid 12 months.",
        priceInCents: 299900,
        quantity: 1,
      },
    ],
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  const checkout = useCreateCheckoutSession();
  const [stripeError, setStripeError] = useState<string | null>(null);

  const handleBuyNow = async () => {
    setStripeError(null);
    try {
      const session = await checkout.mutateAsync(plan.items);
      window.location.href = session.url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.toLowerCase().includes("stripe") ||
        msg.toLowerCase().includes("not configured") ||
        msg.toLowerCase().includes("not available") ||
        msg.toLowerCase().includes("actor")
      ) {
        setStripeError(
          "Online payment is being set up. Please contact us on WhatsApp to purchase a plan.",
        );
      } else {
        setStripeError("Payment failed. Please try again or contact support.");
      }
    }
  };

  const isBest = plan.badgeVariant === "best";

  return (
    <div
      className={`relative bg-card border-2 ${plan.borderColor} rounded-3xl p-8 flex flex-col gap-6 transition-all duration-300 hover:shadow-card group overflow-hidden`}
      data-ocid={`plans.${plan.id}.card`}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      />

      {/* Badge */}
      <div className="relative z-10 flex items-start justify-between">
        <div
          className={`flex items-center justify-center w-14 h-14 rounded-2xl border ${
            isBest
              ? "bg-yellow-500/15 border-yellow-500/30 text-yellow-400"
              : "bg-brand-orange/15 border-brand-orange/30 text-brand-orange"
          }`}
        >
          {plan.icon}
        </div>
        <span
          className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
            isBest
              ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
              : "bg-brand-orange/15 text-brand-orange border-brand-orange/30"
          }`}
        >
          {plan.badge}
        </span>
      </div>

      {/* Plan name & price */}
      <div className="relative z-10 space-y-1">
        <h3 className="font-display font-black text-2xl text-foreground">
          {plan.name}
        </h3>
        <p
          className={`text-sm font-medium ${isBest ? "text-yellow-400" : "text-brand-orange"}`}
        >
          {plan.subtitle}
        </p>

        <div className="pt-3 flex items-end gap-3">
          <span
            className={`font-black text-4xl ${isBest ? "text-yellow-400" : "text-brand-orange"}`}
          >
            ₹{plan.price.toLocaleString("en-IN")}
          </span>
          <div className="pb-1">
            <span className="text-sm text-muted-foreground line-through">
              ₹{plan.originalPrice.toLocaleString("en-IN")}
            </span>
            <p className="text-xs text-green-400 font-semibold">
              Save ₹{plan.savings}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Annual membership</p>
      </div>

      {/* Features */}
      <ul className="relative z-10 space-y-3 flex-1">
        {plan.features.map((feature) => (
          <li key={feature.text} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex-shrink-0 ${isBest ? "text-yellow-400" : "text-brand-orange"}`}
            >
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <span className="text-sm text-foreground leading-relaxed">
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Error message */}
      {stripeError && (
        <div
          className="relative z-10 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3"
          data-ocid={`plans.${plan.id}.error_state`}
        >
          <p className="text-xs text-yellow-400 leading-relaxed">
            {stripeError}
          </p>
          <a
            href="https://wa.me/919637113065"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3.5 h-3.5"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact us on WhatsApp
          </a>
        </div>
      )}

      {/* CTA */}
      <Button
        onClick={handleBuyNow}
        disabled={checkout.isPending}
        data-ocid={`plans.${plan.id}.primary_button`}
        className={`relative z-10 w-full font-bold py-6 rounded-xl text-base transition-all active:scale-95 ${
          isBest
            ? "bg-yellow-500 hover:bg-yellow-400 text-charcoal shadow-[0_0_20px_oklch(0.85_0.18_85/0.3)] hover:shadow-[0_0_30px_oklch(0.85_0.18_85/0.4)]"
            : "bg-brand-orange hover:bg-brand-orange-light text-charcoal shadow-orange-glow hover:shadow-orange-glow-lg"
        }`}
      >
        {checkout.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>Buy Now — ₹{plan.price.toLocaleString("en-IN")}</>
        )}
      </Button>
    </div>
  );
}

export default function PremiumPlansPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/8 via-brand-orange/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 pt-10 pb-8">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            data-ocid="plans.back.button"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </button>

          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">
                Annual Membership Plans
              </span>
            </div>

            <h1 className="font-display font-black text-4xl md:text-5xl leading-tight">
              Save More,{" "}
              <span className="text-gradient-orange">Service More</span>
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed">
              Lock in doorstep service visits for the whole year at a discounted
              rate. Priority booking, free checks, and peace of mind — all
              included.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              {[
                "Doorstep visits included",
                "Priority booking",
                "Save up to ₹597/year",
              ].map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {point}
                </div>
              ))}
            </div>
          </div>

          {/* Plan cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          {/* Fine print */}
          <p className="text-center text-xs text-muted-foreground mt-8 max-w-md mx-auto">
            Plans are valid for 12 months from date of purchase. Service visits
            are redeemable by calling or messaging us on WhatsApp to schedule a
            slot. No refunds after first service use.
          </p>
        </div>
      </section>

      {/* Why plans section */}
      <section className="bg-charcoal-light border-t border-border py-12 mt-8">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-black text-2xl text-center mb-8">
            Why choose an{" "}
            <span className="text-gradient-orange">Annual Plan?</span>
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              {
                icon: "💰",
                title: "Save money",
                desc: "Pay less per service compared to booking individually",
              },
              {
                icon: "⚡",
                title: "Priority slots",
                desc: "Plan members get first pick of available time slots",
              },
              {
                icon: "🛡️",
                title: "Worry-free year",
                desc: "Your bike stays in top shape all year round",
              },
            ].map((item) => (
              <div key={item.title} className="text-center space-y-2">
                <div className="text-3xl">{item.icon}</div>
                <h3 className="font-semibold text-foreground text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="container mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground text-sm mb-3">
          Questions about our plans?
        </p>
        <a
          href="https://wa.me/919637113065"
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="plans.whatsapp.button"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: "#25D366" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-5 h-5"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Ask on WhatsApp
        </a>
      </section>
    </div>
  );
}

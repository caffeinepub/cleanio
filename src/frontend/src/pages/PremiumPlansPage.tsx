import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, MessageCircle, Star, Zap } from "lucide-react";
import { useState } from "react";

const LS_STRIPE_KEY = "stripeSecretKey";

const WHATSAPP_BUY_URL =
  "https://wa.me/919637113065?text=Hi%2C%20I'm%20interested%20in%20purchasing%20a%20Cleanio%20Premium%20Plan";

function hasStripeKey(): boolean {
  try {
    return (localStorage.getItem(LS_STRIPE_KEY) ?? "").length > 0;
  } catch {
    return false;
  }
}

const plans = [
  {
    id: "under-200",
    label: "Under 200cc",
    price: "₹1,599",
    period: "/year",
    savings: "Save ₹199 vs booking separately",
    savingsNote: "(2 × ₹899 = ₹1,798)",
    features: [
      "2 Full Service visits per year",
      "Doorstep service at your location",
      "Certified mechanics",
      "25-point inspection each visit",
      "Oil change & filter cleaning",
      "Priority scheduling",
    ],
    badge: "Best Value",
    highlight: false,
  },
  {
    id: "above-200",
    label: "Above 200cc",
    price: "₹1,999",
    period: "/year",
    savings: "Save ₹399 vs booking separately",
    savingsNote: "(2 × ₹1,199 = ₹2,398)",
    features: [
      "2 Full Service visits per year",
      "Doorstep service at your location",
      "Certified mechanics",
      "25-point inspection each visit",
      "Oil change & filter cleaning",
      "Priority scheduling",
    ],
    badge: "Premium",
    highlight: true,
  },
];

function PlanCard({ plan }: { plan: (typeof plans)[number] }) {
  const stripeEnabled = hasStripeKey();
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  return (
    <div
      data-ocid={`premium_plans.${plan.id}.card`}
      className={`relative bg-card rounded-2xl p-6 md:p-8 flex flex-col transition-all duration-300 ${
        plan.highlight
          ? "border-2 border-brand-orange shadow-orange-glow"
          : "border border-border hover:border-brand-orange hover:shadow-orange-glow"
      }`}
    >
      {/* Badge */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="inline-flex items-center gap-1.5 bg-brand-orange text-charcoal text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {plan.highlight ? (
            <Zap className="w-3 h-3" />
          ) : (
            <Star className="w-3 h-3 fill-charcoal" />
          )}
          {plan.badge}
        </span>
      </div>

      <div className="mt-2 mb-6">
        <h2 className="font-display font-black text-xl text-brand-orange mb-1">
          {plan.label}
        </h2>
        <div className="flex items-baseline gap-1 mt-3">
          <span className="font-black text-4xl text-foreground">
            {plan.price}
          </span>
          <span className="text-muted-foreground text-sm">{plan.period}</span>
        </div>

        {/* Savings */}
        <div className="mt-3 inline-flex flex-col gap-0.5">
          <span className="inline-flex items-center gap-1.5 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold px-3 py-1.5 rounded-lg">
            🎉 {plan.savings}
          </span>
          <span className="text-muted-foreground text-xs pl-1">
            {plan.savingsNote}
          </span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
            <span className="text-sm text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Online payment message */}
      {stripeEnabled && showOnlineMessage && (
        <div
          data-ocid={`premium_plans.${plan.id}.online_message`}
          className="mb-4 bg-brand-orange/10 border border-brand-orange/30 rounded-xl px-4 py-3 text-sm text-foreground"
        >
          Online payment coming soon — please{" "}
          <a
            href={WHATSAPP_BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-orange hover:underline font-semibold"
          >
            contact us on WhatsApp
          </a>{" "}
          to complete your purchase.
        </div>
      )}

      {/* CTA Button */}
      {stripeEnabled ? (
        <Button
          onClick={() => setShowOnlineMessage((v) => !v)}
          data-ocid={`premium_plans.${plan.id}.buy_now`}
          className="w-full bg-brand-orange hover:bg-brand-orange-light text-charcoal font-bold rounded-xl shadow-orange-glow transition-all active:scale-95"
          size="lg"
        >
          Pay Online
        </Button>
      ) : (
        <a
          href={WHATSAPP_BUY_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid={`premium_plans.${plan.id}.buy_now`}
        >
          <Button
            className="w-full bg-brand-orange hover:bg-brand-orange-light text-charcoal font-bold rounded-xl shadow-orange-glow transition-all active:scale-95"
            size="lg"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Buy Now
          </Button>
        </a>
      )}

      <p className="text-xs text-muted-foreground text-center mt-3">
        {stripeEnabled
          ? "Online payment — secure & fast"
          : "Contact us via WhatsApp to complete purchase"}
      </p>
    </div>
  );
}

export default function PremiumPlansPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-20 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
            <span className="text-brand-orange text-sm font-semibold">
              Annual Plans
            </span>
          </div>
          <h1 className="font-display font-black text-3xl md:text-5xl text-foreground mb-4">
            Premium <span className="text-gradient-orange">Plans</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Save more with our annual service plans. Get 2 full service visits
            per year at a discounted rate — doorstep delivery guaranteed.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="bg-muted/30 border-y border-border py-12 md:py-16 flex-1">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground max-w-lg mx-auto text-center">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-brand-orange" />
              Monday – Sunday service
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-brand-orange" />
              Certified mechanics
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-brand-orange" />
              Doorstep guaranteed
            </span>
          </div>
        </div>
      </section>

      {/* Back link */}
      <section className="bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <Link
            to="/"
            data-ocid="premium_plans.back_home"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand-orange transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}

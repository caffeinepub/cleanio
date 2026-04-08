import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Star,
  Zap,
} from "lucide-react";

const services = [
  {
    id: "full-service",
    emoji: "🔧",
    title: "Full Service",
    description:
      "Complete engine tune-up, oil change, filter cleaning & 25-point inspection. Covers petrol and electric vehicles.",
    pricing: "From ₹899",
    pricingNote: "₹899 / ₹1199 / ₹999 EV",
    badge: "Most Popular",
    path: "/full-service",
    gradient: "from-orange-500/15 to-transparent",
    badgeClass: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
  },
  {
    id: "repair",
    emoji: "⚡",
    title: "Repair",
    description:
      "AI-powered diagnosis and expert repair for brakes, engine, electrical, tyres, and more.",
    pricing: "Custom Quote",
    pricingNote: "AI-assisted diagnosis",
    badge: "AI Powered",
    path: "/repair",
    gradient: "from-blue-500/15 to-transparent",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    id: "cleaning",
    emoji: "✨",
    title: "Cleaning",
    description:
      "Deep exterior wash with coloured or normal foam, engine degreasing, and a showroom finish.",
    pricing: "From ₹149",
    pricingNote: "Colour ₹199 / Normal ₹149",
    badge: "Quick Service",
    path: "/cleaning",
    gradient: "from-emerald-500/15 to-transparent",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
];

const features = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Doorstep Service",
    desc: "We come to your location, anywhere in the city",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Flexible Slots",
    desc: "Morning, afternoon & evening time slots",
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: "Certified Mechanics",
    desc: "Trained, verified & background-checked",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "AI Diagnostics",
    desc: "Smart chatbot guides repair diagnosis",
  },
];

const WHATSAPP_URL = "https://wa.me/919637113065";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-24 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                <span className="text-brand-orange text-sm font-semibold">
                  Doorstep Two-Wheeler Service
                </span>
              </div>

              <h1 className="font-display font-black text-4xl md:text-6xl leading-tight text-foreground">
                Your Bike,{" "}
                <span className="text-gradient-orange">Serviced</span>
                <br />
                at Your Door
              </h1>

              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                Professional two-wheeler servicing, repair, and cleaning —
                delivered right to your doorstep. No queues, no waiting.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link to="/full-service">
                  <Button
                    data-ocid="hero.book_service.cta"
                    className="bg-brand-orange hover:bg-brand-orange-light text-charcoal font-bold px-6 py-3 rounded-xl shadow-orange-glow transition-all active:scale-95"
                  >
                    Book a Service
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/repair">
                  <Button
                    variant="outline"
                    data-ocid="hero.diagnose.cta"
                    className="border-border text-foreground hover:bg-charcoal-light hover:border-brand-orange px-6 py-3 rounded-xl transition-all"
                  >
                    Diagnose Issue
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-2">
                  {["🧑", "👩", "👨", "🧑"].map((emoji, i) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: static list
                      key={i}
                      className="w-8 h-8 rounded-full bg-charcoal-light border-2 border-background flex items-center justify-center text-sm"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-brand-orange text-brand-orange"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    500+ happy customers
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10 pointer-events-none" />
              <img
                src="/assets/generated/hero-banner.dim_1200x500.png"
                alt="Cleanio doorstep two-wheeler service"
                className="w-full h-80 object-cover rounded-2xl border border-border shadow-card"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl p-4 shadow-card z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Last booking
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      Full Service ✓
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-card border border-brand-orange/30 rounded-2xl p-3 shadow-card z-20">
                <p className="text-brand-orange font-black text-sm">
                  Mon – Sun
                </p>
                <p className="text-xs text-muted-foreground">9 AM – 7 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-muted/30 border-y border-border py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-black text-3xl md:text-4xl mb-3 text-foreground">
              Our <span className="text-gradient-orange">Services</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Choose from our range of professional two-wheeler services, all
              delivered at your doorstep.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                to={service.path as "/"}
                data-ocid={`services.${service.id}.card`}
                className="group relative bg-card border border-border rounded-2xl p-6 hover:border-brand-orange transition-all duration-300 hover:shadow-orange-glow overflow-hidden block"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-3xl border border-brand-orange/20 group-hover:bg-brand-orange/20 transition-colors">
                      {service.emoji}
                    </div>
                    <Badge
                      className={`text-xs font-semibold border ${service.badgeClass}`}
                      variant="outline"
                    >
                      {service.badge}
                    </Badge>
                  </div>

                  <h3 className="font-display font-bold text-xl text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-brand-orange font-black text-lg">
                        {service.pricing}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {service.pricingNote}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange transition-colors">
                      <ArrowRight className="w-4 h-4 text-brand-orange group-hover:text-charcoal transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display font-black text-2xl md:text-3xl text-foreground">
              Why Choose <span className="text-gradient-orange">Cleanio?</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="text-center space-y-3">
                <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex items-center justify-center mx-auto text-brand-orange">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Plans Banner */}
      <section className="bg-muted/30 border-y border-border py-12">
        <div className="container mx-auto px-4">
          <div className="bg-card border border-brand-orange/20 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/5 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-3 py-1 mb-1">
                <Star className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
                <span className="text-brand-orange text-xs font-bold">
                  PREMIUM PLANS
                </span>
              </div>
              <h2 className="font-display font-black text-2xl md:text-3xl text-foreground">
                Annual Service Plans
              </h2>
              <p className="text-muted-foreground max-w-md">
                Get 2 full services per year at a discounted rate. Save more,
                service smarter.
              </p>
              <div className="flex flex-wrap gap-3 pt-1 justify-center md:justify-start">
                <span className="text-sm font-semibold text-foreground bg-charcoal-light border border-border rounded-lg px-3 py-1.5">
                  Under 200cc — ₹1599
                </span>
                <span className="text-sm font-semibold text-foreground bg-charcoal-light border border-border rounded-lg px-3 py-1.5">
                  Above 200cc — ₹1999
                </span>
              </div>
            </div>
            <div className="relative z-10 flex-shrink-0">
              <Link to={"/premium-plans" as "/"}>
                <Button
                  data-ocid="premium_plans.cta"
                  className="bg-brand-orange hover:bg-brand-orange-light text-charcoal font-bold px-8 py-3 rounded-xl shadow-orange-glow transition-all active:scale-95 text-base"
                >
                  View Plans
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="font-display font-black text-3xl md:text-4xl text-foreground">
              Ready to get your bike{" "}
              <span className="text-gradient-orange">serviced?</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Book now and our certified technician will be at your doorstep at
              your preferred time slot.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/full-service">
                <Button
                  data-ocid="cta.book_full_service"
                  className="bg-brand-orange hover:bg-brand-orange-light text-charcoal font-bold px-8 py-3 rounded-xl shadow-orange-glow transition-all active:scale-95"
                >
                  Book Full Service
                </Button>
              </Link>
              <Link to="/repair">
                <Button
                  variant="outline"
                  data-ocid="cta.diagnose_repair"
                  className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-charcoal px-8 py-3 rounded-xl transition-all"
                >
                  Diagnose & Repair
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section
        id="support"
        className="bg-muted/30 border-t border-border py-16"
        data-ocid="support.section"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
              style={{
                backgroundColor: "#25D36615",
                border: "1px solid #25D36640",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#25D366"
                className="w-8 h-8"
                role="img"
                aria-label="WhatsApp"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-black text-3xl md:text-4xl text-foreground">
                Need <span className="text-gradient-orange">Help?</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our support team is available 7 days a week. Reach us on
                WhatsApp — we respond within minutes.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-foreground font-semibold text-lg">
              <Phone className="w-5 h-5 text-brand-orange" />
              <span>+91 96371 13065</span>
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="support.whatsapp.primary_button"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-6 h-6"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>

            <p className="text-muted-foreground text-sm">
              Available Monday – Sunday, 9 AM – 7 PM
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

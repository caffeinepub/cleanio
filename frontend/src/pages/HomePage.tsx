import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, CheckCircle, Clock, MapPin, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    id: 'full-service',
    icon: '/assets/generated/icon-full-service.dim_128x128.png',
    emoji: '🔧',
    title: 'Full Service',
    description: 'Complete engine tune-up, oil change, filter cleaning, and 25-point inspection.',
    pricing: '₹899 – ₹1199',
    pricingNote: 'Based on engine capacity',
    badge: 'Most Popular',
    path: '/full-service',
    color: 'from-orange-500/20 to-transparent',
  },
  {
    id: 'repair',
    icon: '/assets/generated/icon-repair.dim_128x128.png',
    emoji: '⚡',
    title: 'Repair',
    description: 'Expert diagnosis and repair for electrical, brake, engine, and other issues.',
    pricing: 'Custom Quote',
    pricingNote: 'AI-assisted diagnosis',
    badge: 'AI Powered',
    path: '/repair',
    color: 'from-blue-500/20 to-transparent',
  },
  {
    id: 'cleaning',
    icon: '/assets/generated/icon-cleaning.dim_128x128.png',
    emoji: '✨',
    title: 'Cleaning',
    description: 'Deep exterior wash, engine degreasing, and polish for a showroom finish.',
    pricing: 'Best Price',
    pricingNote: 'Doorstep convenience',
    badge: 'Quick Service',
    path: '/cleaning',
    color: 'from-green-500/20 to-transparent',
  },
];

const features = [
  { icon: <MapPin className="w-5 h-5" />, title: 'Doorstep Service', desc: 'We come to you, anywhere in the city' },
  { icon: <Clock className="w-5 h-5" />, title: 'Same Day Slots', desc: 'Book and get service the same day' },
  { icon: <Star className="w-5 h-5" />, title: 'Certified Technicians', desc: 'Trained & verified professionals' },
  { icon: <Zap className="w-5 h-5" />, title: 'AI Diagnostics', desc: 'Smart repair issue detection' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                <span className="text-brand-orange text-sm font-medium">Doorstep Two-Wheeler Service</span>
              </div>

              <h1 className="font-display font-black text-4xl md:text-6xl leading-tight">
                Your Bike,{' '}
                <span className="text-gradient-orange">Serviced</span>{' '}
                at Your Door
              </h1>

              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                Professional two-wheeler servicing, repair, and cleaning — delivered to your doorstep. No more waiting at service centers.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate({ to: '/full-service' })}
                  className="bg-brand-orange hover:bg-brand-orange-light text-charcoal font-bold px-6 py-3 rounded-xl shadow-orange-glow hover:shadow-orange-glow-lg transition-all active:scale-95"
                >
                  Book a Service
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/repair' })}
                  className="border-border text-foreground hover:bg-charcoal-light hover:border-brand-orange px-6 py-3 rounded-xl transition-all"
                >
                  Diagnose Issue
                </Button>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-2">
                  {['🧑', '👩', '👨', '🧑'].map((emoji, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-charcoal-light border-2 border-background flex items-center justify-center text-sm">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-3 h-3 fill-brand-orange text-brand-orange" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">500+ happy customers</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10 pointer-events-none" />
              <img
                src="/assets/generated/hero-banner.dim_1200x500.png"
                alt="Two-wheeler doorstep service"
                className="w-full h-80 object-cover rounded-2xl border border-border shadow-card"
              />
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl p-4 shadow-card z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last booking</p>
                    <p className="text-sm font-semibold text-foreground">Full Service ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display font-black text-3xl md:text-4xl mb-3">
            Our <span className="text-gradient-orange">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Choose from our range of professional two-wheeler services, all delivered at your doorstep.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => navigate({ to: service.path as '/' })}
              className="group relative bg-card border border-border rounded-2xl p-6 hover:border-brand-orange transition-all duration-300 hover:shadow-orange-glow cursor-pointer overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

              <div className="relative z-10">
                {/* Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-3xl border border-brand-orange/20 group-hover:bg-brand-orange/20 transition-colors">
                    {service.emoji}
                  </div>
                  <span className="text-xs font-semibold bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-2 py-1 rounded-full">
                    {service.badge}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand-orange font-black text-lg">{service.pricing}</p>
                    <p className="text-xs text-muted-foreground">{service.pricingNote}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange transition-colors">
                    <ArrowRight className="w-4 h-4 text-brand-orange group-hover:text-charcoal transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-charcoal-light border-y border-border py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex items-center justify-center mx-auto text-brand-orange">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                <p className="text-muted-foreground text-xs">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-display font-black text-3xl md:text-4xl">
            Ready to get your bike <span className="text-gradient-orange">serviced?</span>
          </h2>
          <p className="text-muted-foreground">
            Book now and our certified technician will be at your doorstep at your preferred time.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => navigate({ to: '/full-service' })}
              className="bg-brand-orange hover:bg-brand-orange-light text-charcoal font-bold px-8 py-3 rounded-xl shadow-orange-glow hover:shadow-orange-glow-lg transition-all active:scale-95"
            >
              Book Full Service
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/repair' })}
              className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-charcoal px-8 py-3 rounded-xl transition-all"
            >
              Diagnose & Repair
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

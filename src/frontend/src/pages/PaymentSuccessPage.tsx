import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Crown, Home } from "lucide-react";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="relative inline-flex">
          <div className="w-24 h-24 bg-green-500/15 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-500/20 border border-yellow-500/40 rounded-full flex items-center justify-center">
            <Crown className="w-4 h-4 text-yellow-400" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="font-display font-black text-3xl text-foreground">
            Payment Successful!
          </h1>
          <p className="text-xl font-semibold">
            <span className="text-brand-orange">Clean</span>
            <span className="text-white">io</span>
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your premium plan has been activated! We'll reach out on WhatsApp to
            schedule your first service visit.
          </p>
        </div>

        {/* Details */}
        <div className="bg-card border border-green-500/20 rounded-2xl p-5 text-left space-y-3">
          {[
            "Plan activated and ready to use",
            "Priority booking slots reserved for you",
            "Service visits valid for 12 months",
            "Our team will contact you on WhatsApp soon",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{item}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate({ to: "/" })}
            data-ocid="payment_success.home.button"
            className="bg-brand-orange hover:bg-brand-orange-light text-charcoal font-bold px-8 py-3 rounded-xl shadow-orange-glow hover:shadow-orange-glow-lg transition-all active:scale-95"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
          <a
            href="https://wa.me/919637113065"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="payment_success.whatsapp.button"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#25D366" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-4 h-4"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

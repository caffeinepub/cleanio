import { Link, useLocation } from "@tanstack/react-router";
import { History, Menu, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";

function useNewBookingCount() {
  const [badgeCount, setBadgeCount] = useState<number>(0);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ count: number }>).detail;
      setBadgeCount(detail.count);
    };
    window.addEventListener("cleanio:new-booking-count", handler);
    return () =>
      window.removeEventListener("cleanio:new-booking-count", handler);
  }, []);

  return { badgeCount };
}

// Logo served from public/assets/logo.png — the original uploaded orange scooter
// ?v=2 busts any stale browser cache from previously corrupted copies
const LOGO_SRC = "/assets/logo.png?v=2";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { badgeCount } = useNewBookingCount();

  const WHATSAPP_NUMBER = "919637113065";
  const appOrigin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://cleanio.icp0.io";
  const WHATSAPP_MESSAGE = encodeURIComponent(
    `Hello Cleanio! 👋\n\nI'd like to know more about your services.\n\nPlease select an option:\n1️⃣ Full Service\n2️⃣ Repair\n3️⃣ Cleaning\n4️⃣ Premium Plans\n5️⃣ Track my Booking – visit: ${appOrigin}/track-booking\n6️⃣ Other Query`,
  );
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Full Service", path: "/full-service" },
    { label: "Repair", path: "/repair" },
    { label: "Cleaning", path: "/cleaning" },
    { label: "Premium Plans", path: "/premium-plans" },
    { label: "Track Booking", path: "/track-booking" },
    {
      label: "My Bookings",
      path: "/my-bookings",
      icon: <History className="w-3.5 h-3.5" />,
    },
    { label: "Support", path: "/#support" },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname.startsWith("/admin");
    if (path.includes("#")) return false;
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-charcoal border-b border-border backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group flex-shrink-0"
            data-ocid="nav.home.link"
          >
            {/* Logo box: 48x48, white background, rounded, object-contain so nothing overflows */}
            <div
              className="flex-shrink-0 rounded-lg bg-white flex items-center justify-center overflow-hidden"
              style={{ width: 48, height: 48, padding: 4 }}
            >
              <img
                src={LOGO_SRC}
                alt="Cleanio scooter logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
            <span className="text-xl font-bold tracking-tight font-display">
              <span className="text-brand-orange">Clean</span>
              <span className="text-white">io</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.path.includes("#") ? (
                <a
                  key={link.path}
                  href={link.path}
                  data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-white hover:bg-charcoal-light"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-brand-orange text-charcoal"
                      : "text-muted-foreground hover:text-white hover:bg-charcoal-light"
                  }`}
                >
                  {"icon" in link && link.icon}
                  {link.label}
                </Link>
              ),
            )}

            {/* Admin link — desktop */}
            <Link
              to="/admin"
              data-ocid="nav.admin.link"
              className={`ml-1 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border relative ${
                isActive("/admin")
                  ? "bg-brand-orange text-charcoal border-brand-orange"
                  : "border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-charcoal"
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
              {badgeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow-md">
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-charcoal-light transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="lg:hidden border-t border-border bg-charcoal">
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) =>
                link.path.includes("#") ? (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={() => setMenuOpen(false)}
                    data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "_")}.mobile.link`}
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-white hover:bg-charcoal-light"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? "bg-brand-orange text-charcoal"
                        : "text-muted-foreground hover:text-white hover:bg-charcoal-light"
                    }`}
                  >
                    {"icon" in link && link.icon}
                    {link.label}
                  </Link>
                ),
              )}

              {/* Admin link — mobile */}
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.admin.mobile.link"
                className={`mt-1 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border relative ${
                  isActive("/admin")
                    ? "bg-brand-orange text-charcoal border-brand-orange"
                    : "border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-charcoal"
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Portal
                {badgeCount > 0 && (
                  <span className="ml-auto min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5 leading-none">
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Floating WhatsApp Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="support.whatsapp.button"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
        style={{ backgroundColor: "#25D366" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-7 h-7"
          role="img"
          aria-label="WhatsApp"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Footer */}
      <footer className="bg-charcoal border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              {/* Footer logo: 36x36 white box, same file, object-contain */}
              <div
                className="flex-shrink-0 rounded-md bg-white flex items-center justify-center overflow-hidden"
                style={{ width: 36, height: 36, padding: 3 }}
              >
                <img
                  src={LOGO_SRC}
                  alt="Cleanio logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
              <span className="font-bold font-display">
                <span className="text-brand-orange">Clean</span>
                <span className="text-white">io</span>
              </span>
              <span className="text-muted-foreground text-sm ml-1">
                Doorstep Two-Wheeler Services
              </span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <p className="text-muted-foreground text-sm text-center">
                © {new Date().getFullYear()} Cleanio. Built with{" "}
                <span className="text-brand-orange">♥</span> using{" "}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                    typeof window !== "undefined"
                      ? window.location.hostname
                      : "cleanio-app",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange hover:underline font-medium"
                >
                  caffeine.ai
                </a>
              </p>

              {/* Admin link — footer */}
              <Link
                to="/admin"
                data-ocid="footer.admin.link"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-charcoal transition-all duration-200 text-xs font-medium relative"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Portal
                {badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

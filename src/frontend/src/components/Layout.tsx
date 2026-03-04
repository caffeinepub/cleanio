import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";

function useNewBookingCount() {
  // Badge count is driven by a custom event fired from AdminBookingsPage
  // once booking data loads. This keeps the Layout decoupled from data fetching.
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

  // Also persist badge count so it survives navigating away and back to admin.
  // We store it separately so Layout always knows about unseen bookings.
  return { badgeCount };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { badgeCount } = useNewBookingCount();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Full Service", path: "/full-service" },
    { label: "Repair", path: "/repair" },
    { label: "Cleaning", path: "/cleaning" },
  ];

  const isActive = (path: string) =>
    path === "/admin"
      ? location.pathname.startsWith("/admin")
      : location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-charcoal border-b border-border backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.home.link"
          >
            <img
              src="/assets/uploads/file_000000006ec461f5905d0bdb5d01b34a-1-1-1-1.png"
              alt="Cleanio Bike Icon"
              className="h-10 w-auto object-contain bg-white rounded-md p-0.5"
            />
            <span className="text-xl font-bold tracking-tight font-poppins">
              <span className="text-brand-orange">Clean</span>
              <span className="text-white">io</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}.link`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-brand-orange text-charcoal"
                    : "text-muted-foreground hover:text-white hover:bg-charcoal-light"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin link — desktop */}
            <Link
              to="/admin"
              data-ocid="nav.admin.link"
              className={`ml-2 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border relative ${
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
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-charcoal-light transition-all"
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
          <div className="md:hidden border-t border-border bg-charcoal">
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-brand-orange text-charcoal"
                      : "text-muted-foreground hover:text-white hover:bg-charcoal-light"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

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

      {/* Footer */}
      <footer className="bg-charcoal border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img
                src="/assets/uploads/file_000000006ec461f5905d0bdb5d01b34a-1-1-1-1.png"
                alt="Cleanio Bike Icon"
                className="h-7 w-auto object-contain bg-white rounded-md p-0.5"
              />
              <span className="font-bold font-poppins">
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

import { Link, useLocation } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Full Service', path: '/full-service' },
    { label: 'Repair', path: '/repair' },
    { label: 'Cleaning', path: '/cleaning' },
    { label: 'Admin', path: '/admin/bookings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-charcoal border-b border-border backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/assets/file_000000006ec461f5905d0bdb5d01b34a(1)(1).png"
              alt="Cleanio Bike Icon"
              className="h-10 w-auto object-contain"
            />
            <span className="text-xl font-bold text-foreground tracking-tight font-poppins">
              Cleanio
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-brand-orange text-charcoal'
                    : 'text-muted-foreground hover:text-foreground hover:bg-charcoal-light'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-charcoal-light transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                      ? 'bg-brand-orange text-charcoal'
                      : 'text-muted-foreground hover:text-foreground hover:bg-charcoal-light'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-charcoal border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/assets/file_000000006ec461f5905d0bdb5d01b34a(1)(1).png"
                alt="Cleanio Bike Icon"
                className="h-7 w-auto object-contain"
              />
              <span className="text-foreground font-bold font-poppins">Cleanio</span>
              <span className="text-muted-foreground text-sm ml-1">
                Doorstep Two-Wheeler Services
              </span>
            </div>
            <p className="text-muted-foreground text-sm text-center">
              © {new Date().getFullYear()} Cleanio. Built with{' '}
              <span className="text-brand-orange">♥</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'cleanio-app'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-orange hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

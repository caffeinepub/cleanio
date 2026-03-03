import { Link, useLocation } from '@tanstack/react-router';
import { Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Full Service', path: '/full-service' },
    { label: 'Repair', path: '/repair' },
    { label: 'Cleaning', path: '/cleaning' },
  ];

  const isActive = (path: string) =>
    path === '/admin'
      ? location.pathname.startsWith('/admin')
      : location.pathname === path;

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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-brand-orange text-charcoal'
                    : 'text-muted-foreground hover:text-white hover:bg-charcoal-light'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin link — desktop */}
            <Link
              to="/admin"
              className={`ml-2 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                isActive('/admin')
                  ? 'bg-brand-orange text-charcoal border-brand-orange'
                  : 'border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-charcoal'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-charcoal-light transition-all"
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
                      : 'text-muted-foreground hover:text-white hover:bg-charcoal-light'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Admin link — mobile */}
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className={`mt-1 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  isActive('/admin')
                    ? 'bg-brand-orange text-charcoal border-brand-orange'
                    : 'border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-charcoal'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Portal
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
                src="/assets/file_000000006ec461f5905d0bdb5d01b34a(1)(1).png"
                alt="Cleanio Bike Icon"
                className="h-7 w-auto object-contain"
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

              {/* Admin link — footer */}
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-charcoal transition-all duration-200 text-xs font-medium"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

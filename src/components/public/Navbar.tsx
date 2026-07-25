'use client';

import { useState } from 'react';
import { Menu, X, Warehouse, Building2, MapPin, Phone } from 'lucide-react';
import { useRouter } from '@/lib/router';
import type { Page } from '@/lib/router';

const navLinks: { label: string; page: Page; icon: React.ReactNode }[] = [
  { label: 'Entrepôts', page: 'entrepots', icon: <Warehouse className="h-4 w-4" /> },
  { label: 'Zones desservies', page: 'zones', icon: <MapPin className="h-4 w-4" /> },
  { label: 'Résidentiel', page: 'villas', icon: <Building2 className="h-4 w-4" /> },
  { label: 'Contact', page: 'contact', icon: <Phone className="h-4 w-4" /> },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { page, navigate } = useRouter();

  const handleNavigate = (targetPage: Page) => {
    navigate(targetPage);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gpro-dark/95 backdrop-blur-sm border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigate('home')}
            className="flex items-center hover:opacity-80 transition-opacity"
            aria-label="Retour à l'accueil"
          >
            <img
              src="/images/logo-gpro.png"
              alt="GPRO Immobilier"
              className="h-9 w-auto object-contain"
            />
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavigate(link.page)}
                className={`px-4 py-2 text-sm font-display text-uppercase tracking-wider transition-colors rounded-sm flex items-center gap-2 ${
                  page === link.page
                    ? 'text-gpro-accent'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-sm transition-colors"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-gpro-dark flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
        >
          {/* Close button */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
            <div className="flex items-center">
              <img
                src="/images/logo-gpro.png"
                alt="GPRO Immobilier"
                className="h-9 w-auto object-contain"
              />
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-white hover:bg-white/10 rounded-sm transition-colors"
              aria-label="Fermer le menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavigate(link.page)}
                className={`w-full max-w-xs px-6 py-4 text-lg font-display text-uppercase tracking-wider rounded-sm flex items-center gap-4 transition-colors ${
                  page === link.page
                    ? 'text-gpro-accent bg-white/5'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

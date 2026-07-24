'use client';

import { Phone, MessageCircle, Shield } from 'lucide-react';
import { useRouter } from '@/lib/router';
import type { Page } from '@/lib/router';

const links: { label: string; page: Page }[] = [
  { label: 'Entrepôts', page: 'entrepots' },
  { label: 'Zones desservies', page: 'zones' },
  { label: 'Résidentiel', page: 'villas' },
  { label: 'Contact', page: 'contact' },
];

export default function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="bg-gpro-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Col 1: Logo & description */}
          <div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-display text-gpro-accent text-xl font-bold tracking-wider">
                GPRO
              </span>
              <span className="text-white text-xs font-medium tracking-widest uppercase">
                Immobilier
              </span>
            </div>
            <p className="text-gpro-muted text-sm leading-relaxed max-w-xs">
              Votre partenaire pour la location d&rsquo;entrepôts et de villas à
              Abidjan, Côte d&rsquo;Ivoire.
            </p>
          </div>

          {/* Col 2: Contact */}
          <div>
            <h3 className="font-display text-gpro-accent text-sm text-uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gpro-muted text-sm">
                <Phone className="h-4 w-4 shrink-0 text-gpro-accent" />
                <span>+225 07 77 04 10 10</span>
              </li>
              <li className="flex items-center gap-3 text-gpro-muted text-sm">
                <Phone className="h-4 w-4 shrink-0 text-gpro-accent" />
                <span>+225 05 94 24 99 33</span>
              </li>
              <li>
                <a
                  href="https://wa.me/2250777041010"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gpro-muted text-sm hover:text-white transition-colors"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-gpro-accent" />
                  WhatsApp Direct
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Links */}
          <div>
            <h3 className="font-display text-gpro-accent text-sm text-uppercase tracking-wider mb-4">
              Liens
            </h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="text-gpro-muted text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gpro-muted text-xs">
            &copy; 2025 GPRO Immobilier. Tous droits réservés.
          </p>
          <button
            onClick={() => navigate('admin-login')}
            className="flex items-center gap-1.5 text-white/20 hover:text-white/40 text-xs transition-colors"
          >
            <Shield className="h-3 w-3" />
            Administration
          </button>
        </div>
      </div>
    </footer>
  );
}

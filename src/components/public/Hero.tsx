'use client';

import { motion } from 'framer-motion';
import { MessageCircle, ChevronRight, Check } from 'lucide-react';
import { useRouter } from '@/lib/router';

const advantages = [
  'Zones stratégiques à Abidjan',
  'Surfaces de 50 à 5 000 m²+',
  'Accès camions et semi-remorques',
  'Disponibilité immédiate',
];

export default function Hero() {
  const { navigate } = useRouter();

  return (
    <section className="relative min-h-screen bg-gpro-dark flex items-center overflow-hidden pt-16">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-warehouse.jpg')" }}
      />
      <div className="absolute inset-0 bg-gpro-dark/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,_rgba(214,67,30,0.12)_0%,_transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="w-16 h-0.5 bg-gpro-accent mb-8" />

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] mb-6">
              <span className="text-white text-uppercase block">
                LEADER DE LA LOCATION
              </span>
              <span className="text-gpro-accent text-uppercase block">
                D&apos;ENTREPÔTS À ABIDJAN
              </span>
            </h1>

            <p className="text-gpro-muted text-lg md:text-xl max-w-xl leading-relaxed mb-8">
              Solutions logistiques professionnelles pour votre activité.
              Entrepôts de toutes capacités dans les zones stratégiques
              d&apos;Abidjan. Location rapide, transparente, sans frais cachés.
            </p>

            {/* Advantages list */}
            <ul className="space-y-3 mb-10 max-w-md">
              {advantages.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-gpro-accent shrink-0" />
                  <span className="text-white/80 text-sm">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <button
                onClick={() => navigate('entrepots')}
                className="inline-flex items-center gap-2 bg-gpro-accent text-white px-8 py-4 font-display text-uppercase text-sm tracking-wider hover:bg-gpro-accent/80 transition-colors"
              >
                Voir les entrepôts
                <ChevronRight className="h-4 w-4" />
              </button>
              <a
                href="https://wa.me/2250594249933"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 font-display text-uppercase text-sm tracking-wider hover:bg-white hover:text-gpro-dark transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Direct
              </a>
            </div>
          </motion.div>

          {/* Right: Stats card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:block"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <StatItem value="12+" label="Communes desservies" />
                <StatItem value="5 000 m²+" label="Surface maximale" />
                <StatItem value="24h" label="Réponse garantie" />
                <StatItem value="100%" label="Propriétés vérifiées" />
              </div>
              <div className="border-t border-white/10 pt-6">
                <p className="text-gpro-muted text-sm leading-relaxed">
                  <span className="text-white font-medium">GPRO Immobilier</span> accompagne
                  les entreprises ivoiriennes depuis Abidjan avec un catalogue
                  d&apos;entrepôts et de villas soigneusement sélectionnés dans
                  les meilleures zones de la capitale économique.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gpro-dark to-transparent" />
    </section>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-gpro-accent text-2xl font-bold">{value}</p>
      <p className="text-gpro-muted text-xs text-uppercase mt-1 tracking-wider">{label}</p>
    </div>
  );
}

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { useRouter } from '@/lib/router';

const features = [
  'Villas meublées et non meublées',
  'Quartiers résidentiels de prestige',
  'Piscine, jardin et gardiennage',
  'Contrats flexibles',
];

export default function ResidentialSection() {
  const { navigate } = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="bg-gpro-dark py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-sm overflow-hidden"
          >
            <img
              src="/images/villa-luxury.jpg"
              alt="Villa de luxe à Abidjan"
              className="w-full h-80 lg:h-[28rem] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gpro-dark/30 to-transparent" />
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="font-mono-spec text-gpro-accent text-xs text-uppercase tracking-widest">
              Résidentiel
            </span>
            <h2 className="font-display text-white text-3xl md:text-4xl font-bold text-uppercase mt-3 mb-6">
              Des villas d'exception à Abidjan
            </h2>
            <p className="text-gpro-muted text-base md:text-lg leading-relaxed mb-8">
              Vous recherchez une résidence de standing pour votre famille ou vos
              collaborateurs ? GPRO Immobilier propose des villas spacieuses dans les
              quartiers les plus prisés de la capitale : Cocody, Riviera, Deux-Plateaux.
              Chaque bien est sélectionné pour son confort, sa sécurité et sa
              proximité avec les commodités.
            </p>

            <ul className="space-y-3 mb-10">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-gpro-accent shrink-0" />
                  <span className="text-white/80 text-sm">{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate('villas')}
              className="inline-flex items-center gap-2 bg-gpro-accent text-white px-8 py-4 font-display text-uppercase text-sm tracking-wider hover:bg-gpro-accent/80 transition-colors"
            >
              Découvrir nos biens
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

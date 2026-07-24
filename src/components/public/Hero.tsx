'use client';

import { motion } from 'framer-motion';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { useRouter } from '@/lib/router';

export default function Hero() {
  const { navigate } = useRouter();

  return (
    <section className="relative min-h-screen bg-gpro-dark flex items-center justify-center overflow-hidden pt-16">
      {/* Subtle radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(214,67,30,0.08)_0%,_transparent_70%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Decorative accent line */}
          <div className="w-16 h-0.5 bg-gpro-accent mx-auto mb-8" />

          {/* Main heading */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-2">
            <span className="text-white text-uppercase block">
              LEADER DE LA LOCATION
            </span>
            <span className="text-gpro-accent text-uppercase block">
              D&rsquo;ENTREPÔTS À ABIDJAN
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gpro-muted text-lg md:text-xl max-w-2xl mx-auto mt-6 mb-10 leading-relaxed">
            Solutions logistiques professionnelles pour votre activité.
            Entrepôts de toutes capacités dans les zones stratégiques
            d&rsquo;Abidjan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('entrepots')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gpro-accent text-white px-8 py-4 font-display text-uppercase text-sm tracking-wider hover:bg-gpro-accent/80 transition-colors"
            >
              Voir les entrepôts
              <ChevronRight className="h-4 w-4" />
            </button>
            <a
              href="https://wa.me/2250700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 font-display text-uppercase text-sm tracking-wider hover:bg-white hover:text-gpro-dark transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Contacter via WhatsApp
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gpro-dark to-transparent" />
    </section>
  );
}

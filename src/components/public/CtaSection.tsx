'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';

export default function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="bg-gpro-accent py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-white text-2xl md:text-4xl font-bold text-uppercase mb-4">
            Un projet ? Parlons-en.
          </h2>
          <p className="text-white/80 text-base md:text-lg mb-8 max-w-xl mx-auto">
            Contactez-nous par téléphone ou WhatsApp pour obtenir un devis
            personnalisé en moins de 24 heures.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+2250594249933"
              className="inline-flex items-center gap-2 bg-white text-gpro-dark px-8 py-4 font-display text-uppercase text-sm tracking-wider hover:bg-gpro-cream transition-colors"
            >
              <Phone className="h-4 w-4" />
              +225 07 77 04 10 10
            </a>
            <a
              href="https://wa.me/2250594249933"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 font-display text-uppercase text-sm tracking-wider hover:bg-white hover:text-gpro-dark transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Direct
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

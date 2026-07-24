'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const zones = [
  'Cocody',
  'Plateau',
  'Abobo',
  'Yopougon',
  'Adjamé',
  'Treichville',
  'Marcory',
  'Koumassi',
  'Vridi',
  'Port-Bouët',
  'Bingerville',
  'Anyama',
];

export default function ZonesSection({ showTitle = true }: { showTitle?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="bg-gpro-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <motion.h2
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="font-display text-white text-3xl md:text-4xl font-bold text-uppercase text-center mb-14"
          >
            Zones desservies
          </motion.h2>
        )}
        <div
          ref={showTitle ? undefined : ref}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
        >
          {zones.map((zone, index) => (
            <motion.div
              key={zone}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{
                duration: 0.4,
                delay: 0.1 + index * 0.06,
                ease: 'easeOut',
              }}
              className="flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gpro-accent shrink-0" />
              <span className="font-display text-gpro-light text-uppercase tracking-wider text-sm">
                {zone}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

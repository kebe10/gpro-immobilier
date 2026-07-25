'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Mail } from 'lucide-react';

const contacts = [
  {
    icon: <Phone className="h-5 w-5" />,
    label: 'Téléphone',
    value: '+225 05 94 24 99 33',
    href: 'tel:+2250594249933',
  },
  {
    icon: <MessageCircle className="h-5 w-5" />,
    label: 'WhatsApp',
    value: 'WhatsApp Direct',
    href: 'https://wa.me/2250594249933',
  },
  {
    icon: <Mail className="h-5 w-5" />,
    label: 'Email',
    value: 'contact@gpro.ci',
    href: 'mailto:contact@gpro.ci',
  },
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="bg-gpro-cream min-h-[calc(100vh-4rem)] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="font-display text-gpro-dark text-3xl md:text-4xl font-bold text-uppercase text-center mb-4"
        >
          Contactez-nous
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center text-gpro-dark/60 max-w-xl mx-auto mb-14"
        >
          Une question sur un entrepôt ou une villa ? Notre équipe est à votre
          disposition pour vous accompagner dans votre recherche.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {contacts.map((item, index) => (
            <motion.a
              key={item.label + index}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.4, delay: 0.25 + index * 0.08 }}
              className="flex items-center gap-4 bg-white border border-gpro-dark/10 p-6 hover:border-gpro-accent/40 transition-colors group"
            >
              <span className="text-gpro-accent group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <div>
                <p className="font-display text-gpro-muted text-xs text-uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-gpro-dark font-medium mt-0.5">{item.value}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-14 flex items-center justify-center gap-3 text-gpro-dark/50 text-sm"
        >
          <MapPin className="h-4 w-4" />
          <span>Abidjan, Côte d&rsquo;Ivoire</span>
        </motion.div>
      </div>
    </section>
  );
}

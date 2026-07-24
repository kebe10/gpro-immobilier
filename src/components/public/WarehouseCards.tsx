'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useRouter } from '@/lib/router';

interface WarehouseCard {
  capacity: string;
  title: string;
  surface: string;
  usage: string;
  access: string;
  image: string;
}

const warehouses: WarehouseCard[] = [
  {
    capacity: 'PETITE CAPACITÉ',
    title: 'Entrepôts Compact',
    surface: '50 — 200 m²',
    usage: 'Stockage léger, marchandises diverses, e-commerce, archivage.',
    access: 'Porte piétonne + véhicule léger',
    image: '/images/warehouse-interior.jpg',
  },
  {
    capacity: 'MOYENNE CAPACITÉ',
    title: 'Entrepôts Standard',
    surface: '200 — 1 000 m²',
    usage: 'Marchandises en vrac, produits palettisés, stockage alimentaire, distribution.',
    access: 'Porte sectionnelle, camion 19T',
    image: '/images/hero-warehouse.jpg',
  },
  {
    capacity: 'GRANDE CAPACITÉ',
    title: 'Entrepôts Industriel',
    surface: '1 000 — 5 000 m²+',
    usage: 'Conteneurs, marchandises industrielles, logistique lourde, cross-docking.',
    access: 'Quai de déchargement, semi-remorque',
    image: '/images/hero-warehouse.jpg',
  },
];

function WarehouseCardItem({ card, index }: { card: WarehouseCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
      className="bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute bottom-4 left-4 font-mono-spec text-white text-xs text-uppercase tracking-wider bg-gpro-accent/90 px-3 py-1">
          {card.capacity}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-display text-gpro-dark text-xl font-semibold mt-0 mb-3">
          {card.title}
        </h3>
        <p className="font-mono-spec text-gpro-accent text-sm font-semibold mb-3">
          {card.surface}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {card.usage}
        </p>
        <div className="border-t border-border pt-3">
          <span className="font-mono-spec text-xs text-gpro-muted uppercase">
            Accès : {card.access}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function WarehouseCards() {
  const { navigate } = useRouter();
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-60px' });

  return (
    <section id="entrepots-section" className="bg-gpro-light py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-gpro-dark text-3xl md:text-4xl font-bold text-uppercase">
            Nos entrepôts
          </h2>
          <p className="text-muted-foreground mt-3 text-base md:text-lg">
            Trois gammes de capacité pour répondre à tous vos besoins logistiques
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {warehouses.map((card, index) => (
            <WarehouseCardItem key={card.capacity} card={card} index={index} />
          ))}
        </div>
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('entrepots')}
            className="inline-flex items-center gap-2 bg-gpro-dark text-white px-8 py-4 font-display text-uppercase text-sm tracking-wider hover:bg-gpro-dark/80 transition-colors"
          >
            Voir tous les entrepôts
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

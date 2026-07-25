'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Clock, MapPin, HeadphonesIcon } from 'lucide-react';

const strengths = [
  {
    icon: <MapPin className="h-6 w-6" />,
    title: 'Emplacement stratégique',
    desc: 'Nos entrepôts sont situés dans les zones logistiques les plus recherchées d\'Abidjan : Vridi, Port-Bouët, Treichville, Koumassi, à proximité des ports et des axes routiers majeurs. Cela réduit vos coûts de transport et optimise vos délais de livraison.',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Réactivité garantie',
    desc: 'Nous comprenons l\'urgence de vos besoins. Notre équipe vous répond sous 24 heures et les visites sont organisées sous 48h. Les contrats sont signés rapidement pour une mise à disposition immédiate.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Sécurité et transparence',
    desc: 'Chaque propriété est vérifiée et documentée : état des lieux détaillé, photos récentes, informations sur la sécurité du site. Pas de frais cachés, tout est clair dès le premier échange.',
  },
  {
    icon: <HeadphonesIcon className="h-6 w-6" />,
    title: 'Accompagnement personnalisé',
    desc: 'Un interlocuteur unique vous guide du premier contact jusqu\'à la signature du bail. Nous adaptons nos offres à votre activité : e-commerce, agroalimentaire, BTP, import-export.',
  },
];

export default function WhyGpro() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="bg-gpro-cream py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: image + intro */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-sm overflow-hidden mb-8">
              <img
                src="/images/warehouse-interior.jpg"
                alt="Intérieur d\'un entrepôt GPRO"
                className="w-full h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gpro-dark/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-display text-white text-2xl font-bold text-uppercase">
                  Plus de 15 ans<br />d\'expertise immobilière
                </p>
              </div>
            </div>
            <h2 className="font-display text-gpro-dark text-3xl md:text-4xl font-bold text-uppercase mb-4">
              Pourquoi GPRO ?
            </h2>
            <p className="text-gpro-dark/70 leading-relaxed">
              GPRO Immobilier est le partenaire de confiance des entreprises
              à Abidjan pour la location d\'espaces professionnels et résidentiels.
              Notre connaissance du marché local et notre réseau de propriétaires
              nous permettent de vous offrir les meilleures opportunités.
            </p>
          </motion.div>

          {/* Right: strength cards */}
          <div className="space-y-6">
            {strengths.map((item, index) => {
              const cardRef = useRef<HTMLDivElement>(null);
              const cardInView = useInView(cardRef, { once: true, margin: '-40px' });
              return (
                <motion.div
                  key={item.title}
                  ref={cardRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow flex gap-4"
                >
                  <span className="text-gpro-accent shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <h3 className="font-display text-gpro-dark text-base font-semibold text-uppercase mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Warehouse, Home, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface ZoneInfo {
  nom: string;
  type: 'logistique' | 'residentiel' | 'les-deux';
  description: string;
  atouts: string[];
}

const zones: ZoneInfo[] = [
  {
    nom: 'Yopougon',
    type: 'les-deux',
    description: 'Zone industrielle majeure avec de vastes plateformes logistiques et des quartiers résidentiels abordables.',
    atouts: ['Zone industrielle', 'Accès autoroutier', 'Prix compétitifs'],
  },
  {
    nom: 'Koumassi',
    type: 'logistique',
    description: 'Plateforme logistique stratégique entre le port et le centre-ville, idéale pour l\'import-export.',
    atouts: ['Proximité portuaire', 'Grands entrepôts', 'Axe routier majeur'],
  },
  {
    nom: 'Vridi',
    type: 'logistique',
    description: 'Zone portuaire par excellence, desservie par les quais de déchargement et les zones franches.',
    atouts: ['Port Autonome', 'Zones franches', 'Conteneurs'],
  },
  {
    nom: 'Treichville',
    type: 'les-deux',
    description: 'Carrefour commercial et logistique historique d\'Abidjan, bien connecté au réseau routier.',
    atouts: ['Carrefour commercial', 'Gare ferroviaire', 'Central'],
  },
  {
    nom: 'Port-Bouët',
    type: 'logistique',
    description: 'Bord de mer avec accès direct au port d\'Abidjan, zone privilégiée pour la logistique lourde.',
    atouts: ['Bord de mer', 'Logistique lourde', 'Plateforme douanière'],
  },
  {
    nom: 'Cocody',
    type: 'residentiel',
    description: 'Quartier résidentiel prestigieux, villas de standing avec sécurité 24h et infrastructures de qualité.',
    atouts: ['Standing', 'Sécurité 24h', 'Écoles internationales'],
  },
  {
    nom: 'Plateau',
    type: 'residentiel',
    description: 'Cœur des affaires d\'Abidjan, appartements et villas de luxe dans le quartier le plus recherché.',
    atouts: ['Centre des affaires', 'Luxe', 'Ambassades'],
  },
  {
    nom: 'Marcory',
    type: 'les-deux',
    description: 'Quartier animé et bien desservi, offrant à la fois des espaces commerciaux et des résidences modernes.',
    atouts: ['Commerces', 'Animation', 'Bien desservi'],
  },
  {
    nom: 'Abobo',
    type: 'les-deux',
    description: 'Commune la plus peuplée d\'Abidjan avec un fort potentiel immobilier et des prix accessibles.',
    atouts: ['Accessibilité', 'Grand marché', 'En plein essor'],
  },
  {
    nom: 'Adjamé',
    type: 'logistique',
    description: 'Hub commercial et de transit au cœur d\'Abidjan, parfait pour le stockage et la distribution.',
    atouts: ['Hub de transit', 'Stockage léger', 'E-commerce'],
  },
  {
    nom: 'Bingerville',
    type: 'residentiel',
    description: 'Ville nouvelle à l\'est d\'Abidjan, quartier résidentiel calme et verdoyant avec un cadre de vie exceptionnel.',
    atouts: ['Cadre verdoyant', 'Calme', 'Villaisation récente'],
  },
  {
    nom: 'Anyama',
    type: 'les-deux',
    description: 'Zone en plein développement au nord d\'Abidjan, offrant de nouvelles opportunités résidentielles et logistiques.',
    atouts: ['En développement', 'Prix attractifs', 'Extension urbaine'],
  },
];

const typeLabel: Record<string, { label: string; color: string }> = {
  logistique: { label: 'Logistique', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  residentiel: { label: 'Résidentiel', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  'les-deux': { label: 'Logistique + Résidentiel', color: 'bg-gpro-accent/15 text-gpro-accent border-gpro-accent/30' },
};

function ZoneCard({ zone, index, expanded, onToggle }: {
  zone: ZoneInfo;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const t = typeLabel[zone.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
      className={`group bg-white/5 border rounded-sm transition-all duration-300 hover:bg-white/[0.08] ${
        expanded ? 'border-gpro-accent/50' : 'border-white/10 hover:border-white/25'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              <MapPin className={`w-4 h-4 shrink-0 transition-colors ${expanded ? 'text-gpro-accent' : 'text-white/40 group-hover:text-white/70'}`} />
              <h3 className="font-display text-white text-base font-semibold text-uppercase">
                {zone.nom}
              </h3>
            </div>
            <p className="text-white/45 text-xs leading-relaxed line-clamp-2">
              {zone.description}
            </p>
          </div>
          <div className="shrink-0 mt-0.5">
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gpro-accent" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono-spec tracking-wider border ${t.color}`}>
            {t.label}
          </span>
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="px-5 pb-5"
        >
          <div className="border-t border-white/10 pt-4 mt-1">
            <p className="text-white/55 text-xs leading-relaxed mb-4">
              {zone.description}
            </p>
            <p className="font-mono-spec text-white/40 text-[10px] tracking-wider uppercase mb-2">
              Atouts
            </p>
            <div className="flex flex-wrap gap-2">
              {zone.atouts.map((atout) => (
                <span
                  key={atout}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-sm text-white/60 text-xs"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-gpro-accent" />
                  {atout}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ZonesSection({ showTitle = true }: { showTitle?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [filter, setFilter] = useState<'tous' | 'logistique' | 'residentiel'>('tous');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === 'tous' ? zones : zones.filter((z) => z.type === filter || z.type === 'les-deux');

  return (
    <section className="bg-gpro-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="font-mono-spec text-gpro-accent text-xs tracking-widest uppercase mb-3">
              Couverture géographique
            </p>
            <h2 className="font-display text-white text-3xl md:text-4xl font-bold text-uppercase mb-4">
              Zones desservies
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm">
              Présents dans les 12 communes clés d&rsquo;Abidjan, nous couvrons l&rsquo;intégralité
              de vos besoins immobiliers — de la logistique au résidentiel de standing.
            </p>
          </motion.div>
        )}

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          {(
            [
              { key: 'tous' as const, label: 'Toutes les zones', Icon: MapPin },
              { key: 'logistique' as const, label: 'Logistique', Icon: Warehouse },
              { key: 'residentiel' as const, label: 'Résidentiel', Icon: Home },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-display text-uppercase tracking-wider transition-all border ${
                filter === f.key
                  ? 'bg-gpro-accent text-white border-gpro-accent'
                  : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              <f.Icon className="w-3.5 h-3.5" />
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Zone grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((zone, index) => (
            <ZoneCard
              key={zone.nom}
              zone={zone}
              index={index}
              expanded={expanded === zone.nom}
              onToggle={() => setExpanded(expanded === zone.nom ? null : zone.nom)}
            />
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-6 bg-white/5 border border-white/10 rounded-sm px-6 py-3">
            <div className="text-center">
              <p className="font-display text-gpro-accent text-2xl font-bold">12</p>
              <p className="text-white/40 text-[10px] font-mono-spec tracking-wider uppercase">Communes</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="font-display text-gpro-accent text-2xl font-bold">6</p>
              <p className="text-white/40 text-[10px] font-mono-spec tracking-wider uppercase">Zones logistiques</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="font-display text-gpro-accent text-2xl font-bold">3</p>
              <p className="text-white/40 text-[10px] font-mono-spec tracking-wider uppercase">Zones résidentielles</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from '@/lib/router';
import { motion } from 'framer-motion';
import { Warehouse, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Entrepot {
  id: string;
  titre: string;
  zone: string;
  surface: number;
  gamme: string;
  typeMarchandise: string;
  typeAcces: string;
  photos: string;
  statut: string;
}

function parsePhotos(photos: string): string[] {
  try {
    const parsed = JSON.parse(photos);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function EntrepotCatalog() {
  const { navigate } = useRouter();
  const [entrepots, setEntrepots] = useState<Entrepot[]>([]);
  const [loading, setLoading] = useState(true);
  const [gammeFilter, setGammeFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');

  useEffect(() => {
    fetch('/api/entrepots')
      .then((r) => r.json())
      .then((data) => {
        setEntrepots(data.entrepots || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const zones = useMemo(() => {
    const z = new Set(entrepots.map((e) => e.zone));
    return Array.from(z).sort();
  }, [entrepots]);

  const filtered = useMemo(() => {
    return entrepots.filter((e) => {
      if (gammeFilter && e.gamme !== gammeFilter) return false;
      if (zoneFilter && e.zone !== zoneFilter) return false;
      return true;
    });
  }, [entrepots, gammeFilter, zoneFilter]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80 rounded-none" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-uppercase text-3xl md:text-4xl text-gpro-dark">
          NOS ENTREPÔTS
        </h1>
        <p className="text-muted-foreground mt-2">
          Découvrez nos entrepôts disponibles à la location à Abidjan
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <Filter className="w-4 h-4 text-gpro-accent" />
        <select
          value={gammeFilter}
          onChange={(e) => setGammeFilter(e.target.value)}
          className="bg-white border border-border px-4 py-2 text-sm font-mono-spec focus:outline-none focus:ring-2 focus:ring-gpro-accent"
        >
          <option value="">Toutes les gammes</option>
          <option value="petite">Petite capacité</option>
          <option value="moyenne">Moyenne capacité</option>
          <option value="grande">Grande capacité</option>
        </select>
        <select
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
          className="bg-white border border-border px-4 py-2 text-sm font-mono-spec focus:outline-none focus:ring-2 focus:ring-gpro-accent"
        >
          <option value="">Toutes les zones</option>
          {zones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground ml-auto font-mono-spec">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Warehouse className="w-16 h-16 text-gpro-muted mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Aucun entrepôt trouvé</p>
          <p className="text-gpro-muted text-sm mt-1">
            Modifiez vos filtres ou consultez-nous directement
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((e, i) => {
            const photos = parsePhotos(e.photos);
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => navigate('entrepot-detail', { id: e.id })}
                className="bg-white cursor-pointer group hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gpro-dark relative overflow-hidden">
                  {photos.length > 0 ? (
                    <img
                      src={photos[0]}
                      alt={e.titre}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Warehouse className="w-12 h-12 text-gpro-muted" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={
                        e.statut === 'disponible'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : e.statut === 'loué'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      }
                    >
                      {e.statut}
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-uppercase text-lg text-gpro-dark mb-2">
                    {e.titre}
                  </h3>
                  <p className="font-mono-spec text-sm text-muted-foreground">
                    {e.zone} — {e.surface} m²
                  </p>
                  <p className="font-mono-spec text-xs text-gpro-muted mt-1">
                    {e.gamme}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

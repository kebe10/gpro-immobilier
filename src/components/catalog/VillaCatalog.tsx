'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from '@/lib/router';
import { motion } from 'framer-motion';
import { Home, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Villa {
  id: string;
  titre: string;
  quartier: string;
  pieces: number;
  description: string;
  prix: string;
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

export default function VillaCatalog() {
  const { navigate } = useRouter();
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [quartierFilter, setQuartierFilter] = useState('');
  const [piecesFilter, setPiecesFilter] = useState('');
  const [statutFilter, setStatutFilter] = useState('');

  useEffect(() => {
    fetch('/api/villas')
      .then((r) => r.json())
      .then((data) => {
        setVillas(data.villas || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const quartiers = useMemo(() => {
    const q = new Set(villas.map((v) => v.quartier));
    return Array.from(q).sort();
  }, [villas]);

  const filtered = useMemo(() => {
    return villas.filter((v) => {
      if (quartierFilter && v.quartier !== quartierFilter) return false;
      if (piecesFilter) {
        if (piecesFilter === '1-3' && v.pieces > 3) return false;
        if (piecesFilter === '4-6' && (v.pieces < 4 || v.pieces > 6)) return false;
        if (piecesFilter === '7+' && v.pieces < 7) return false;
      }
      if (statutFilter && v.statut !== statutFilter) return false;
      return true;
    });
  }, [villas, quartierFilter, piecesFilter, statutFilter]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-6 w-80" />
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
          NOS VILLAS
        </h1>
        <p className="text-muted-foreground mt-2">
          Villas résidentielles à louer dans les meilleurs quartiers d'Abidjan
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8 items-center">
        <Filter className="w-4 h-4 text-gpro-accent" />
        <select
          value={quartierFilter}
          onChange={(e) => setQuartierFilter(e.target.value)}
          className="bg-white border border-border px-4 py-2 text-sm font-mono-spec focus:outline-none focus:ring-2 focus:ring-gpro-accent"
        >
          <option value="">Tous les quartiers</option>
          {quartiers.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
        <select
          value={piecesFilter}
          onChange={(e) => setPiecesFilter(e.target.value)}
          className="bg-white border border-border px-4 py-2 text-sm font-mono-spec focus:outline-none focus:ring-2 focus:ring-gpro-accent"
        >
          <option value="">Toutes les pièces</option>
          <option value="1-3">1 — 3 pièces</option>
          <option value="4-6">4 — 6 pièces</option>
          <option value="7+">7+ pièces</option>
        </select>
        <select
          value={statutFilter}
          onChange={(e) => setStatutFilter(e.target.value)}
          className="bg-white border border-border px-4 py-2 text-sm font-mono-spec focus:outline-none focus:ring-2 focus:ring-gpro-accent"
        >
          <option value="">Tous les statuts</option>
          <option value="disponible">Disponible</option>
          <option value="loué">Loué</option>
        </select>
        <span className="text-sm text-muted-foreground ml-auto font-mono-spec">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Home className="w-16 h-16 text-gpro-muted mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Aucune villa trouvée</p>
          <p className="text-gpro-muted text-sm mt-1">
            Modifiez vos filtres ou consultez-nous directement
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v, i) => {
            const photos = parsePhotos(v.photos);
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => navigate('villa-detail', { id: v.id })}
                className="bg-white cursor-pointer group hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gpro-dark relative overflow-hidden">
                  {photos.length > 0 ? (
                    <img
                      src={photos[0]}
                      alt={v.titre}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-12 h-12 text-gpro-muted" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={
                        v.statut === 'disponible'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : v.statut === 'loué'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      }
                    >
                      {v.statut}
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-uppercase text-lg text-gpro-dark mb-2">
                    {v.titre}
                  </h3>
                  <p className="font-mono-spec text-sm text-muted-foreground">
                    {v.quartier} — {v.pieces} pièces
                  </p>
                  <p className="font-mono-spec text-sm text-gpro-accent mt-1">
                    {v.prix || 'Sur demande'}
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

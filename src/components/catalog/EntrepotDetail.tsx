'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from '@/lib/router';
import { ArrowLeft, Warehouse, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

export default function EntrepotDetail() {
  const { params, navigate } = useRouter();
  const id = params.id;
  const [entrepot, setEntrepot] = useState<Entrepot | null>(null);
  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    if (!id || initialized.current) return;
    initialized.current = true;
    fetch(`/api/entrepots/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setEntrepot(data.entrepot);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-40 mb-6" />
        <Skeleton className="h-96 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (notFound || !entrepot) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto text-center">
        <Warehouse className="w-16 h-16 text-gpro-muted mx-auto mb-4" />
        <p className="text-xl text-gpro-dark">Entrepôt non trouvé</p>
        <button
          onClick={() => navigate('entrepots')}
          className="mt-4 text-gpro-accent hover:underline font-display text-uppercase"
        >
          Retour aux entrepôts
        </button>
      </div>
    );
  }

  const photos = parsePhotos(entrepot.photos);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto">
      <button
        onClick={() => navigate('entrepots')}
        className="flex items-center gap-2 text-gpro-accent hover:text-gpro-dark transition-colors mb-6 font-display text-uppercase text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      {photos.length > 0 ? (
        <div className="mb-8">
          <div className="h-64 md:h-96 bg-gpro-dark overflow-hidden">
            <img
              src={photos[activePhoto]}
              alt={entrepot.titre}
              className="w-full h-full object-cover"
            />
          </div>
          {photos.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
              {photos.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={`flex-shrink-0 w-20 h-16 overflow-hidden border-2 transition-colors ${
                    i === activePhoto
                      ? 'border-gpro-accent'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="h-64 md:h-96 bg-gpro-dark flex items-center justify-center mb-8">
          <Warehouse className="w-16 h-16 text-gpro-muted" />
        </div>
      )}

      <div className="flex flex-wrap items-start gap-4 mb-6">
        <h1 className="font-display text-uppercase text-2xl md:text-3xl text-gpro-dark">
          {entrepot.titre}
        </h1>
        <Badge
          className={
            entrepot.statut === 'disponible'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : entrepot.statut === 'loué'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-yellow-600 hover:bg-yellow-700 text-white'
          }
        >
          {entrepot.statut}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div>
          <p className="text-xs text-muted-foreground font-display text-uppercase mb-1">
            Surface
          </p>
          <p className="font-mono-spec text-xl text-gpro-dark">
            {entrepot.surface} m²
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-display text-uppercase mb-1">
            Gamme
          </p>
          <p className="font-mono-spec text-xl text-gpro-dark capitalize">
            {entrepot.gamme}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-display text-uppercase mb-1">
            Zone
          </p>
          <p className="font-mono-spec text-xl text-gpro-dark">{entrepot.zone}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-display text-uppercase mb-1">
            Type marchandise
          </p>
          <p className="font-mono-spec text-lg text-gpro-dark">
            {entrepot.typeMarchandise}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-display text-uppercase mb-1">
            Type d'accès
          </p>
          <p className="font-mono-spec text-lg text-gpro-dark">
            {entrepot.typeAcces}
          </p>
        </div>
      </div>

      <a
        href="https://wa.me/2250700000000"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-gpro-accent text-white px-6 py-3 font-display text-uppercase hover:bg-gpro-accent/80 transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        Contacter via WhatsApp
      </a>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from '@/lib/router';
import { ArrowLeft, Home, MessageCircle } from 'lucide-react';
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

export default function VillaDetail() {
  const { params, navigate } = useRouter();
  const id = params.id;
  const [villa, setVilla] = useState<Villa | null>(null);
  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    if (!id || initialized.current) return;
    initialized.current = true;
    fetch(`/api/villas/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setVilla(data.villa);
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
      </div>
    );
  }

  if (notFound || !villa) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto text-center">
        <Home className="w-16 h-16 text-gpro-muted mx-auto mb-4" />
        <p className="text-xl text-gpro-dark">Villa non trouvée</p>
        <button
          onClick={() => navigate('villas')}
          className="mt-4 text-gpro-accent hover:underline font-display text-uppercase"
        >
          Retour aux villas
        </button>
      </div>
    );
  }

  const photos = parsePhotos(villa.photos);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto">
      <button
        onClick={() => navigate('villas')}
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
              alt={villa.titre}
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
          <Home className="w-16 h-16 text-gpro-muted" />
        </div>
      )}

      <div className="flex flex-wrap items-start gap-4 mb-6">
        <h1 className="font-display text-uppercase text-2xl md:text-3xl text-gpro-dark">
          {villa.titre}
        </h1>
        <Badge
          className={
            villa.statut === 'disponible'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : villa.statut === 'loué'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-yellow-600 hover:bg-yellow-700 text-white'
          }
        >
          {villa.statut}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div>
          <p className="text-xs text-muted-foreground font-display text-uppercase mb-1">
            Quartier
          </p>
          <p className="font-mono-spec text-xl text-gpro-dark">{villa.quartier}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-display text-uppercase mb-1">
            Pièces
          </p>
          <p className="font-mono-spec text-xl text-gpro-dark">{villa.pieces}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-display text-uppercase mb-1">
            Prix
          </p>
          <p className="font-display text-xl text-gpro-accent capitalize">
            {villa.prix || 'Sur demande'}
          </p>
        </div>
      </div>

      {villa.description && (
        <div className="mb-8">
          <h2 className="font-display text-uppercase text-sm text-muted-foreground mb-3">
            Description
          </h2>
          <p className="text-gpro-dark leading-relaxed whitespace-pre-line">
            {villa.description}
          </p>
        </div>
      )}

      <a
        href="https://wa.me/2250777041010"
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

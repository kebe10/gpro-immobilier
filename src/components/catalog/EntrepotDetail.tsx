'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from '@/lib/router';
import { ArrowLeft, Warehouse, MessageCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
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

export default function EntrepotDetail() {
  const { params, navigate } = useRouter();
  const id = params.id;
  const [entrepot, setEntrepot] = useState<Entrepot | null>(null);
  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightbox, setLightbox] = useState(false);

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
  const safePhoto = photos.length > 0 ? activePhoto % photos.length : 0;

  const prevPhoto = () => {
    setActivePhoto((p) => (p === 0 ? photos.length - 1 : p - 1));
  };

  const nextPhoto = () => {
    setActivePhoto((p) => (p === photos.length - 1 ? 0 : p + 1));
  };

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
          {/* Main image */}
          <div
            className="relative w-full bg-gpro-dark overflow-hidden cursor-pointer group"
            style={{ aspectRatio: '16/9' }}
            onClick={() => setLightbox(true)}
          >
            <img
              src={photos[safePhoto]}
              alt={entrepot.titre}
              className="w-full h-full object-cover"
            />
            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 font-mono-spec">
              {safePhoto + 1} / {photos.length}
            </div>
          </div>
          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
              {photos.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={`flex-shrink-0 overflow-hidden border-2 transition-all ${
                    i === safePhoto
                      ? 'border-gpro-accent opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                  style={{ width: '100px', height: '72px' }}
                >
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {/* Lightbox */}
          {lightbox && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
              onClick={() => setLightbox(false)}
            >
              <button
                onClick={() => setLightbox(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
              >
                <X className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-12 h-12 flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <img
                src={photos[safePhoto]}
                alt={entrepot.titre}
                className="max-w-[90vw] max-h-[85vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-12 h-12 flex items-center justify-center"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-sm px-3 py-1 font-mono-spec">
                {safePhoto + 1} / {photos.length}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-8 bg-gpro-dark flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
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
        href="https://wa.me/2250594249933"
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

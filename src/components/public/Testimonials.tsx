'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Avis {
  id: string;
  nom: string;
  fonction: string;
  texte: string;
  note: number;
  photo: string;
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < count
              ? 'fill-gpro-accent text-gpro-accent'
              : 'fill-gpro-dark/15 text-gpro-dark/15'
          }`}
        />
      ))}
    </div>
  );
}

function AvatarPlaceholder({ nom }: { nom: string }) {
  const initials = nom
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-14 h-14 rounded-full bg-gpro-accent/15 text-gpro-accent flex items-center justify-center text-lg font-display font-bold">
      {initials}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [avis, setAvis] = useState<Avis[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('/api/avis')
      .then((r) => r.json())
      .then((data) => setAvis(data.avis || []))
      .catch(() => {});
  }, []);

  // Auto-rotation
  useEffect(() => {
    if (avis.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % avis.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [avis.length]);

  if (avis.length === 0) return null;

  const prev = () => setCurrent((c) => (c - 1 + avis.length) % avis.length);
  const next = () => setCurrent((c) => (c + 1) % avis.length);

  const item = avis[current];

  return (
    <section className="bg-gpro-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="font-mono-spec text-gpro-accent text-xs tracking-widest uppercase mb-3">
            Temoignages
          </p>
          <h2 className="font-display text-white text-3xl md:text-4xl font-bold text-uppercase">
            Ce que disent nos clients
          </h2>
        </motion.div>

        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Quote icon */}
          <Quote className="w-10 h-10 text-gpro-accent/30 mx-auto mb-6" />

          {/* Texte */}
          <p className="text-white/85 text-lg md:text-xl leading-relaxed mb-8 italic">
            &ldquo;{item.texte}&rdquo;
          </p>

          {/* Etoiles */}
          <div className="flex justify-center mb-6">
            <Stars count={item.note} />
          </div>

          {/* Auteur */}
          <div className="flex flex-col items-center gap-3">
            {item.photo ? (
              <img
                src={item.photo}
                alt={item.nom}
                className="w-14 h-14 rounded-full object-cover border-2 border-gpro-accent/40"
              />
            ) : (
              <AvatarPlaceholder nom={item.nom} />
            )}
            <div>
              <p className="text-white font-display font-semibold text-uppercase">{item.nom}</p>
              <p className="text-white/50 text-sm">{item.fonction}</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        {avis.length > 1 && (
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prev}
              className="p-2 border border-white/15 rounded-full hover:border-gpro-accent hover:text-gpro-accent transition-colors text-white/50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {avis.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === current ? 'bg-gpro-accent w-6' : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 border border-white/15 rounded-full hover:border-gpro-accent hover:text-gpro-accent transition-colors text-white/50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

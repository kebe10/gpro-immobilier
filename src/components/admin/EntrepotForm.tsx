'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from '@/lib/router';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';

interface EntrepotData {
  titre: string;
  zone: string;
  surface: string;
  gamme: string;
  typeMarchandise: string;
  typeAcces: string;
  statut: string;
}

const emptyForm: EntrepotData = {
  titre: '',
  zone: '',
  surface: '',
  gamme: 'moyenne',
  typeMarchandise: '',
  typeAcces: '',
  statut: 'disponible',
};

// Convertir un File en base64 data URL avec compression
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Redimensionner et compresser une image avant base64
function compressImage(file: File, maxWidth = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas non supporte')); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export default function EntrepotForm() {
  const { params, navigate } = useRouter();
  const editId = params.id;
  const isEdit = !!editId;

  const tokenRef = useRef('');
  const [form, setForm] = useState<EntrepotData>(emptyForm);
  const [photos, setPhotos] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('gpro_token');
    if (!t) { navigate('admin-login'); return; }
    tokenRef.current = t;
    if (!editId) return;
    fetch(`/api/entrepots/${editId}`, {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const e = data.entrepot;
        if (!e) return;
        setForm({
          titre: e.titre,
          zone: e.zone,
          surface: String(e.surface),
          gamme: e.gamme,
          typeMarchandise: e.typeMarchandise,
          typeAcces: e.typeAcces,
          statut: e.statut,
        });
        try {
          const parsed = JSON.parse(e.photos);
          if (Array.isArray(parsed)) setPhotos(parsed);
        } catch { /* empty */ }
      });
  }, [editId, navigate]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      // Compresser et convertir chaque fichier en base64
      const base64List = await Promise.all(
        files.map((f) => compressImage(f))
      );
      setPhotos((prev) => [...prev, ...base64List]);
    } catch {
      setError('Erreur lors du traitement des images');
    }
    setUploading(false);
    // Reset l'input pour pouvoir re-sélectionner le même fichier
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const url = isEdit ? `/api/entrepots/${editId}` : '/api/entrepots';
      const method = isEdit ? 'PUT' : 'POST';

      // Toujours envoyer en JSON - les images sont en base64
      const body: Record<string, unknown> = {
        titre: form.titre,
        zone: form.zone,
        surface: parseInt(form.surface, 10) || 0,
        gamme: form.gamme,
        typeMarchandise: form.typeMarchandise,
        typeAcces: form.typeAcces,
        statut: form.statut,
        photos: JSON.stringify(photos),
      };

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Erreur lors de l\'enregistrement');
      } else {
        navigate('admin-dashboard');
      }
    } catch {
      setError('Erreur réseau');
    }
    setSaving(false);
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 text-white pl-3 pr-4 py-3 focus:outline-none focus:border-gpro-accent font-mono-spec text-sm';
  const labelClass =
    'block text-gpro-muted text-xs font-display text-uppercase mb-2';

  return (
    <div className="min-h-screen bg-gpro-dark pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('admin-dashboard')}
          className="flex items-center gap-2 text-gpro-muted hover:text-white transition-colors mb-6 font-display text-uppercase text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <h1 className="font-display text-uppercase text-2xl text-white mb-8">
          {isEdit ? "MODIFIER L'ENTREPÔT" : 'NOUVEL ENTREPÔT'}
        </h1>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Titre *</label>
            <input
              type="text"
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              required
              className={inputClass}
              placeholder="Entrepôt Zone Industrielle Yopougon"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Zone *</label>
              <input
                type="text"
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
                required
                className={inputClass}
                placeholder="Yopougon"
              />
            </div>
            <div>
              <label className={labelClass}>Surface (m²) *</label>
              <input
                type="number"
                value={form.surface}
                onChange={(e) => setForm({ ...form, surface: e.target.value })}
                required
                className={inputClass}
                placeholder="500"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Gamme de capacité *</label>
            <select
              value={form.gamme}
              onChange={(e) => setForm({ ...form, gamme: e.target.value })}
              className={inputClass}
            >
              <option value="petite">Petite (50 — 200 m²)</option>
              <option value="moyenne">Moyenne (200 — 1 000 m²)</option>
              <option value="grande">Grande (1 000+ m²)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Type de marchandise</label>
              <input
                type="text"
                value={form.typeMarchandise}
                onChange={(e) =>
                  setForm({ ...form, typeMarchandise: e.target.value })
                }
                className={inputClass}
                placeholder="Palettisé, vrac, alimentaire..."
              />
            </div>
            <div>
              <label className={labelClass}>Type d'accès véhicule</label>
              <input
                type="text"
                value={form.typeAcces}
                onChange={(e) =>
                  setForm({ ...form, typeAcces: e.target.value })
                }
                className={inputClass}
                placeholder="Porte sectionnelle, quai..."
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Statut</label>
            <select
              value={form.statut}
              onChange={(e) => setForm({ ...form, statut: e.target.value })}
              className={inputClass}
            >
              <option value="disponible">Disponible</option>
              <option value="loué">Loué</option>
              <option value="en pause">En pause</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Photos</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {photos.map((p, i) => (
                <div key={`photo-${i}`} className="relative w-24 h-20">
                  <img
                    src={p}
                    alt=""
                    className="w-full h-full object-cover border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-20 border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-gpro-accent transition-colors">
                {uploading ? (
                  <span className="text-gpro-accent text-xs">Traitement...</span>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-gpro-muted" />
                    <span className="text-gpro-muted text-xs mt-1">Ajouter</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-gpro-accent text-white px-6 py-3 font-display text-uppercase hover:bg-gpro-accent/80 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement...' : isEdit ? "METTRE À JOUR" : "CRÉER L'ENTREPÔT"}
          </button>
        </form>
      </div>
    </div>
  );
}

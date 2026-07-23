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

export default function EntrepotForm() {
  const { params, navigate } = useRouter();
  const editId = params.id;
  const isEdit = !!editId;

  const tokenRef = useRef('');
  const [form, setForm] = useState<EntrepotData>(emptyForm);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
          const photos = JSON.parse(e.photos);
          if (Array.isArray(photos)) setExistingPhotos(photos);
        } catch { /* empty */ }
      });
  }, [editId, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('titre', form.titre);
      formData.append('zone', form.zone);
      formData.append('surface', form.surface);
      formData.append('gamme', form.gamme);
      formData.append('typeMarchandise', form.typeMarchandise);
      formData.append('typeAcces', form.typeAcces);
      formData.append('statut', form.statut);
      formData.append('photos', JSON.stringify(existingPhotos));
      newFiles.forEach((f) => formData.append('files', f));

      const url = isEdit ? `/api/entrepots/${editId}` : '/api/entrepots';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${tokenRef.current}` },
        body: formData,
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
          {isEdit ? 'MODIFIER L\'ENTREPÔT' : 'NOUVEL ENTREPÔT'}
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
              {existingPhotos.map((p, i) => (
                <div key={`ex-${i}`} className="relative w-24 h-20">
                  <img
                    src={p}
                    alt=""
                    className="w-full h-full object-cover border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {previews.map((p, i) => (
                <div key={`new-${i}`} className="relative w-24 h-20">
                  <img
                    src={p}
                    alt=""
                    className="w-full h-full object-cover border border-gpro-accent"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-20 border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-gpro-accent transition-colors">
                <Upload className="w-5 h-5 text-gpro-muted" />
                <span className="text-gpro-muted text-xs mt-1">Ajouter</span>
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
            {saving ? 'Enregistrement...' : isEdit ? 'METTRE À JOUR' : 'CRÉER L\'ENTREPÔT'}
          </button>
        </form>
      </div>
    </div>
  );
}

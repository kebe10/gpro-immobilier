'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from '@/lib/router';
import { ArrowLeft, Save, Star, X } from 'lucide-react';

interface AvisData {
  nom: string;
  fonction: string;
  texte: string;
  note: number;
  photo: string;
  ordre: number;
  active: boolean;
}

const emptyForm: AvisData = {
  nom: '',
  fonction: '',
  texte: '',
  note: 5,
  photo: '',
  ordre: 0,
  active: true,
};

// Compresser une image en base64
function compressImage(file: File, maxWidth = 200, quality = 0.8): Promise<string> {
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

export default function AvisForm() {
  const { params, navigate } = useRouter();
  const editId = params.id;
  const isEdit = !!editId;

  const tokenRef = useRef('');
  const [form, setForm] = useState<AvisData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [hoverNote, setHoverNote] = useState(0);

  useEffect(() => {
    const t = localStorage.getItem('gpro_token');
    if (!t) { navigate('admin-login'); return; }
    tokenRef.current = t;
    if (!editId) return;
    fetch(`/api/avis/${editId}`, {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const a = data.avis;
        if (!a) return;
        setForm({
          nom: a.nom,
          fonction: a.fonction,
          texte: a.texte,
          note: a.note,
          photo: a.photo || '',
          ordre: a.ordre,
          active: a.active,
        });
      });
  }, [editId, navigate]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await compressImage(file);
      setForm((prev) => ({ ...prev, photo: base64 }));
    } catch {
      setError('Erreur lors du traitement de la photo');
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const url = isEdit ? `/api/avis/${editId}` : '/api/avis';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Erreur lors de l'enregistrement");
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
          {isEdit ? "MODIFIER L'AVIS" : 'NOUVEL AVIS'}
        </h1>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo */}
          <div>
            <label className={labelClass}>Photo du client (optionnel)</label>
            <div className="flex items-center gap-4">
              {form.photo ? (
                <div className="relative">
                  <img
                    src={form.photo}
                    alt=""
                    className="w-16 h-16 rounded-full object-cover border-2 border-gpro-accent/40"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, photo: '' }))}
                    className="absolute -top-1 -right-1 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center">
                  <span className="text-gpro-muted text-xs">Aucune</span>
                </div>
              )}
              <label className="px-4 py-2 border border-white/20 text-gpro-muted text-sm cursor-pointer hover:border-gpro-accent hover:text-gpro-accent transition-colors">
                {uploading ? 'Traitement...' : 'Choisir une photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Nom *</label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                required
                className={inputClass}
                placeholder="Aminata K."
              />
            </div>
            <div>
              <label className={labelClass}>Fonction / Type de client</label>
              <input
                type="text"
                value={form.fonction}
                onChange={(e) => setForm({ ...form, fonction: e.target.value })}
                className={inputClass}
                placeholder="Locataire entrepôt Yopougon"
              />
            </div>
          </div>

          {/* Note (étoiles) */}
          <div>
            <label className={labelClass}>Note</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const starVal = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, note: starVal }))}
                    onMouseEnter={() => setHoverNote(starVal)}
                    onMouseLeave={() => setHoverNote(0)}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        starVal <= (hoverNote || form.note)
                          ? 'fill-gpro-accent text-gpro-accent'
                          : 'fill-white/15 text-white/15'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClass}>Témoignage *</label>
            <textarea
              value={form.texte}
              onChange={(e) => setForm({ ...form, texte: e.target.value })}
              required
              rows={4}
              className={inputClass}
              placeholder="Leur entrepôt à Yopougon est exactement ce qu'il nous fallait..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Ordre d'affichage</label>
              <input
                type="number"
                value={form.ordre}
                onChange={(e) => setForm({ ...form, ordre: parseInt(e.target.value, 10) || 0 })}
                className={inputClass}
                placeholder="0"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 accent-gpro-accent"
                />
                <span className="text-gpro-muted text-sm">Publié sur le site</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-gpro-accent text-white px-6 py-3 font-display text-uppercase hover:bg-gpro-accent/80 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement...' : isEdit ? "METTRE À JOUR" : "CRÉER L'AVIS"}
          </button>
        </form>
      </div>
    </div>
  );
}

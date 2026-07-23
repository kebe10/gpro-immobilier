'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { Lock, Mail, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('Identifiants incorrects');
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem('gpro_token', data.token);
      localStorage.setItem('gpro_user', JSON.stringify(data.user));
      navigate('admin-dashboard');
    } catch {
      setError('Erreur de connexion au serveur');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gpro-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 text-gpro-muted hover:text-white transition-colors mb-8 font-display text-uppercase text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au site
        </button>

        <div className="mb-8">
          <h1 className="font-display text-uppercase text-3xl text-white">
            ESPACE ADMIN
          </h1>
          <p className="text-gpro-muted mt-2 text-sm">
            Connectez-vous pour gérer vos annonces
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gpro-muted text-xs font-display text-uppercase mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gpro-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 focus:outline-none focus:border-gpro-accent font-mono-spec text-sm"
                placeholder="admin@gpro.ci"
              />
            </div>
          </div>

          <div>
            <label className="block text-gpro-muted text-xs font-display text-uppercase mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gpro-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 focus:outline-none focus:border-gpro-accent font-mono-spec text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gpro-accent text-white py-3 font-display text-uppercase hover:bg-gpro-accent/80 transition-colors disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'SE CONNECTER'}
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { Lock, Mail, ArrowLeft, UserPlus, User } from 'lucide-react';

export default function AdminLogin() {
  const { navigate } = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const inputClass =
    'w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 focus:outline-none focus:border-gpro-accent font-mono-spec text-sm';
  const labelClass =
    'block text-gpro-muted text-xs font-display text-uppercase mb-2';

  const handleLogin = async (e: React.FormEvent) => {
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
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Identifiants incorrects');
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, secretCode }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Erreur lors de la création');
        setLoading(false);
        return;
      }

      setSuccess('Compte créé avec succès ! Connectez-vous maintenant.');
      setMode('login');
      setName('');
      setSecretCode('');
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
          <img
            src="/images/logo-gpro.png"
            alt="GPRO Immobilier"
            className="h-10 w-auto object-contain mb-4"
          />
          <h1 className="font-display text-uppercase text-3xl text-white">
            ESPACE ADMIN
          </h1>
          <p className="text-gpro-muted mt-2 text-sm">
            {mode === 'login'
              ? 'Connectez-vous pour gérer vos annonces'
              : 'Créer le compte administrateur'}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 mb-6 text-sm">
            {success}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={labelClass}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gpro-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="admin@gpro.ci"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gpro-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
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

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                className="text-gpro-muted hover:text-gpro-accent text-sm transition-colors flex items-center gap-2 mx-auto"
              >
                <UserPlus className="w-4 h-4" />
                Créer un compte administrateur
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className={labelClass}>Nom complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gpro-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gpro-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gpro-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={inputClass}
                  placeholder="Minimum 6 caractères"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Code secret</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gpro-muted" />
                <input
                  type="text"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="Code fourni par GPRO"
                />
              </div>
              <p className="text-gpro-muted text-xs mt-1.5">
                Ce code vous est fourni par GPRO Immobilier pour autoriser la création du compte.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gpro-accent text-white py-3 font-display text-uppercase hover:bg-gpro-accent/80 transition-colors disabled:opacity-50"
            >
              {loading ? 'Création...' : 'CRÉER LE COMPTE'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className="text-gpro-muted hover:text-white text-sm transition-colors"
              >
                Retour à la connexion
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

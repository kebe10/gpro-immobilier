'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from '@/lib/router';
import {
  Warehouse,
  Home,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Entrepot {
  id: string;
  titre: string;
  zone: string;
  surface: number;
  gamme: string;
  statut: string;
}

interface Villa {
  id: string;
  titre: string;
  quartier: string;
  pieces: number;
  prix: string;
  statut: string;
}

export default function AdminDashboard() {
  const { navigate } = useRouter();
  const tokenRef = useRef<string | null>(null);
  const [activeTab, setActiveTab] = useState<'entrepots' | 'villas'>('entrepots');
  const [entrepots, setEntrepots] = useState<Entrepot[]>([]);
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: string;
    id: string;
    titre: string;
  } | null>(null);

  const fetchEntrepots = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/entrepots?all=true', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEntrepots(data.entrepots || []);
    } catch { /* ignore */ }
  }, []);

  const fetchVillas = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/villas?all=true', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVillas(data.villas || []);
    } catch { /* ignore */ }
  }, []);

  const authHeaders = useCallback(() => ({
    Authorization: `Bearer ${tokenRef.current}`,
  }), []);

  useEffect(() => {
    const t = localStorage.getItem('gpro_token');
    if (!t) {
      navigate('admin-login');
      return;
    }
    tokenRef.current = t;
    Promise.all([
      fetch('/api/entrepots?all=true', { headers: { Authorization: `Bearer ${t}` } }).then((r) => r.json()).then((data) => setEntrepots(data.entrepots || [])).catch(() => {}),
      fetch('/api/villas?all=true', { headers: { Authorization: `Bearer ${t}` } }).then((r) => r.json()).then((data) => setVillas(data.villas || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [navigate, fetchEntrepots, fetchVillas]);

  const fetchData = useCallback(async () => {
    if (!tokenRef.current) return;
    try {
      const [eRes, vRes] = await Promise.all([
        fetch('/api/entrepots?all=true', { headers: authHeaders() }),
        fetch('/api/villas?all=true', { headers: authHeaders() }),
      ]);
      const eData = await eRes.json();
      const vData = await vRes.json();
      setEntrepots(eData.entrepots || []);
      setVillas(vData.villas || []);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [authHeaders]);

  const handleDelete = async () => {
    if (!deleteTarget || !tokenRef.current) return;
    const url =
      deleteTarget.type === 'entrepot'
        ? `/api/entrepots/${deleteTarget.id}`
        : `/api/villas/${deleteTarget.id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.ok) {
      fetchData();
    }
    setDeleteTarget(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('gpro_token');
    localStorage.removeItem('gpro_user');
    fetch('/api/auth', { method: 'DELETE' });
    navigate('home');
  };

  const statutBadge = (statut: string) => {
    const cls =
      statut === 'disponible'
        ? 'bg-green-600 hover:bg-green-700 text-white'
        : statut === 'loué'
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-yellow-600 hover:bg-yellow-700 text-white';
    return <Badge className={cls}>{statut}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gpro-light pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2 text-gpro-accent hover:text-gpro-dark transition-colors mb-2 font-display text-uppercase text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
            <h1 className="font-display text-uppercase text-3xl text-gpro-dark">
              TABLEAU DE BORD
            </h1>
          </div>
          <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gpro-muted hover:text-gpro-dark transition-colors font-display text-uppercase text-sm"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('entrepots')}
            className={`flex items-center gap-2 px-4 py-2 font-display text-uppercase text-sm transition-colors ${
              activeTab === 'entrepots'
                ? 'bg-gpro-dark text-white'
                : 'bg-white text-gpro-dark hover:bg-gpro-dark/10'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            Entrepôts ({entrepots.length})
          </button>
          <button
            onClick={() => setActiveTab('villas')}
            className={`flex items-center gap-2 px-4 py-2 font-display text-uppercase text-sm transition-colors ${
              activeTab === 'villas'
                ? 'bg-gpro-dark text-white'
                : 'bg-white text-gpro-dark hover:bg-gpro-dark/10'
            }`}
          >
            <Home className="w-4 h-4" />
            Résidentiel ({villas.length})
          </button>
        </div>

        {activeTab === 'entrepots' && (
          <div className="mb-4">
            <button
              onClick={() => navigate('admin-entrepot-form')}
              className="flex items-center gap-2 bg-gpro-accent text-white px-4 py-2 font-display text-uppercase text-sm hover:bg-gpro-accent/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter un entrepôt
            </button>
          </div>
        )}

        {activeTab === 'villas' && (
          <div className="mb-4">
            <button
              onClick={() => navigate('admin-villa-form')}
              className="flex items-center gap-2 bg-gpro-accent text-white px-4 py-2 font-display text-uppercase text-sm hover:bg-gpro-accent/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter un bien résidentiel
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Chargement...
          </div>
        ) : activeTab === 'entrepots' ? (
          <div className="bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">
                    Titre
                  </th>
                  <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">
                    Zone
                  </th>
                  <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">
                    Surface
                  </th>
                  <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">
                    Gamme
                  </th>
                  <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">
                    Statut
                  </th>
                  <th className="text-right p-4 font-display text-uppercase text-xs text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {entrepots.map((e) => (
                  <tr key={e.id} className="border-b border-border hover:bg-gpro-light/50">
                    <td className="p-4 font-medium">{e.titre}</td>
                    <td className="p-4 font-mono-spec text-xs">{e.zone}</td>
                    <td className="p-4 font-mono-spec text-xs">{e.surface} m²</td>
                    <td className="p-4 font-mono-spec text-xs capitalize">{e.gamme}</td>
                    <td className="p-4">{statutBadge(e.statut)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate('admin-entrepot-form', { id: e.id })
                          }
                          className="p-2 hover:bg-gpro-light transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              type: 'entrepot',
                              id: e.id,
                              titre: e.titre,
                            })
                          }
                          className="p-2 hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {entrepots.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      Aucun entrepôt
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">
                    Titre
                  </th>
                  <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">
                    Quartier
                  </th>
                  <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">
                    Pièces
                  </th>
                  <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">
                    Prix
                  </th>
                  <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">
                    Statut
                  </th>
                  <th className="text-right p-4 font-display text-uppercase text-xs text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {villas.map((v) => (
                  <tr key={v.id} className="border-b border-border hover:bg-gpro-light/50">
                    <td className="p-4 font-medium">{v.titre}</td>
                    <td className="p-4 font-mono-spec text-xs">{v.quartier}</td>
                    <td className="p-4 font-mono-spec text-xs">{v.pieces}</td>
                    <td className="p-4 font-mono-spec text-xs">{v.prix}</td>
                    <td className="p-4">{statutBadge(v.statut)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate('admin-villa-form', { id: v.id })
                          }
                          className="p-2 hover:bg-gpro-light transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              type: 'villa',
                              id: v.id,
                              titre: v.titre,
                            })
                          }
                          className="p-2 hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {villas.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      Aucun bien résidentiel
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer « {deleteTarget?.titre} » ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

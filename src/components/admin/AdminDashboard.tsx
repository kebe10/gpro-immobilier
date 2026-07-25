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
  MessageSquare,
  Star,
  Eye,
  EyeOff,
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

interface Avis {
  id: string;
  nom: string;
  fonction: string;
  texte: string;
  note: number;
  photo: string;
  ordre: number;
  active: boolean;
}

export default function AdminDashboard() {
  const { navigate } = useRouter();
  const tokenRef = useRef<string | null>(null);
  const [activeTab, setActiveTab] = useState<'entrepots' | 'villas' | 'avis'>('entrepots');
  const [entrepots, setEntrepots] = useState<Entrepot[]>([]);
  const [villas, setVillas] = useState<Villa[]>([]);
  const [avisList, setAvisList] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: string;
    id: string;
    titre: string;
  } | null>(null);

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
    fetchData();
  }, [navigate]);

  const fetchData = useCallback(async () => {
    if (!tokenRef.current) return;
    try {
      const [eRes, vRes, aRes] = await Promise.all([
        fetch('/api/entrepots?all=true', { headers: authHeaders() }),
        fetch('/api/villas?all=true', { headers: authHeaders() }),
        fetch('/api/avis', { headers: authHeaders() }),
      ]);
      const eData = await eRes.json();
      const vData = await vRes.json();
      // Les avis admin : on récupère tous (actifs et inactifs)
      const aData = await aRes.json();
      setEntrepots(eData.entrepots || []);
      setVillas(vData.villas || []);
      // GET /api/avis retourne seulement les actifs, il faut un endpoint admin
      // On utilise un paramètre query spécial
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [authHeaders]);

  // Charger tous les avis (y compris inactifs) depuis l'API admin
  useEffect(() => {
    if (!tokenRef.current) return;
    fetch('/api/avis?admin=true', { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => setAvisList(data.avis || []))
      .catch(() => {});
  }, [tokenRef.current]);

  const handleDelete = async () => {
    if (!deleteTarget || !tokenRef.current) return;
    let url = '';
    if (deleteTarget.type === 'entrepot') url = `/api/entrepots/${deleteTarget.id}`;
    else if (deleteTarget.type === 'villa') url = `/api/villas/${deleteTarget.id}`;
    else if (deleteTarget.type === 'avis') url = `/api/avis/${deleteTarget.id}`;
    if (!url) return;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.ok) {
      fetchData();
    }
    setDeleteTarget(null);
  };

  const toggleAvisActive = async (avis: Avis) => {
    if (!tokenRef.current) return;
    await fetch(`/api/avis/${avis.id}`, {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !avis.active }),
    });
    // Recharger les avis
    const res = await fetch('/api/avis?admin=true', { headers: authHeaders() });
    const data = await res.json();
    setAvisList(data.avis || []);
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

        {/* Tabs */}
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
          <button
            onClick={() => setActiveTab('avis')}
            className={`flex items-center gap-2 px-4 py-2 font-display text-uppercase text-sm transition-colors ${
              activeTab === 'avis'
                ? 'bg-gpro-dark text-white'
                : 'bg-white text-gpro-dark hover:bg-gpro-dark/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Avis ({avisList.length})
          </button>
        </div>

        {/* Boutons Ajouter */}
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
        {activeTab === 'avis' && (
          <div className="mb-4">
            <button
              onClick={() => navigate('admin-avis-form')}
              className="flex items-center gap-2 bg-gpro-accent text-white px-4 py-2 font-display text-uppercase text-sm hover:bg-gpro-accent/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter un avis
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Chargement...
          </div>
        ) : activeTab === 'entrepots' ? (
          <EntrepotsTable
            entrepots={entrepots}
            statutBadge={statutBadge}
            onEdit={(e) => navigate('admin-entrepot-form', { id: e.id })}
            onDelete={(e) => setDeleteTarget({ type: 'entrepot', id: e.id, titre: e.titre })}
          />
        ) : activeTab === 'villas' ? (
          <VillasTable
            villas={villas}
            statutBadge={statutBadge}
            onEdit={(v) => navigate('admin-villa-form', { id: v.id })}
            onDelete={(v) => setDeleteTarget({ type: 'villa', id: v.id, titre: v.titre })}
          />
        ) : (
          <AvisTable
            avis={avisList}
            onEdit={(a) => navigate('admin-avis-form', { id: a.id })}
            onDelete={(a) => setDeleteTarget({ type: 'avis', id: a.id, titre: a.nom })}
            onToggleActive={toggleAvisActive}
          />
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

/* --- Sub-components --- */

function EntrepotsTable({ entrepots, statutBadge, onEdit, onDelete }: {
  entrepots: Entrepot[];
  statutBadge: (s: string) => React.ReactNode;
  onEdit: (e: Entrepot) => void;
  onDelete: (e: Entrepot) => void;
}) {
  return (
    <div className="bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">Titre</th>
            <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">Zone</th>
            <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">Surface</th>
            <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">Gamme</th>
            <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">Statut</th>
            <th className="text-right p-4 font-display text-uppercase text-xs text-muted-foreground">Actions</th>
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
                  <button onClick={() => onEdit(e)} className="p-2 hover:bg-gpro-light transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(e)} className="p-2 hover:bg-red-50 text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
          {entrepots.length === 0 && (
            <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Aucun entrepôt</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function VillasTable({ villas, statutBadge, onEdit, onDelete }: {
  villas: Villa[];
  statutBadge: (s: string) => React.ReactNode;
  onEdit: (v: Villa) => void;
  onDelete: (v: Villa) => void;
}) {
  return (
    <div className="bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">Titre</th>
            <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">Quartier</th>
            <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">Pièces</th>
            <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">Prix</th>
            <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">Statut</th>
            <th className="text-right p-4 font-display text-uppercase text-xs text-muted-foreground">Actions</th>
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
                  <button onClick={() => onEdit(v)} className="p-2 hover:bg-gpro-light transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(v)} className="p-2 hover:bg-red-50 text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
          {villas.length === 0 && (
            <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Aucun bien résidentiel</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function AvisTable({ avis, onEdit, onDelete, onToggleActive }: {
  avis: Avis[];
  onEdit: (a: Avis) => void;
  onDelete: (a: Avis) => void;
  onToggleActive: (a: Avis) => void;
}) {
  return (
    <div className="bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">Client</th>
            <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">Témoignage</th>
            <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">Note</th>
            <th className="text-left p-4 font-display text-uppercase text-xs text-muted-foreground">Statut</th>
            <th className="text-right p-4 font-display text-uppercase text-xs text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {avis.map((a) => (
            <tr key={a.id} className="border-b border-border hover:bg-gpro-light/50">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  {a.photo ? (
                    <img src={a.photo} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gpro-accent/15 text-gpro-accent flex items-center justify-center text-xs font-bold">
                      {a.nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{a.nom}</p>
                    <p className="text-xs text-muted-foreground">{a.fonction}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 max-w-xs truncate text-muted-foreground text-xs">{a.texte}</td>
              <td className="p-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < a.note ? 'fill-gpro-accent text-gpro-accent' : 'fill-gray-200 text-gray-200'}`} />
                  ))}
                </div>
              </td>
              <td className="p-4">
                <button
                  onClick={() => onToggleActive(a)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    a.active
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {a.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {a.active ? 'Publié' : 'Masqué'}
                </button>
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => onEdit(a)} className="p-2 hover:bg-gpro-light transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(a)} className="p-2 hover:bg-red-50 text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
          {avis.length === 0 && (
            <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Aucun avis</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
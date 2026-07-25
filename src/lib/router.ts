import { create } from 'zustand';

type Page =
  | 'home'
  | 'entrepots'
  | 'entrepot-detail'
  | 'villas'
  | 'villa-detail'
  | 'zones'
  | 'contact'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-entrepot-form'
  | 'admin-villa-form'
  | 'admin-avis-form';

interface RouterState {
  page: Page;
  params: Record<string, string>;
  navigate: (page: Page, params?: Record<string, string>) => void;
}

export const useRouter = create<RouterState>((set) => ({
  page: 'home',
  params: {},
  navigate: (page, params = {}) => {
    set({ page, params });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
}));

export type { Page };

'use client';

import { useRouter } from '@/lib/router';

// Public
import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import WarehouseCards from '@/components/public/WarehouseCards';
import ZonesSection from '@/components/public/ZonesSection';
import Footer from '@/components/public/Footer';

// Catalog
import EntrepotCatalog from '@/components/catalog/EntrepotCatalog';
import EntrepotDetail from '@/components/catalog/EntrepotDetail';
import VillaCatalog from '@/components/catalog/VillaCatalog';
import VillaDetail from '@/components/catalog/VillaDetail';

// Admin
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import EntrepotForm from '@/components/admin/EntrepotForm';
import VillaForm from '@/components/admin/VillaForm';

export default function AppPage() {
  const { page } = useRouter();

  const isAdmin = page.startsWith('admin');
  const isDetail = page.includes('-detail');
  const showNav = !isAdmin && page !== 'admin-login';

  return (
    <div className="min-h-screen flex flex-col">
      {showNav && <Navbar />}

      <main className="flex-1">
        {page === 'home' && <HomePage />}
        {page === 'entrepots' && <EntrepotCatalog />}
        {page === 'entrepot-detail' && <EntrepotDetail />}
        {page === 'villas' && <VillaCatalog />}
        {page === 'villa-detail' && <VillaDetail />}
        {page === 'admin-login' && <AdminLogin />}
        {page === 'admin-dashboard' && <AdminDashboard />}
        {page === 'admin-entrepot-form' && <EntrepotForm />}
        {page === 'admin-villa-form' && <VillaForm />}
      </main>

      {showNav && <Footer />}
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <WarehouseCards />
      <ZonesSection />
    </>
  );
}

'use client';

import { useRouter } from '@/lib/router';

// Public
import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import WarehouseCards from '@/components/public/WarehouseCards';
import WhyGpro from '@/components/public/WhyGpro';
import ResidentialSection from '@/components/public/ResidentialSection';
import ZonesSection from '@/components/public/ZonesSection';
import CtaSection from '@/components/public/CtaSection';
import Contact from '@/components/public/Contact';
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
        {page === 'zones' && <ZonesPage />}
        {page === 'contact' && <Contact />}
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
      <WhyGpro />
      <ResidentialSection />
      <ZonesSection />
      <CtaSection />
    </>
  );
}

function ZonesPage() {
  return (
    <>
      <div className="bg-gpro-cream py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-gpro-dark text-3xl md:text-4xl font-bold text-uppercase text-center mb-4">
            Zones desservies
          </h2>
          <p className="text-center text-gpro-dark/60 max-w-xl mx-auto mb-14">
            GPRO Immobilier est présent dans les principales communes d&rsquo;Abidjan pour vous offrir un service de proximité.
          </p>
        </div>
      </div>
      <ZonesSection />
    </>
  );
}

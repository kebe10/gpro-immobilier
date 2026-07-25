import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const db = new PrismaClient();

async function main() {
  const passwordHash = createHash('sha256').update('admin123').digest('hex');
  await db.adminUser.upsert({
    where: { email: 'admin@gpro.ci' },
    update: {},
    create: {
      email: 'admin@gpro.ci',
      passwordHash,
      name: 'Admin GPRO',
    },
  });
  console.log('Admin created: admin@gpro.ci / admin123');

  const entrepots = [
    {
      titre: 'Entrepôt Zone Industrielle Yopougon',
      zone: 'Yopougon',
      surface: 800,
      gamme: 'moyenne',
      typeMarchandise: 'Palettisé, vrac, alimentaire',
      typeAcces: 'Porte sectionnelle, camion 19T',
      statut: 'disponible',
      photos: JSON.stringify(['/images/hero-warehouse.jpg', '/images/warehouse-interior.jpg']),
    },
    {
      titre: 'Entrepôt Logistique Koumassi',
      zone: 'Koumassi',
      surface: 2500,
      gamme: 'grande',
      typeMarchandise: 'Conteneurs, marchandises industrielles',
      typeAcces: 'Quai de déchargement, semi-remorque',
      statut: 'disponible',
      photos: JSON.stringify(['/images/hero-warehouse.jpg', '/images/warehouse-interior.jpg']),
    },
    {
      titre: 'Entrepôt Compact Adjamé',
      zone: 'Adjamé',
      surface: 120,
      gamme: 'petite',
      typeMarchandise: 'Stockage léger, e-commerce',
      typeAcces: 'Porte piétonne + véhicule léger',
      statut: 'disponible',
      photos: JSON.stringify(['/images/hero-warehouse.jpg', '/images/warehouse-interior.jpg']),
    },
    {
      titre: 'Entrepôt Vridi Port',
      zone: 'Vridi',
      surface: 3500,
      gamme: 'grande',
      typeMarchandise: 'Logistique portuaire, conteneurs',
      typeAcces: 'Quai de déchargement, semi-remorque',
      statut: 'loué',
      photos: JSON.stringify(['/images/hero-warehouse.jpg', '/images/warehouse-interior.jpg']),
    },
    {
      titre: 'Entrepôt Treichville Central',
      zone: 'Treichville',
      surface: 450,
      gamme: 'moyenne',
      typeMarchandise: 'Marchandises diverses, palettisé',
      typeAcces: 'Porte sectionnelle, camion 19T',
      statut: 'disponible',
      photos: JSON.stringify(['/images/hero-warehouse.jpg', '/images/warehouse-interior.jpg']),
    },
    {
      titre: 'Entrepôt Abobo Nord',
      zone: 'Abobo',
      surface: 80,
      gamme: 'petite',
      typeMarchandise: 'Stockage léger',
      typeAcces: 'Porte piétonne + véhicule léger',
      statut: 'disponible',
      photos: JSON.stringify(['/images/hero-warehouse.jpg', '/images/warehouse-interior.jpg']),
    },
  ];

  for (const e of entrepots) {
    await db.entrepot.create({ data: e });
  }
  console.log(`${entrepots.length} entrepôts créés`);

  const villas = [
    {
      titre: 'Villa 5 Pièces Cocody Plateau',
      quartier: 'Cocody',
      pieces: 5,
      description: 'Belle villa avec jardin, piscine et garage. Quartier résidentiel calme et sécurisé, proche des écoles internationales et du centre-ville.',
      prix: 'sur demande',
      statut: 'disponible',
      photos: JSON.stringify(['/images/villa-luxury.jpg']),
    },
    {
      titre: 'Villa 3 Pièces Marcory',
      quartier: 'Marcory',
      pieces: 3,
      description: 'Villa moderne entièrement rénovée, climatisée, avec terrasse. Idéale pour un couple ou une petite famille.',
      prix: '350 000 FCFA/mois',
      statut: 'disponible',
      photos: JSON.stringify(['/images/villa-luxury.jpg']),
    },
    {
      titre: 'Villa 7 Pièces Riviera',
      quartier: 'Cocody',
      pieces: 7,
      description: 'Villa de prestige avec piscine privée, jardin paysager, dépendance gardien, et 3 places de parking. Sécurité 24h/24.',
      prix: 'sur demande',
      statut: 'disponible',
      photos: JSON.stringify(['/images/villa-luxury.jpg']),
    },
    {
      titre: 'Villa 4 Pièces Yopougon',
      quartier: 'Yopougon',
      pieces: 4,
      description: 'Villa spacieuse dans quartier résidentiel. Salon double, cuisine équipée, 2 salles de bain.',
      prix: '200 000 FCFA/mois',
      statut: 'loué',
      photos: JSON.stringify(['/images/villa-luxury.jpg']),
    },
  ];

  for (const v of villas) {
    await db.villa.create({ data: v });
  }
  console.log(`${villas.length} villas créées`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());

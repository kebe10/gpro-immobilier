import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  const entrepots = await db.entrepot.findMany();
  const wh1 = '/images/hero-warehouse.jpg';
  const wh2 = '/images/warehouse-interior.jpg';

  for (const e of entrepots) {
    await db.entrepot.update({
      where: { id: e.id },
      data: { photos: JSON.stringify([wh1, wh2]) },
    });
  }
  console.log(`${entrepots.length} entrepôts mis à jour avec photos`);

  const villas = await db.villa.findMany();
  const vl = '/images/villa-luxury.jpg';

  for (const v of villas) {
    await db.villa.update({
      where: { id: v.id },
      data: { photos: JSON.stringify([vl]) },
    });
  }
  console.log(`${villas.length} villas mises à jour avec photos`);

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

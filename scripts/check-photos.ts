import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  const e = await db.entrepot.findFirst({ select: { titre: true, photos: true } });
  console.log('Entrepôt:', e?.titre, '=>', e?.photos);
  const v = await db.villa.findFirst({ select: { titre: true, photos: true } });
  console.log('Villa:', v?.titre, '=>', v?.photos);
  await db.
$disconnect();
}

main();

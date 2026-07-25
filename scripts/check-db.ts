import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function main() {
  const admins = await db.adminUser.count();
  const entrepots = await db.entrepot.count();
  const villas = await db.villa.count();
  console.log(`Admins: ${admins} | Entrepôts: ${entrepots} | Villas: ${villas}`);
  await db.$disconnect();
}
main();

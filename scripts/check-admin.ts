import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function main() {
  const admin = await db.adminUser.findUnique({ where: { email: 'admin@gpro.ci' } });
  if (!admin) { console.log('Admin NOT FOUND in DB'); return; }
  console.log('Admin found:', { id: admin.id, email: admin.email, name: admin.name, hash: admin.passwordHash });
  const { createHash } = await import('crypto');
  const testHash = createHash('sha256').update('admin123').digest('hex');
  console.log('Expected hash:', testHash);
  console.log('Match:', admin.passwordHash === testHash);
  await db.$disconnect();
}
main();

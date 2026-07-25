import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.replace('Bearer ', '');
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = extractBearerToken(request);
    if (!token || !await verifyToken(token)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const existing = await db.avis.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Avis non trouvé' }, { status: 404 });
    }

    const body = await request.json();
    const allowedFields = ['nom', 'fonction', 'texte', 'note', 'photo', 'ordre', 'active'];
    const data: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'note') {
          data[field] = Math.min(5, Math.max(1, body[field] as number));
        } else {
          data[field] = body[field];
        }
      }
    }

    const avis = await db.avis.update({ where: { id }, data });
    return NextResponse.json({ avis });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = extractBearerToken(request);
    if (!token || !await verifyToken(token)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const existing = await db.avis.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Avis non trouvé' }, { status: 404 });
    }

    await db.avis.delete({ where: { id } });
    return NextResponse.json({ message: 'Avis supprimé' });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

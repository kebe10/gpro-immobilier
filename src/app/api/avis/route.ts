import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.replace('Bearer ', '');
}

// Récupérer les avis (public: actifs seulement, admin: tous)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';

    const avis = await db.avis.findMany({
      where: isAdmin ? {} : { active: true },
      orderBy: { ordre: 'asc' },
    });
    return NextResponse.json({ avis });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Admin : créer un avis
export async function POST(request: NextRequest) {
  try {
    const token = extractBearerToken(request);
    if (!token || !await verifyToken(token)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { nom, fonction, texte, note, photo, ordre, active } = body;

    if (!nom || !texte) {
      return NextResponse.json({ error: 'Nom et texte requis' }, { status: 400 });
    }

    const avis = await db.avis.create({
      data: {
        nom: nom || '',
        fonction: fonction || '',
        texte: texte || '',
        note: typeof note === 'number' ? Math.min(5, Math.max(1, note)) : 5,
        photo: photo || '',
        ordre: typeof ordre === 'number' ? ordre : 0,
        active: typeof active === 'boolean' ? active : true,
      },
    });

    return NextResponse.json({ avis }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

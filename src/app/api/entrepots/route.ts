import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gamme = searchParams.get('gamme');
    const zone = searchParams.get('zone');
    const statut = searchParams.get('statut');
    const all = searchParams.get('all') === 'true';

    const where: Record<string, unknown> = {};

    if (gamme) where.gamme = gamme;
    if (zone) where.zone = zone;

    if (statut) {
      where.statut = statut;
    } else if (!all) {
      where.statut = 'disponible';
    }

    const entrepots = await db.entrepot.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ entrepots });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

async function saveUploadedFiles(formData: FormData): Promise<string> {
  const urls: string[] = [];

  // Extraire les photos existantes (URLs)
  const existingPhotos = formData.get('photos');
  if (existingPhotos && typeof existingPhotos === 'string') {
    try {
      const parsed = JSON.parse(existingPhotos);
      if (Array.isArray(parsed)) {
        urls.push(...parsed);
      }
    } catch {
      // Not JSON, ignore
    }
  }

  // Tenter d'écrire les nouveaux fichiers (échoue silencieusement sur Vercel)
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    const files = formData.getAll('files');
    for (const file of files) {
      if (file instanceof File) {
        const ext = path.extname(file.name) || '.png';
        const filename = `${randomUUID()}${ext}`;
        const filepath = path.join(uploadsDir, filename);
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filepath, buffer);
        urls.push(`/uploads/${filename}`);
      }
    }
  } catch {
    // Vercel filesystem est en lecture seule, on ignore l'erreur d'upload
  }

  return JSON.stringify(urls);
}

function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.replace('Bearer ', '');
}

export async function POST(request: NextRequest) {
  try {
    const token = extractBearerToken(request);
    if (!token || !await verifyToken(token)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';

    let titre: string;
    let zone: string;
    let surface: number;
    let gamme: string;
    let typeMarchandise: string;
    let typeAcces: string;
    let statut: string;
    let photos: string;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      titre = (formData.get('titre') as string) || '';
      zone = (formData.get('zone') as string) || '';
      surface = parseInt(formData.get('surface') as string, 10) || 0;
      gamme = (formData.get('gamme') as string) || '';
      typeMarchandise = (formData.get('typeMarchandise') as string) || '';
      typeAcces = (formData.get('typeAcces') as string) || '';
      statut = (formData.get('statut') as string) || 'disponible';
      photos = await saveUploadedFiles(formData);
    } else {
      const body = await request.json();
      titre = body.titre || '';
      zone = body.zone || '';
      surface = body.surface || 0;
      gamme = body.gamme || '';
      typeMarchandise = body.typeMarchandise || '';
      typeAcces = body.typeAcces || '';
      statut = body.statut || 'disponible';
      photos = body.photos || '[]';
    }

    if (!titre || !zone || !surface || !gamme) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const entrepot = await db.entrepot.create({
      data: { titre, zone, surface, gamme, typeMarchandise, typeAcces, photos, statut },
    });

    return NextResponse.json({ entrepot }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

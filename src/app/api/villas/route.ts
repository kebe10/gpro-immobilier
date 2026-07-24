import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quartier = searchParams.get('quartier');
    const pieces = searchParams.get('pieces');
    const statut = searchParams.get('statut');
    const all = searchParams.get('all') === 'true';

    const where: Record<string, unknown> = {};

    if (quartier) where.quartier = quartier;
    if (pieces) where.pieces = parseInt(pieces, 10);

    if (statut) {
      where.statut = statut;
    } else if (!all) {
      where.statut = 'disponible';
    }

    const villas = await db.villa.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ villas });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

async function saveUploadedFiles(formData: FormData): Promise<string> {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });

  const urls: string[] = [];

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
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';

    let titre: string;
    let quartier: string;
    let pieces: number;
    let description: string;
    let prix: string;
    let statut: string;
    let photos: string;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      titre = (formData.get('titre') as string) || '';
      quartier = (formData.get('quartier') as string) || '';
      pieces = parseInt(formData.get('pieces') as string, 10) || 0;
      description = (formData.get('description') as string) || '';
      prix = (formData.get('prix') as string) || 'sur demande';
      statut = (formData.get('statut') as string) || 'disponible';
      photos = await saveUploadedFiles(formData);
    } else {
      const body = await request.json();
      titre = body.titre || '';
      quartier = body.quartier || '';
      pieces = body.pieces || 0;
      description = body.description || '';
      prix = body.prix || 'sur demande';
      statut = body.statut || 'disponible';
      photos = body.photos || '[]';
    }

    if (!titre || !quartier) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const villa = await db.villa.create({
      data: { titre, quartier, pieces, description, prix, photos, statut },
    });

    return NextResponse.json({ villa }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

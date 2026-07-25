import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.replace('Bearer ', '');
}

async function saveUploadedFiles(formData: FormData): Promise<string> {
  const urls: string[] = [];
  // Extraire les photos existantes (URLs)
  const existingPhotos = formData.get('photos');
  if (existingPhotos && typeof existingPhotos === 'string') {
    try {
      const parsed = JSON.parse(existingPhotos);
      if (Array.isArray(parsed)) urls.push(...parsed);
    } catch { /* ignore */ }
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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const villa = await db.villa.findUnique({ where: { id } });
    if (!villa) {
      return NextResponse.json({ error: 'Villa non trouvée' }, { status: 404 });
    }
    return NextResponse.json({ villa });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = extractBearerToken(request);
    if (!token || !await verifyToken(token)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    const existing = await db.villa.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Villa non trouvée' }, { status: 404 });
    }
    const contentType = request.headers.get('content-type') || '';
    let data: Record<string, unknown> = {};
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('titre')) data.titre = formData.get('titre') as string;
      if (formData.has('quartier')) data.quartier = formData.get('quartier') as string;
      if (formData.has('pieces')) data.pieces = parseInt(formData.get('pieces') as string, 10);
      if (formData.has('description')) data.description = formData.get('description') as string;
      if (formData.has('prix')) data.prix = formData.get('prix') as string;
      if (formData.has('statut')) data.statut = formData.get('statut') as string;
      if (formData.has('photos') || formData.getAll('files').length > 0) {
        data.photos = await saveUploadedFiles(formData);
      }
    } else {
      const body = await request.json();
      const allowedFields = ['titre', 'quartier', 'pieces', 'description', 'prix', 'statut', 'photos'];
      for (const field of allowedFields) {
        if (body[field] !== undefined) data[field] = body[field];
      }
    }
    const villa = await db.villa.update({ where: { id }, data });
    return NextResponse.json({ villa });
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
    const existing = await db.villa.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Villa non trouvée' }, { status: 404 });
    }
    await db.villa.delete({ where: { id } });
    return NextResponse.json({ message: 'Villa supprimée' });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

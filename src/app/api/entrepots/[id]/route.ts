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
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });
  const urls: string[] = [];
  const existingPhotos = formData.get('photos');
  if (existingPhotos && typeof existingPhotos === 'string') {
    try {
      const parsed = JSON.parse(existingPhotos);
      if (Array.isArray(parsed)) urls.push(...parsed);
    } catch { /* ignore */ }
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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const entrepot = await db.entrepot.findUnique({ where: { id } });
    if (!entrepot) {
      return NextResponse.json({ error: 'Entrepôt non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ entrepot });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = extractBearerToken(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    const existing = await db.entrepot.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Entrepôt non trouvé' }, { status: 404 });
    }
    const contentType = request.headers.get('content-type') || '';
    let data: Record<string, unknown> = {};
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('titre')) data.titre = formData.get('titre') as string;
      if (formData.has('zone')) data.zone = formData.get('zone') as string;
      if (formData.has('surface')) data.surface = parseInt(formData.get('surface') as string, 10);
      if (formData.has('gamme')) data.gamme = formData.get('gamme') as string;
      if (formData.has('typeMarchandise')) data.typeMarchandise = formData.get('typeMarchandise') as string;
      if (formData.has('typeAcces')) data.typeAcces = formData.get('typeAcces') as string;
      if (formData.has('statut')) data.statut = formData.get('statut') as string;
      if (formData.has('photos') || formData.getAll('files').length > 0) {
        data.photos = await saveUploadedFiles(formData);
      }
    } else {
      const body = await request.json();
      const allowedFields = ['titre', 'zone', 'surface', 'gamme', 'typeMarchandise', 'typeAcces', 'statut', 'photos'];
      for (const field of allowedFields) {
        if (body[field] !== undefined) data[field] = body[field];
      }
    }
    const entrepot = await db.entrepot.update({ where: { id }, data });
    return NextResponse.json({ entrepot });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = extractBearerToken(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    const existing = await db.entrepot.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Entrepôt non trouvé' }, { status: 404 });
    }
    await db.entrepot.delete({ where: { id } });
    return NextResponse.json({ message: 'Entrepôt supprimé' });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

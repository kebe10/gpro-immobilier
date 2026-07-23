import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files.length) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const urls: string[] = [];

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

    if (urls.length === 1) {
      return NextResponse.json({ url: urls[0] });
    }

    return NextResponse.json({ urls });
  } catch {
    return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
  }
}

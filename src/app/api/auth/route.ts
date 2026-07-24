import { NextRequest, NextResponse } from 'next/server';
import { loginAdmin, createAdmin, verifyToken, invalidateToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    const result = await loginAdmin(email, password);
    if (!result) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    return NextResponse.json({ token: result.token, user: result.user });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
    }

    const user = await db.adminUser.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, secretCode } = body;

    if (!email || !password || !name || !secretCode) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    // Vérifier le code secret (configurable via env ou hardcodé)
    const validCode = process.env.ADMIN_SECRET_CODE || 'gpro2025';
    if (secretCode !== validCode) {
      return NextResponse.json({ error: 'Code secret invalide' }, { status: 403 });
    }

    // Vérifier si un admin avec cet email existe déjà
    const existing = await db.adminUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Un compte avec cet email existe déjà.' }, { status: 409 });
    }

    const admin = await createAdmin(email, password, name);
    return NextResponse.json({ message: 'Compte administrateur créé avec succès', admin: { id: admin.id, email: admin.email, name: admin.name } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    invalidateToken(token);

    return NextResponse.json({ message: 'Déconnexion réussie' });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

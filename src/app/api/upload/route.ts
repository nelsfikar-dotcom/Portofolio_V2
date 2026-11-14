import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string | null;

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { error: 'File gambar tidak ditemukan.' },
        { status: 400 }
      );
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format file harus berupa gambar (PNG, JPG, WEBP, GIF, atau SVG).' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || '.png';
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .slice(0, 40);

    const uniqueName = `${Date.now()}-${baseName || 'preview'}${ext}`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    await mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, uniqueName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    // Jika disertai projectId, langsung simpan ke kolom thumbnail Project di database
    if (projectId) {
      const updated = await prisma.project.update({
        where: { id: projectId },
        data: { thumbnail: publicUrl },
      });
      revalidatePath('/');
      revalidatePath('/projects');
      revalidatePath(`/projects/${updated.slug}`);
      revalidatePath('/admin/projects');
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: 'Gagal mengunggah gambar.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
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

    // Batasi ukuran maksimal file (misal 4 MB) agar payload Vercel & DB tetap ringan
    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Ukuran gambar maksimal adalah 4MB.' },
        { status: 400 }
      );
    }

    // Ubah file gambar menjadi Data URL (Base64) agar kompatibel dengan Vercel Serverless
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const publicUrl = `data:${file.type};base64,${base64Data}`;

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
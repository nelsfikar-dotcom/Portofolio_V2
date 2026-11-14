'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminSession, loginAdmin, logoutAdmin } from '@/lib/auth';
import { ContentStatus, SkillCategory } from '@prisma/client';

// Helper verifikasi sesi
async function requireAuth() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error('Sesi tidak terautentikasi. Silakan login terlebih dahulu.');
  }
  return session;
}

// ----------------------------------------------------
// 1. AUTH ACTIONS
// ----------------------------------------------------
export async function handleLogin(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' };
  }

  const result = await loginAdmin(email, password);
  if (!result.success) {
    return { error: result.error };
  }

  return { success: true };
}

export async function handleLogout() {
  await logoutAdmin();
}

// ----------------------------------------------------
// 2. PROFILE ACTIONS
// ----------------------------------------------------
export async function updateProfile(data: {
  fullName: string;
  role: string;
  headline: string;
  biography: string;
  location?: string;
  emailPublic?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  cvUrl?: string;
}) {
  await requireAuth();

  const existing = await prisma.profile.findFirst();
  if (existing) {
    await prisma.profile.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await prisma.profile.create({
      data,
    });
  }

  revalidatePath('/about');
  revalidatePath('/');
  revalidatePath('/admin/profile');
  return { success: true };
}

// ----------------------------------------------------
// 3. PROJECT ACTIONS
// ----------------------------------------------------
export async function saveProject(data: {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  thumbnail?: string | null;
  year: number;
  featured: boolean;
  status: ContentStatus;
  liveUrl?: string;
  repoUrl?: string;
  technologies: string[]; // nama-nama teknologi
}) {
  await requireAuth();

  const techCreate = data.technologies.map((name) => ({ name: name.trim() })).filter((t) => t.name.length > 0);

  if (data.id) {
    // Update
    await prisma.projectTechnology.deleteMany({
      where: { projectId: data.id },
    });

    await prisma.project.update({
      where: { id: data.id },
      data: {
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        description: data.description,
        category: data.category,
        ...(data.thumbnail !== undefined ? { thumbnail: data.thumbnail || null } : {}),
        year: data.year,
        featured: data.featured,
        status: data.status,
        liveUrl: data.liveUrl || null,
        repoUrl: data.repoUrl || null,
        technologies: {
          create: techCreate,
        },
      },
    });
  } else {
    // Create
    await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        description: data.description,
        category: data.category,
        thumbnail: data.thumbnail || null,
        year: data.year,
        featured: data.featured,
        status: data.status,
        liveUrl: data.liveUrl || null,
        repoUrl: data.repoUrl || null,
        technologies: {
          create: techCreate,
        },
      },
    });
  }

  revalidatePath('/projects');
  revalidatePath(`/projects/${data.slug}`);
  revalidatePath('/');
  revalidatePath('/admin/projects');
  return { success: true };
}

export async function deleteProject(id: string) {
  await requireAuth();
  await prisma.project.delete({ where: { id } });
  revalidatePath('/projects');
  revalidatePath('/');
  revalidatePath('/admin/projects');
  return { success: true };
}

// ----------------------------------------------------
// 4. SKILL ACTIONS
// ----------------------------------------------------
export async function saveSkill(data: {
  id?: string;
  name: string;
  category: SkillCategory;
  level?: string;
  sortOrder: number;
}) {
  await requireAuth();

  if (data.id) {
    await prisma.skill.update({
      where: { id: data.id },
      data: {
        name: data.name,
        category: data.category,
        level: data.level || null,
        sortOrder: data.sortOrder,
      },
    });
  } else {
    await prisma.skill.create({
      data: {
        name: data.name,
        category: data.category,
        level: data.level || null,
        sortOrder: data.sortOrder,
      },
    });
  }

  revalidatePath('/skills');
  revalidatePath('/');
  revalidatePath('/admin/skills');
  return { success: true };
}

export async function deleteSkill(id: string) {
  await requireAuth();
  await prisma.skill.delete({ where: { id } });
  revalidatePath('/skills');
  revalidatePath('/');
  revalidatePath('/admin/skills');
  return { success: true };
}

// ----------------------------------------------------
// 5. EXPERIENCE ACTIONS
// ----------------------------------------------------
export async function saveExperience(data: {
  id?: string;
  title: string;
  organization: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}) {
  await requireAuth();

  const startDateParsed = new Date(data.startDate);
  const endDateParsed = data.endDate ? new Date(data.endDate) : null;

  if (data.id) {
    await prisma.experience.update({
      where: { id: data.id },
      data: {
        title: data.title,
        organization: data.organization,
        description: data.description,
        startDate: startDateParsed,
        endDate: data.isCurrent ? null : endDateParsed,
        isCurrent: data.isCurrent,
      },
    });
  } else {
    await prisma.experience.create({
      data: {
        title: data.title,
        organization: data.organization,
        description: data.description,
        startDate: startDateParsed,
        endDate: data.isCurrent ? null : endDateParsed,
        isCurrent: data.isCurrent,
      },
    });
  }

  revalidatePath('/experience');
  revalidatePath('/admin/experience');
  return { success: true };
}

export async function deleteExperience(id: string) {
  await requireAuth();
  await prisma.experience.delete({ where: { id } });
  revalidatePath('/experience');
  revalidatePath('/admin/experience');
  return { success: true };
}

// ----------------------------------------------------
// 6. JOURNAL ACTIONS
// ----------------------------------------------------
export async function saveArticle(data: {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl?: string;
  status: ContentStatus;
  publishedAt?: string;
}) {
  await requireAuth();

  const publishedAtParsed =
    data.status === ContentStatus.PUBLISHED ? (data.publishedAt ? new Date(data.publishedAt) : new Date()) : null;

  if (data.id) {
    await prisma.article.update({
      where: { id: data.id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverUrl: data.coverUrl || null,
        status: data.status,
        publishedAt: publishedAtParsed,
      },
    });
  } else {
    await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverUrl: data.coverUrl || null,
        status: data.status,
        publishedAt: publishedAtParsed,
      },
    });
  }

  revalidatePath('/journal');
  revalidatePath(`/journal/${data.slug}`);
  revalidatePath('/admin/journal');
  return { success: true };
}

export async function deleteArticle(id: string) {
  await requireAuth();
  await prisma.article.delete({ where: { id } });
  revalidatePath('/journal');
  revalidatePath('/admin/journal');
  return { success: true };
}

// ----------------------------------------------------
// 7. MESSAGE ACTIONS
// ----------------------------------------------------
export async function toggleMessageRead(id: string, isRead: boolean) {
  await requireAuth();
  await prisma.contactMessage.update({
    where: { id },
    data: { isRead },
  });
  revalidatePath('/admin/messages');
  revalidatePath('/admin');
  return { success: true };
}

export async function deleteMessage(id: string) {
  await requireAuth();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath('/admin/messages');
  revalidatePath('/admin');
  return { success: true };
}

import React from 'react';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import ExperienceManager from '@/components/admin/ExperienceManager';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const instant = false;

export default async function AdminExperiencePage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const experiences = await prisma.experience.findMany({
    orderBy: {
      startDate: 'desc',
    },
  });

  return (
    <AdminShell adminEmail={session.email}>
      <ExperienceManager initialExperiences={experiences} />
    </AdminShell>
  );
}

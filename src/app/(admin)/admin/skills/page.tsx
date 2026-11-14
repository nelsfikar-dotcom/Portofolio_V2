import React from 'react';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import SkillManager from '@/components/admin/SkillManager';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const instant = false;

export default async function AdminSkillsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const skills = await prisma.skill.findMany({
    orderBy: {
      sortOrder: 'asc',
    },
  });

  return (
    <AdminShell adminEmail={session.email}>
      <SkillManager initialSkills={skills} />
    </AdminShell>
  );
}

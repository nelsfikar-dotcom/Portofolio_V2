import React from 'react';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import ProjectManager from '@/components/admin/ProjectManager';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const instant = false;

export default async function AdminProjectsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const projects = await prisma.project.findMany({
    include: {
      technologies: true,
    },
    orderBy: {
      year: 'desc',
    },
  });

  return (
    <AdminShell adminEmail={session.email}>
      <ProjectManager initialProjects={projects} />
    </AdminShell>
  );
}

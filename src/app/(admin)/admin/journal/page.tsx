import React from 'react';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import JournalManager from '@/components/admin/JournalManager';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const instant = false;

export default async function AdminJournalPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <AdminShell adminEmail={session.email}>
      <JournalManager initialArticles={articles} />
    </AdminShell>
  );
}

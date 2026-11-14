import React from 'react';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import MessageManager from '@/components/admin/MessageManager';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const instant = false;

export default async function AdminMessagesPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <AdminShell adminEmail={session.email}>
      <MessageManager initialMessages={messages} />
    </AdminShell>
  );
}

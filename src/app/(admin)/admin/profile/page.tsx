import React from 'react';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import ProfileManager from '@/components/admin/ProfileManager';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const instant = false;

export default async function AdminProfilePage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const profile = await prisma.profile.findFirst();

  return (
    <AdminShell adminEmail={session.email}>
      <ProfileManager initialProfile={profile} />
    </AdminShell>
  );
}

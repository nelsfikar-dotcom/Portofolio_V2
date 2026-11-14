import { PrismaClient, SkillCategory, ContentStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding database...');

  // 1. Bersihkan data lama (opsional saat development)
  await prisma.projectTechnology.deleteMany();
  await prisma.projectScreenshot.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.article.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.adminUser.deleteMany();

  // 2. Buat Akun Admin Awal
  const passwordHash = await bcrypt.hash('admin12345', 10);
  const admin = await prisma.adminUser.create({
    data: {
      email: 'admin@dzulfikar.dev',
      passwordHash,
    },
  });
  console.log(`✅ Admin user dibuat: ${admin.email}`);

  // 3. Buat Profil Default
  const profile = await prisma.profile.create({
    data: {
      fullName: 'Dzulfikar Tadah',
      role: 'Fullstack Developer',
      headline: 'Merancang Solusi Web Modern, Skalabel, & Interaktif.',
      biography:
        'Fullstack Developer yang berfokus pada pengembangan aplikasi web end-to-end dengan arsitektur bersih, performa tinggi, dan pengalaman pengguna yang berkarakter.',
      location: 'Indonesia',
      emailPublic: 'contact@dzulfikar.dev',
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com',
    },
  });
  console.log(`✅ Profil dibuat untuk: ${profile.fullName}`);

  // 4. Data Skill Awal
  const skillsData = [
    { name: 'Next.js (App Router)', category: SkillCategory.FRONTEND, sortOrder: 1 },
    { name: 'TypeScript', category: SkillCategory.FRONTEND, sortOrder: 2 },
    { name: 'React', category: SkillCategory.FRONTEND, sortOrder: 3 },
    { name: 'Material UI', category: SkillCategory.FRONTEND, sortOrder: 4 },
    { name: 'Node.js', category: SkillCategory.BACKEND, sortOrder: 5 },
    { name: 'PostgreSQL', category: SkillCategory.DATABASE, sortOrder: 6 },
    { name: 'Prisma ORM', category: SkillCategory.BACKEND, sortOrder: 7 },
    { name: 'REST API', category: SkillCategory.BACKEND, sortOrder: 8 },
    { name: 'Git & GitHub', category: SkillCategory.TOOLS, sortOrder: 9 },
    { name: 'Docker', category: SkillCategory.TOOLS, sortOrder: 10 },
  ];

  await prisma.skill.createMany({
    data: skillsData,
  });
  console.log(`✅ ${skillsData.length} skill awal berhasil ditambahkan`);

  // 5. Data Proyek Contoh (Published)
  const sampleProject = await prisma.project.create({
    data: {
      title: 'E-Commerce Platform & Management System',
      slug: 'ecommerce-platform',
      summary:
        'Aplikasi web e-commerce skala penuh dengan CMS terintegrasi, inventori otomatis, dan dashboard analitik.',
      description:
        'Proyek ini dirancang untuk menyelesaikan masalah pencatatan stok dan pelacakan transaksi secara realtime. Dibangun dengan Next.js App Router dan database PostgreSQL, menghasilkan performa rendering yang sangat cepat.',
      category: 'Fullstack Web App',
      year: 2026,
      featured: true,
      status: ContentStatus.PUBLISHED,
      liveUrl: 'https://demo-ecommerce.example.com',
      repoUrl: 'https://github.com',
      technologies: {
        create: [
          { name: 'Next.js' },
          { name: 'TypeScript' },
          { name: 'PostgreSQL' },
          { name: 'Prisma' },
          { name: 'Material UI' },
        ],
      },
    },
  });
  console.log(`✅ Proyek contoh dibuat: ${sampleProject.title}`);

  console.log('🚀 Seeding selesai dengan sukses!');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
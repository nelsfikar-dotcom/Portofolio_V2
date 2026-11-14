import React, { Suspense } from 'react';
import { Box, Container, Typography, Skeleton } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import { prisma } from '@/lib/prisma';
import { ContentStatus } from '@prisma/client';
import ProjectExplorer from '@/components/public/ProjectExplorer';

async function ProjectList() {
  const projects = await prisma.project.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
    },
    include: {
      technologies: true,
    },
    orderBy: {
      year: 'desc',
    },
  });

  return <ProjectExplorer projects={projects} />;
}

function ProjectsLoadingFallback() {
  return (
    <Box>
      <Skeleton
        variant="rectangular"
        height={64}
        sx={{ borderRadius: 4, mb: 4, bgcolor: 'background.paper' }}
      />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3.5 }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={420}
            sx={{ borderRadius: 4, bgcolor: 'background.paper' }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default function ProjectsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 0.6,
            mb: 2,
            borderRadius: '999px',
            bgcolor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.28)',
          }}
        >
          <CodeIcon sx={{ fontSize: 15, color: '#10B981' }} />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#34D399',
              letterSpacing: '0.1em',
            }}
          >
            {'ARCHIVE // SELECTED WORKS'}
          </Typography>
        </Box>

        <Typography
          variant="h1"
          className="gradient-text"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2.2rem', md: '3rem' },
            mb: 1.5,
          }}
        >
          Featured Projects & Archive
        </Typography>

        <Typography
          sx={{
            color: 'var(--text-muted)',
            maxWidth: 580,
            mx: 'auto',
            fontSize: '0.96rem',
            lineHeight: 1.75,
          }}
        >
          Koleksi proyek perangkat lunak yang dirancang dan dikembangkan dengan standar rekayasa
          modern. Gunakan filter kategori atau pencarian untuk menemukan studi kasus relevan.
        </Typography>
      </Box>

      <Suspense fallback={<ProjectsLoadingFallback />}>
        <ProjectList />
      </Suspense>
    </Container>
  );
}

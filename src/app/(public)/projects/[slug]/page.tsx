import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Button,
  Divider,
  Paper,
  Skeleton,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LaunchIcon from '@mui/icons-material/Launch';
import GitHubIcon from '@mui/icons-material/GitHub';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LayersIcon from '@mui/icons-material/Layers';
import { prisma } from '@/lib/prisma';
import { ContentStatus } from '@prisma/client';

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function ProjectDetailContent({ slugPromise }: { slugPromise: Promise<{ slug: string }> }) {
  const { slug } = await slugPromise;

  const project = await prisma.project.findFirst({
    where: {
      slug,
      status: ContentStatus.PUBLISHED,
    },
    include: {
      technologies: true,
      screenshots: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <>
      <Box sx={{ mb: 5 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
          <Chip
            label={project.category}
            sx={{
              bgcolor: 'rgba(16, 185, 129, 0.1)',
              color: 'primary.main',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontWeight: 600,
            }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'var(--font-mono)' }}>
            Tahun {project.year}
          </Typography>
        </Stack>

        <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3.5rem' }, mb: 2.5 }}>
          {project.title}
        </Typography>

        <Typography variant="h3" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.6, fontSize: '1.2rem' }}>
          {project.summary}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 6, flexWrap: 'wrap', gap: 1.5 }}>
        {project.liveUrl && (
          <Button
            component="a"
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            startIcon={<LaunchIcon />}
            sx={{ px: 3 }}
          >
            Buka Live Demo
          </Button>
        )}
        {project.repoUrl && (
          <Button
            component="a"
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            startIcon={<GitHubIcon />}
            sx={{ px: 3 }}
          >
            Source Code
          </Button>
        )}
      </Stack>

      <Divider sx={{ mb: 6, borderColor: 'var(--border-card)' }} />

      {/* Preview Utama Aplikasi / Website (jika thumbnail tersedia) */}
      {project.thumbnail && (
        <Paper
          elevation={0}
          sx={{
            mb: 6,
            borderRadius: '18px',
            overflow: 'hidden',
            bgcolor: 'var(--surface-card)',
            border: '1px solid var(--border-card)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.25,
              bgcolor: 'var(--surface-elevated)',
              borderBottom: '1px solid var(--border-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Stack direction="row" spacing={0.8} sx={{ alignItems: 'center' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#EF4444' }} />
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#F59E0B' }} />
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10B981' }} />
            </Stack>
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
              }}
            >
              {`preview // ${project.slug}`}
            </Typography>
          </Box>
          <Box
            component="img"
            src={project.thumbnail}
            alt={project.title}
            sx={{
              width: '100%',
              maxHeight: 520,
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
            }}
          />
        </Paper>
      )}

      {/* Solusi & Pendekatan Teknis (PRD FR-03) */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: 1.2 }}>
          STUDI KASUS & REKAYASA SISTEM
        </Typography>
        <Typography variant="h2" sx={{ fontSize: '1.75rem', mt: 0.5, mb: 2.5 }}>
          Detail Masalah & Solusi
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, md: 4.5 },
            bgcolor: 'var(--surface-card)',
            border: '1px solid var(--border-card)',
            borderRadius: 3,
            mb: 4,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.85,
              fontSize: '1.05rem',
              whiteSpace: 'pre-line',
            }}
          >
            {project.description}
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'var(--surface-elevated)',
                border: '1px solid var(--border-card)',
                borderRadius: 2.5,
                height: '100%',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <LayersIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Peran & Tanggung Jawab
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Fullstack Engineering mencakup perancangan skema database, implementasi API server-side,
                dan pembuatan komponen antarmuka yang responsif serta aksesibel.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'var(--surface-elevated)',
                border: '1px solid var(--border-card)',
                borderRadius: 2.5,
                height: '100%',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <CheckCircleOutlinedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Hasil & Dampak Solusi
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Sistem dirancang untuk efisiensi beban server, rendering cepat dengan Next.js App Router,
                dan integritas data terjamin melalui Prisma ORM.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Screenshots (if available) */}
      {project.screenshots && project.screenshots.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: 1.2 }}>
            GALERI TAMPILAN
          </Typography>
          <Typography variant="h2" sx={{ fontSize: '1.75rem', mt: 0.5, mb: 2.5 }}>
            Tangkapan Layar Sistem
          </Typography>
          <Grid container spacing={3}>
            {project.screenshots.map((shot) => (
              <Grid key={shot.id} size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    overflow: 'hidden',
                    borderRadius: 2.5,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <Box
                    component="img"
                    src={shot.imageUrl}
                    alt={shot.caption || project.title}
                    sx={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  {shot.caption && (
                    <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                      <Typography variant="caption" color="text.secondary">
                        {shot.caption}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Teknologi yang Diterapkan */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: 1.2 }}>
          STACK TEKNOLOGI
        </Typography>
        <Typography variant="h2" sx={{ fontSize: '1.75rem', mt: 0.5, mb: 2.5 }}>
          Teknologi yang Digunakan
        </Typography>
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.5 }}>
          {project.technologies.map((tech) => (
            <Chip
              key={tech.id}
              label={tech.name}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'text.primary',
                px: 1.75,
                py: 2.25,
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            />
          ))}
        </Stack>
      </Box>
    </>
  );
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
      <Link href="/projects" style={{ textDecoration: 'none' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 4, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
        >
          Kembali ke Daftar Projects
        </Button>
      </Link>

      <Suspense fallback={<Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />}>
        <ProjectDetailContent slugPromise={params} />
      </Suspense>
    </Container>
  );
}

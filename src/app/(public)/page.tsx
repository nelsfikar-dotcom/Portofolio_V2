import React, { Suspense } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid,
  IconButton,
  Skeleton,
} from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CodeIcon from '@mui/icons-material/Code';
import { prisma } from '@/lib/prisma';
import { ContentStatus } from '@prisma/client';
import MotionFadeUp from '@/components/public/MotionFadeUp';
import HeroDeveloperVisual, { TypewriterRole } from '@/components/public/HeroDeveloperVisual';
import StatCardsStrip from '@/components/public/StatCardsStrip';
import CodingActivity from '@/components/public/CodingActivity';
import ProjectCard from '@/components/public/ProjectCard';

const heroSocialLinks = [
  {
    label: 'GitHub (@NelsFikar)',
    href: 'https://github.com/nelsfikar-dotcom',
    icon: <GitHubIcon sx={{ fontSize: 19 }} />,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/dzulfkar._',
    icon: <InstagramIcon sx={{ fontSize: 19 }} />,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/dzulfikar-tadah-b52619426',
    icon: <LinkedInIcon sx={{ fontSize: 19 }} />,
  },
  {
    label: 'Email / Gmail',
    href: 'mailto:dzullfkar.t@gmail.com',
    icon: <EmailOutlinedIcon sx={{ fontSize: 19 }} />,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/6285705291761',
    icon: <WhatsAppIcon sx={{ fontSize: 19 }} />,
  },
];

async function FeaturedProjectsList() {
  const featuredProjects = await prisma.project.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
    },
    take: 4,
    include: {
      technologies: true,
    },
    orderBy: {
      year: 'desc',
    },
  });

  if (featuredProjects.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
        }}
      >
        <Typography color="text.secondary">Belum ada proyek yang ditampilkan.</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3.5}>
      {featuredProjects.map((project, idx) => (
        <Grid key={project.id} size={{ xs: 12, md: 6 }}>
          <ProjectCard project={project} index={idx} />
        </Grid>
      ))}
    </Grid>
  );
}

function FeaturedProjectsFallback() {
  return (
    <Grid container spacing={3.5}>
      {[1, 2].map((i) => (
        <Grid key={i} size={{ xs: 12, md: 6 }}>
          <Skeleton
            variant="rectangular"
            height={380}
            sx={{ borderRadius: 4, bgcolor: 'background.paper' }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      {/* 1. ASYMMETRIC ARCHITECTURAL HERO SECTION (Text Left, Interactive Spec Right) */}
      <MotionFadeUp duration={0.6}>
        <Box sx={{ mb: { xs: 7, md: 10 } }}>
          <Grid container spacing={{ xs: 5, md: 6 }} sx={{ alignItems: 'center' }}>
            {/* Left Column: Identity, Typewriter, Bio, 5 Social Channels, CTAs */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2.75}>
                {/* Status Pill */}
                <Box>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.75,
                      py: 0.6,
                      borderRadius: '8px',
                      bgcolor: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.28)',
                    }}
                  >
                    <Box
                      className="pulse-indicator"
                      sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#10B981' }}
                    />
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#34D399',
                        letterSpacing: '0.06em',
                      }}
                    >
                      AVAILABLE FOR FULL-STACK & ENGINEERING PROJECTS
                    </Typography>
                  </Box>
                </Box>

                {/* Main Heading + Typewriter */}
                <Box>
                  <Typography
                    sx={{
                      color: 'var(--text-muted)',
                      fontSize: '0.96rem',
                      fontWeight: 600,
                      mb: 0.5,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                  >
                    Halo, saya{' '}
                    <Box
                      component="span"
                      className="wave-hand"
                      role="img"
                      aria-label="Waving hand"
                      sx={{ fontSize: '1.15rem', lineHeight: 1 }}
                    >
                      👋
                    </Box>
                  </Typography>
                  <Typography
                    variant="h1"
                    className="gradient-text"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', sm: '3.25rem', md: '3.75rem' },
                      lineHeight: 1.06,
                      letterSpacing: '-0.035em',
                      mb: 1.25,
                    }}
                  >
                    Dzulfikar Tadah
                  </Typography>

                  <TypewriterRole />
                </Box>

                {/* Distinct Engineering Bio */}
                <Typography
                  variant="body1"
                  sx={{
                    color: 'var(--text-muted)',
                    fontSize: { xs: '0.96rem', md: '1.04rem' },
                    lineHeight: 1.85,
                    maxWidth: 580,
                  }}
                >
                  Merancang dan membangun sistem aplikasi web end-to-end dengan fokus pada{' '}
                  <Box component="span" sx={{ color: 'var(--text-main)', fontWeight: 700 }}>
                    arsitektur modular
                  </Box>
                  , tipe data ketat dengan{' '}
                  <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    TypeScript & Next.js
                  </Box>
                  , serta manajemen basis data relasional{' '}
                  <Box component="span" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                    PostgreSQL & Prisma
                  </Box>{' '}
                  yang siap tumbuh di lingkungan produksi.
                </Typography>

                {/* 5 Direct Social Channels: GitHub, Instagram, LinkedIn, Email/Gmail, WhatsApp */}
                <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', pt: 0.5 }}>
                  {heroSocialLinks.map((social) => (
                    <IconButton
                      key={social.label}
                      component="a"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '10px',
                        bgcolor: 'var(--surface-card)',
                        border: '1px solid var(--border-card)',
                        color: 'var(--text-muted)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          color: 'primary.main',
                          bgcolor: 'rgba(16, 185, 129, 0.12)',
                          borderColor: 'rgba(16, 185, 129, 0.45)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Stack>

                {/* Action Buttons */}
                <Stack direction="row" spacing={1.75} sx={{ pt: 1, flexWrap: 'wrap', gap: 1.5 }}>
                  <Link href="/projects" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowOutwardIcon sx={{ fontSize: 17 }} />}
                      sx={{ px: 3.25, py: 1.3 }}
                    >
                      Lihat Karya Proyek
                    </Button>
                  </Link>
                  <Link href="/contact" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" size="large" sx={{ px: 3.25, py: 1.3 }}>
                      Diskusi & Kontak
                    </Button>
                  </Link>
                </Stack>
              </Stack>
            </Grid>

            {/* Right Column: Interactive Code & Architecture Spec Terminal */}
            <Grid size={{ xs: 12, md: 5 }}>
              <HeroDeveloperVisual />
            </Grid>
          </Grid>
        </Box>
      </MotionFadeUp>

      {/* 2. BENTO TELEMETRY STRIP */}
      <MotionFadeUp delay={0.1}>
        <Box sx={{ mb: { xs: 8, md: 11 } }}>
          <StatCardsStrip />
        </Box>
      </MotionFadeUp>

      {/* 3. FEATURED PROJECTS SECTION */}
      <MotionFadeUp delay={0.14}>
        <Box sx={{ mb: { xs: 9, md: 12 } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-end' }, mb: 4.5 }}
          >
            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                <CodeIcon sx={{ fontSize: 16, color: '#10B981' }} />
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#10B981',
                    letterSpacing: '0.1em',
                  }}
                >
                  {'01 // SELECTED DEPLOYMENTS'}
                </Typography>
              </Stack>
              <Typography variant="h2" className="gradient-text" sx={{ fontWeight: 800 }}>
                Proyek & Studi Kasus Pilihan
              </Typography>
            </Box>

            <Link href="/projects" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                size="small"
                endIcon={<ArrowOutwardIcon sx={{ fontSize: 15 }} />}
              >
                Arsip Lengkap Proyek
              </Button>
            </Link>
          </Stack>

          <Suspense fallback={<FeaturedProjectsFallback />}>
            <FeaturedProjectsList />
          </Suspense>
        </Box>
      </MotionFadeUp>

      {/* 4. LIVE GITHUB CODING ACTIVITY */}
      <MotionFadeUp delay={0.18}>
        <Box sx={{ mb: 6 }}>
          <CodingActivity
            showLearnMoreButton={true}
            title="GitHub Contribution History"
          />
        </Box>
      </MotionFadeUp>
    </Container>
  );
}

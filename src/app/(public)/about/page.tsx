import React, { Suspense } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Skeleton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CodeIcon from '@mui/icons-material/Code';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import { prisma } from '@/lib/prisma';
import CodingActivity from '@/components/public/CodingActivity';
import StatCardsStrip from '@/components/public/StatCardsStrip';
import InteractiveProfileCard from '@/components/public/InteractiveProfileCard';

const SPECIALIZATIONS = [
  {
    title: 'Full-Stack Web Engineering',
    description:
      'Merancang dan membangun aplikasi web end-to-end dengan arsitektur modular, tipe data ketat (TypeScript), serta performa SSR/RSC yang optimal.',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.28)',
    icon: <CodeIcon sx={{ fontSize: 24, color: '#10B981' }} />,
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'Node.js'],
  },
  {
    title: 'Backend & Relational Data',
    description:
      'Membangun REST API, sistem autentikasi aman, pemodelan skema database relasional PostgreSQL, serta optimasi query dengan Prisma ORM.',
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.1)',
    border: 'rgba(6, 182, 212, 0.28)',
    icon: <StorageOutlinedIcon sx={{ fontSize: 24, color: '#06B6D4' }} />,
    tags: ['PostgreSQL', 'Prisma ORM', 'REST API', 'Docker'],
  },
  {
    title: 'Interface & Design Systems',
    description:
      'Menerjemahkan kebutuhan bisnis ke dalam antarmuka pengguna yang bersih, responsif, aksesibel, dan memiliki hirarki visual yang tegas.',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.28)',
    icon: <BrushOutlinedIcon sx={{ fontSize: 24, color: '#F59E0B' }} />,
    tags: ['Tailwind CSS', 'Material UI', 'Figma', 'Responsive UI'],
  },
];

const FAQ_ITEMS = [
  {
    q: 'Layanan apa saja yang Anda tawarkan?',
    a: 'Saya melayani pembuatan aplikasi web Full-Stack (Next.js/React/Node.js), perancangan antarmuka UI/UX, pembuatan REST API & arsitektur database PostgreSQL, hingga deployment ke cloud server.',
  },
  {
    q: 'Teknologi apa yang menjadi keahlian utama Anda?',
    a: 'Fokus utama saya meliputi ekosistem TypeScript, Next.js (App Router), React, Node.js, PostgreSQL, Prisma ORM, Tailwind CSS, Material UI, serta Docker.',
  },
  {
    q: 'Bagaimana alur kerja sama untuk proyek baru?',
    a: 'Dimulai dari diskusi kebutuhan & ruang lingkup proyek, perancangan skema & antarmuka, tahap development bertahap dengan update berkala, pengujian (QA), hingga deployment dan serah terima.',
  },
  {
    q: 'Apakah Anda terbuka untuk peluang kerja full-time atau proyek freelance?',
    a: 'Ya! Saat ini saya terbuka untuk kolaborasi proyek freelance, kontrak teknis, maupun posisi Full-Stack Software Engineer (Remote / Hybrid).',
  },
];

async function AboutContent() {
  const profile = await prisma.profile.findFirst();
  const fullName = profile?.fullName || 'Dzulfikar Tadah';
  const role = profile?.role || 'Full-Stack Software Engineer';
  const email = profile?.emailPublic || 'dzullfkar.t@gmail.com';
  const githubUrl = profile?.githubUrl || 'https://github.com/nelsfikar-dotcom';
  const linkedinUrl = profile?.linkedinUrl || 'https://www.linkedin.com/in/dzulfikar-tadah-b52619426/';

  // Hanya 5 channel sesuai permintaan: GitHub, Instagram, LinkedIn, Email/Gmail, dan WhatsApp
  const connectChannels = [
    {
      name: 'GitHub',
      handle: '@nelsfikar-dotcom',
      desc: 'Repositori kode sumber, proyek open-source & histori commit',
      color: 'var(--text-main)',
      bg: 'var(--surface-subtle)',
      border: 'var(--border-card)',
      href: githubUrl,
      icon: <GitHubIcon sx={{ fontSize: 24, color: 'var(--text-main)' }} />,
    },
    {
      name: 'Instagram',
      handle: '@dzulfkar._',
      desc: 'Update keseharian, dokumentasi kreatif & jejaring sosial',
      color: '#F472B6',
      bg: 'rgba(244, 114, 182, 0.12)',
      border: 'rgba(244, 114, 182, 0.28)',
      href: 'https://www.instagram.com/dzulfkar._',
      icon: <InstagramIcon sx={{ fontSize: 24, color: '#F472B6' }} />,
    },
    {
      name: 'LinkedIn',
      handle: fullName,
      desc: 'Koneksi profesional, rekam jejak karier & kolaborasi industri',
      color: '#38BDF8',
      bg: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.28)',
      href: linkedinUrl,
      icon: <LinkedInIcon sx={{ fontSize: 24, color: '#38BDF8' }} />,
    },
    {
      name: 'Email / Gmail',
      handle: email,
      desc: 'Korespondensi resmi, diskusi penawaran proyek & dokumen kerja',
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.28)',
      href: `mailto:${email}`,
      icon: <EmailOutlinedIcon sx={{ fontSize: 24, color: '#F59E0B' }} />,
    },
    {
      name: 'WhatsApp (WA)',
      handle: 'Fast Response Chat',
      desc: 'Diskusi cepat, konsultasi langsung & koordinasi proyek real-time',
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.3)',
      href: 'https://wa.me/6285705291761',
      icon: <WhatsAppIcon sx={{ fontSize: 24, color: '#10B981' }} />,
    },
  ];

  return (
    <Stack spacing={{ xs: 7, md: 9 }}>
      {/* 1. PROFILE NARRATIVE & IDENTITY HEADER */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3.5, md: 5 },
          borderRadius: '20px',
          bgcolor: 'var(--surface-card)',
          border: '1px solid var(--border-card)',
          backgroundImage:
            'radial-gradient(ellipse 60% 80% at 100% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 65%)',
        }}
      >
        <Grid container spacing={5} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'primary.main',
                    letterSpacing: '0.1em',
                    mb: 1,
                  }}
                >
                  {'01 // ENGINEER DOSSIER'}
                </Typography>
                <Typography
                  variant="h1"
                  sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.75rem' }, mb: 0.75 }}
                >
                  Halo, Saya{' '}
                  <Box component="span" className="gradient-text">
                    {fullName}
                  </Box>
                </Typography>
                <Typography sx={{ color: 'secondary.main', fontWeight: 600, fontSize: '1.05rem' }}>
                  {role}
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: 'var(--text-muted)',
                  lineHeight: 1.85,
                  fontSize: '0.98rem',
                  whiteSpace: 'pre-line',
                }}
              >
                {profile?.biography ||
                  'Saya adalah seorang Full-Stack Developer yang berfokus pada pengembangan aplikasi web modern dari sisi antarmuka pengguna hingga arsitektur backend dan basis data. Saya menyukai penulisan kode yang bersih, terstruktur, dan mudah dipelihara untuk jangka panjang.'}
              </Typography>

              <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.25, pt: 0.5 }}>
                {[
                  `📍 ${profile?.location || 'Indonesia'}`,
                  '💻 Full-Stack Web Engineer',
                  '⚡ Next.js & TypeScript',
                  '🗄️ PostgreSQL & Prisma',
                ].map((badge) => (
                  <Chip
                    key={badge}
                    label={badge}
                    sx={{
                      bgcolor: 'var(--surface-elevated)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-card)',
                      fontWeight: 600,
                      fontSize: '0.78rem',
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Right Interactive Profile Photo Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <InteractiveProfileCard
              fullName={fullName}
              handle="@NelsFikar"
              location={profile?.location || 'Indonesia'}
              avatarUrl={profile?.avatarUrl}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 2. LIVE GITHUB CODING ACTIVITY */}
      <CodingActivity
        showLearnMoreButton={false}
        title="GitHub Contribution Activity"
      />

      {/* 3. FOKUS & SPESIALISASI TEKNIS */}
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#10B981',
              letterSpacing: '0.1em',
              mb: 0.5,
            }}
          >
            {'02 // CORE CAPABILITIES'}
          </Typography>
          <Typography variant="h2" className="gradient-text" sx={{ fontWeight: 800 }}>
            Keahlian & Spesialisasi
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {SPECIALIZATIONS.map((spec) => (
            <Grid key={spec.title} size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  height: '100%',
                  borderRadius: '18px',
                  bgcolor: 'var(--surface-card)',
                  border: '1px solid var(--border-card)',
                  transition: 'all 0.22s ease',
                  '&:hover': {
                    borderColor: spec.border,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    bgcolor: spec.bg,
                    border: `1px solid ${spec.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                  }}
                >
                  {spec.icon}
                </Box>

                <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', mb: 1.25 }}>
                  {spec.title}
                </Typography>

                <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.75, mb: 2.5 }}>
                  {spec.description}
                </Typography>

                <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                  {spec.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        bgcolor: 'var(--surface-elevated)',
                        color: spec.color,
                        border: `1px solid ${spec.border}`,
                      }}
                    />
                  ))}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 4. CONNECT WITH ME (HANYA 5 PLATFORM: GitHub, Instagram, LinkedIn, Email/Gmail, WhatsApp) */}
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#06B6D4',
              letterSpacing: '0.1em',
              mb: 0.5,
            }}
          >
            {'03 // DIRECT CHANNELS'}
          </Typography>
          <Typography variant="h2" className="gradient-text" sx={{ fontWeight: 800, mb: 0.75 }}>
            Connect With Me
          </Typography>
          <Typography sx={{ color: '#94A3B8', fontSize: '0.92rem' }}>
            Hubungi saya secara langsung melalui 5 kanal resmi di bawah ini:
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {connectChannels.map((channel, index) => (
            <Grid
              key={channel.name}
              size={{ xs: 12, sm: 6, md: index < 2 ? 6 : 4 }}
            >
              <Paper
                component="a"
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: '18px',
                  bgcolor: 'var(--surface-card)',
                  border: '1px solid var(--border-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  transition: 'all 0.22s ease',
                  '&:hover': {
                    borderColor: channel.border,
                    transform: 'translateY(-4px)',
                    boxShadow: `0 16px 35px rgba(0, 0, 0, 0.15), 0 0 20px ${channel.bg}`,
                  },
                }}
              >
                <Box>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: channel.bg,
                        border: `1px solid ${channel.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {channel.icon}
                    </Box>
                    <ArrowOutwardIcon sx={{ fontSize: 18, color: 'var(--text-muted)' }} />
                  </Stack>

                  <Typography sx={{ fontWeight: 800, fontSize: '1.08rem', color: 'var(--text-main)', mb: 0.3 }}>
                    {channel.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.76rem',
                      color: channel.color,
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {channel.handle}
                  </Typography>
                </Box>

                <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {channel.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 5. PERTANYAAN UMUM (FAQ Accordion) */}
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'primary.main',
              letterSpacing: '0.1em',
              mb: 0.5,
            }}
          >
            {'04 // FAQ'}
          </Typography>
          <Typography variant="h2" className="gradient-text" sx={{ fontWeight: 800 }}>
            Pertanyaan Umum
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          {FAQ_ITEMS.map((item, idx) => (
            <Accordion
              key={item.q}
              defaultExpanded={idx === 0}
              disableGutters
              elevation={0}
              sx={{
                bgcolor: 'var(--surface-card)',
                border: '1px solid var(--border-card)',
                borderRadius: '14px !important',
                '&:before': { display: 'none' },
                overflow: 'hidden',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                sx={{ px: 3, py: 0.75 }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  {item.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 2.5, pt: 0 }}>
                <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.75 }}>
                  {item.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Box>

      {/* 6. BOTTOM TELEMETRY STRIP */}
      <StatCardsStrip />
    </Stack>
  );
}

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Suspense
        fallback={
          <Skeleton
            variant="rectangular"
            height={520}
            sx={{ borderRadius: 4, bgcolor: 'background.paper' }}
          />
        }
      >
        <AboutContent />
      </Suspense>
    </Container>
  );
}

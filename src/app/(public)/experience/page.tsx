import React, { Suspense } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Skeleton,
} from '@mui/material';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import { prisma } from '@/lib/prisma';
import CollaborationSection from '@/components/public/CollaborationSection';
import ScrollExperienceTimeline from '@/components/public/ScrollExperienceTimeline';

function formatYearPeriod(startDate: Date, endDate: Date | null, isCurrent: boolean) {
  const startYear = new Date(startDate).getFullYear();
  if (isCurrent || !endDate) return `${startYear} - Now`;
  const endYear = new Date(endDate).getFullYear();
  return startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;
}

async function ExperienceContent() {
  const [experiences, profile] = await Promise.all([
    prisma.experience.findMany({ orderBy: { startDate: 'desc' } }),
    prisma.profile.findFirst(),
  ]);

  const timelineItems = experiences.map((exp) => ({
    id: exp.id,
    title: exp.title,
    organization: exp.organization,
    periodLabel: formatYearPeriod(exp.startDate, exp.endDate, exp.isCurrent),
    description: exp.description,
    isCurrent: exp.isCurrent,
  }));

  return (
    <Stack spacing={{ xs: 8, md: 11 }}>
      {timelineItems.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            border: '1px dashed var(--border-card)',
            borderRadius: 4,
          }}
        >
          <Typography color="text.secondary">
            Belum ada riwayat pengalaman yang ditambahkan.
          </Typography>
        </Box>
      ) : (
        <ScrollExperienceTimeline items={timelineItems} />
      )}

      <CollaborationSection
        email={profile?.emailPublic || 'dzullfkar.t@gmail.com'}
        github={profile?.githubUrl || 'https://github.com/nelsfikar-dotcom'}
        linkedin={profile?.linkedinUrl || 'https://www.linkedin.com/in/dzulfikar-tadah-b52619426/'}
      />
    </Stack>
  );
}

export default function ExperiencePage() {
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
            bgcolor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          <BusinessCenterOutlinedIcon sx={{ fontSize: 15, color: '#10B981' }} />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#34D399',
              letterSpacing: '0.1em',
            }}
          >
            CAREER JOURNEY
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
          Experience & Career Timeline
        </Typography>

        <Typography
          sx={{
            color: 'var(--text-muted)',
            maxWidth: 560,
            mx: 'auto',
            fontSize: '0.96rem',
            lineHeight: 1.75,
          }}
        >
          Riwayat keterlibatan dalam peranan rekayasa perangkat lunak, perancangan arsitektur,
          dan delivery sistem produksi.
        </Typography>
      </Box>

      <Suspense
        fallback={
          <Stack spacing={3}>
            {[1, 2].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={180}
                sx={{ borderRadius: 4, bgcolor: 'background.paper' }}
              />
            ))}
          </Stack>
        }
      >
        <ExperienceContent />
      </Suspense>
    </Container>
  );
}

import React, { Suspense } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
  Skeleton,
} from '@mui/material';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import { prisma } from '@/lib/prisma';
import { SkillCategory } from '@prisma/client';
import CollaborationSection from '@/components/public/CollaborationSection';
import ScrollExperienceTimeline from '@/components/public/ScrollExperienceTimeline';

type IconType =
  | 'nextjs'
  | 'react'
  | 'typescript'
  | 'javascript'
  | 'tailwind'
  | 'mui'
  | 'nodejs'
  | 'postgresql'
  | 'mysql'
  | 'mongodb'
  | 'redis'
  | 'prisma'
  | 'docker'
  | 'git'
  | 'api'
  | 'graphql'
  | 'php'
  | 'laravel'
  | 'python'
  | 'figma'
  | 'default';

interface SkillVisualMeta {
  percent: number;
  color: string;
  iconType: IconType;
  categoryLabel: string;
  logoUrl?: string;
}

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

const SKILL_META_MAP: Record<string, SkillVisualMeta> = {
  'next.js': {
    percent: 95,
    color: '#F8FAFC',
    iconType: 'nextjs',
    categoryLabel: 'Frontend',
    logoUrl: `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
  },
  nextjs: {
    percent: 95,
    color: '#F8FAFC',
    iconType: 'nextjs',
    categoryLabel: 'Frontend',
    logoUrl: `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
  },
  react: {
    percent: 95,
    color: '#38BDF8',
    iconType: 'react',
    categoryLabel: 'Frontend',
    logoUrl: `${DEVICON_BASE}/react/react-original.svg`,
  },
  typescript: {
    percent: 92,
    color: '#3178C6',
    iconType: 'typescript',
    categoryLabel: 'Frontend',
    logoUrl: `${DEVICON_BASE}/typescript/typescript-original.svg`,
  },
  javascript: {
    percent: 94,
    color: '#F7DF1E',
    iconType: 'javascript',
    categoryLabel: 'Frontend',
    logoUrl: `${DEVICON_BASE}/javascript/javascript-original.svg`,
  },
  'tailwind css': {
    percent: 95,
    color: '#38BDF8',
    iconType: 'tailwind',
    categoryLabel: 'Frontend',
    logoUrl: `${DEVICON_BASE}/tailwindcss/tailwindcss-original.svg`,
  },
  tailwind: {
    percent: 95,
    color: '#38BDF8',
    iconType: 'tailwind',
    categoryLabel: 'Frontend',
    logoUrl: `${DEVICON_BASE}/tailwindcss/tailwindcss-original.svg`,
  },
  'material ui': {
    percent: 90,
    color: '#007FFF',
    iconType: 'mui',
    categoryLabel: 'Frontend',
    logoUrl: `${DEVICON_BASE}/materialui/materialui-original.svg`,
  },
  mui: {
    percent: 90,
    color: '#007FFF',
    iconType: 'mui',
    categoryLabel: 'Frontend',
    logoUrl: `${DEVICON_BASE}/materialui/materialui-original.svg`,
  },
  'node.js': {
    percent: 90,
    color: '#5FA04E',
    iconType: 'nodejs',
    categoryLabel: 'Backend',
    logoUrl: `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  },
  node: {
    percent: 90,
    color: '#5FA04E',
    iconType: 'nodejs',
    categoryLabel: 'Backend',
    logoUrl: `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  },
  mysql: {
    percent: 88,
    color: '#F29111',
    iconType: 'mysql',
    categoryLabel: 'Database',
    logoUrl: `${DEVICON_BASE}/mysql/mysql-original.svg`,
  },
  postgresql: {
    percent: 88,
    color: '#336791',
    iconType: 'postgresql',
    categoryLabel: 'Database',
    logoUrl: `${DEVICON_BASE}/postgresql/postgresql-original.svg`,
  },
  postgres: {
    percent: 88,
    color: '#336791',
    iconType: 'postgresql',
    categoryLabel: 'Database',
    logoUrl: `${DEVICON_BASE}/postgresql/postgresql-original.svg`,
  },
  mongodb: {
    percent: 86,
    color: '#47A248',
    iconType: 'mongodb',
    categoryLabel: 'Database',
    logoUrl: `${DEVICON_BASE}/mongodb/mongodb-original.svg`,
  },
  redis: {
    percent: 85,
    color: '#DC382D',
    iconType: 'redis',
    categoryLabel: 'Database',
    logoUrl: `${DEVICON_BASE}/redis/redis-original.svg`,
  },
  sql: {
    percent: 88,
    color: '#336791',
    iconType: 'postgresql',
    categoryLabel: 'Database',
    logoUrl: `${DEVICON_BASE}/postgresql/postgresql-original.svg`,
  },
  'prisma orm': {
    percent: 92,
    color: '#14B8A6',
    iconType: 'prisma',
    categoryLabel: 'Database',
    logoUrl: `${DEVICON_BASE}/prisma/prisma-original.svg`,
  },
  prisma: {
    percent: 92,
    color: '#14B8A6',
    iconType: 'prisma',
    categoryLabel: 'Database',
    logoUrl: `${DEVICON_BASE}/prisma/prisma-original.svg`,
  },
  docker: {
    percent: 85,
    color: '#2496ED',
    iconType: 'docker',
    categoryLabel: 'DevOps',
    logoUrl: `${DEVICON_BASE}/docker/docker-original.svg`,
  },
  git: {
    percent: 93,
    color: '#F05032',
    iconType: 'git',
    categoryLabel: 'DevOps',
    logoUrl: `${DEVICON_BASE}/git/git-original.svg`,
  },
  'rest api': {
    percent: 92,
    color: '#FF6C37',
    iconType: 'api',
    categoryLabel: 'Backend',
    logoUrl: `${DEVICON_BASE}/postman/postman-original.svg`,
  },
  api: {
    percent: 92,
    color: '#FF6C37',
    iconType: 'api',
    categoryLabel: 'Backend',
    logoUrl: `${DEVICON_BASE}/postman/postman-original.svg`,
  },
  graphql: {
    percent: 84,
    color: '#E10098',
    iconType: 'graphql',
    categoryLabel: 'Backend',
    logoUrl: `${DEVICON_BASE}/graphql/graphql-plain.svg`,
  },
  php: {
    percent: 85,
    color: '#777BB4',
    iconType: 'php',
    categoryLabel: 'Backend',
    logoUrl: `${DEVICON_BASE}/php/php-original.svg`,
  },
  laravel: {
    percent: 86,
    color: '#FF2D20',
    iconType: 'laravel',
    categoryLabel: 'Backend',
    logoUrl: `${DEVICON_BASE}/laravel/laravel-original.svg`,
  },
  python: {
    percent: 85,
    color: '#3776AB',
    iconType: 'python',
    categoryLabel: 'Backend',
    logoUrl: `${DEVICON_BASE}/python/python-original.svg`,
  },
  figma: {
    percent: 88,
    color: '#F24E1E',
    iconType: 'figma',
    categoryLabel: 'UI/UX',
    logoUrl: `${DEVICON_BASE}/figma/figma-original.svg`,
  },
};

const CATEGORY_FALLBACK: Record<
  SkillCategory,
  { color: string; label: string; iconType: IconType; logoUrl: string }
> = {
  FRONTEND: {
    color: '#38BDF8',
    label: 'Frontend',
    iconType: 'react',
    logoUrl: `${DEVICON_BASE}/react/react-original.svg`,
  },
  BACKEND: {
    color: '#5FA04E',
    label: 'Backend',
    iconType: 'nodejs',
    logoUrl: `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  },
  DATABASE: {
    color: '#336791',
    label: 'Database',
    iconType: 'postgresql',
    logoUrl: `${DEVICON_BASE}/postgresql/postgresql-original.svg`,
  },
  TOOLS: {
    color: '#F05032',
    label: 'DevOps',
    iconType: 'git',
    logoUrl: `${DEVICON_BASE}/git/git-original.svg`,
  },
  OTHER: {
    color: '#10B981',
    label: 'Engineering',
    iconType: 'default',
    logoUrl: `${DEVICON_BASE}/devicon/devicon-original.svg`,
  },
};

function getSkillMeta(name: string, category: SkillCategory, index: number): SkillVisualMeta {
  const key = name.toLowerCase().trim();
  for (const [k, v] of Object.entries(SKILL_META_MAP)) {
    if (key.includes(k)) return v;
  }
  const fb = CATEGORY_FALLBACK[category] || CATEGORY_FALLBACK.OTHER;
  const fallbackPercents = [92, 88, 90, 86, 94, 89, 91, 87];
  return {
    percent: fallbackPercents[index % fallbackPercents.length],
    color: fb.color,
    iconType: fb.iconType,
    categoryLabel: fb.label,
    logoUrl: fb.logoUrl,
  };
}

function TechBrandIcon({
  iconType,
  color,
  logoUrl,
  name,
}: {
  iconType: IconType;
  color: string;
  logoUrl?: string;
  name: string;
}) {
  // Prisma's official SVG is dark slate (#2D3748); render crisp bright teal/white prism on dark badge
  if (iconType === 'prisma') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M19.8 16.5 13.2 3.1a1.1 1.1 0 0 0-1.95-.08L4.2 14.8a1.1 1.1 0 0 0 .35 1.48l5.8 3.9a1.5 1.5 0 0 0 1.38.17l7.32-2.38a1.1 1.1 0 0 0 .75-1.47Zm-8.2 1.85L13 5.9l4.9 10.1-6.3 2.35Z"
          fill={color}
        />
      </svg>
    );
  }

  if (logoUrl) {
    return (
      <Box
        component="img"
        src={logoUrl}
        alt={name}
        loading="lazy"
        sx={{
          width: 28,
          height: 28,
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35))',
        }}
      />
    );
  }

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-10-4 12"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CircularSkillCard({
  name,
  percent,
  color,
  iconType,
  categoryLabel,
  logoUrl,
}: {
  name: string;
  percent: number;
  color: string;
  iconType: IconType;
  categoryLabel: string;
  logoUrl?: string;
}) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.75,
        borderRadius: '20px',
        bgcolor: 'var(--surface-card)',
        border: '1px solid var(--border-card)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          borderColor: `${color}66`,
          transform: 'translateY(-4px)',
          boxShadow: `0 14px 30px rgba(0, 0, 0, 0.18)`,
          '& .skill-icon-badge': {
            transform: 'scale(1.1) translateY(-2px)',
            borderColor: `${color}88`,
          },
        },
      }}
    >
      {/* SVG Circular Progress Ring */}
      <Box
        sx={{
          position: 'relative',
          width: 86,
          height: 86,
          mb: 1.75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="86" height="86" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Track */}
          <circle
            cx="43"
            cy="43"
            r={radius}
            fill="transparent"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="6"
          />
          {/* Value Ring */}
          <circle
            cx="43"
            cy="43"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Vector Icon Badge */}
        <Box
          className="skill-icon-badge"
          sx={{
            position: 'absolute',
            width: 52,
            height: 52,
            borderRadius: '50%',
            bgcolor: '#0F172A',
            border: `1px solid ${color}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s ease',
          }}
        >
          <TechBrandIcon iconType={iconType} color={color} logoUrl={logoUrl} name={name} />
        </Box>
      </Box>

      {/* Skill Name & Percentage */}
      <Box sx={{ mb: 1.5 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '0.95rem',
            color: 'var(--text-main)',
            mb: 0.4,
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            fontSize: '0.82rem',
            color: color === '#F8FAFC' ? 'var(--text-main)' : color,
          }}
        >
          {percent}%
        </Typography>
      </Box>

      {/* Category Pill */}
      <Chip
        label={categoryLabel}
        size="small"
        sx={{
          height: 22,
          fontSize: '0.68rem',
          fontWeight: 600,
          bgcolor: 'var(--surface-elevated)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border-card)',
        }}
      />
    </Paper>
  );
}

function formatYearPeriod(startDate: Date, endDate: Date | null, current: boolean) {
  const startYear = new Date(startDate).getFullYear();
  if (current || !endDate) return `${startYear} - Now`;
  const endYear = new Date(endDate).getFullYear();
  return startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;
}

async function SkillsAndExperienceContent() {
  const [allSkills, experiences, profile] = await Promise.all([
    prisma.skill.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.experience.findMany({ orderBy: { startDate: 'desc' } }),
    prisma.profile.findFirst(),
  ]);

  return (
    <Stack spacing={{ xs: 9, md: 12 }}>
      {/* 1. SKILLS & EXPERTISE CIRCULAR RING GRID */}
      <Box>
        <Grid container spacing={2.5}>
          {allSkills.map((skill, idx) => {
            const meta = getSkillMeta(skill.name, skill.category, idx);
            return (
              <Grid key={skill.id} size={{ xs: 6, sm: 4, md: 2.4 }}>
                <CircularSkillCard
                  name={skill.name}
                  percent={meta.percent}
                  color={meta.color}
                  iconType={meta.iconType}
                  categoryLabel={meta.categoryLabel}
                  logoUrl={meta.logoUrl}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* 2. EXPERIENCE TIMELINE SECTION */}
      <Box>
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
            variant="h2"
            className="gradient-text"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.65rem' },
              mb: 1,
            }}
          >
            Experience
          </Typography>
          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.94rem' }}>
            Rekam jejak karier dan kontribusi profesional dalam pengembangan perangkat lunak
          </Typography>
        </Box>

        <ScrollExperienceTimeline
          items={experiences.map((exp) => ({
            id: exp.id,
            title: exp.title,
            organization: exp.organization,
            periodLabel: formatYearPeriod(exp.startDate, exp.endDate, exp.isCurrent),
            description: exp.description,
            isCurrent: exp.isCurrent,
          }))}
        />
      </Box>

      {/* 3. AJUKAN KERJA SAMA (COLLABORATION SECTION) */}
      <CollaborationSection
        email={profile?.emailPublic || 'dzullfkar.t@gmail.com'}
        github={profile?.githubUrl || 'https://github.com/nelsfikar-dotcom'}
        linkedin={profile?.linkedinUrl || 'https://www.linkedin.com/in/dzulfikar-tadah-b52619426/'}
      />
    </Stack>
  );
}

export default function SkillsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      {/* Top Header */}
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
          <BuildOutlinedIcon sx={{ fontSize: 15, color: '#10B981' }} />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#34D399',
              letterSpacing: '0.1em',
            }}
          >
            SKILLS & SERVICES
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
          Skills & Expertise
        </Typography>

        <Typography
          sx={{
            color: '#94A3B8',
            maxWidth: 560,
            mx: 'auto',
            fontSize: '0.96rem',
            lineHeight: 1.75,
          }}
        >
          Teknologi dan keahlian yang saya kuasai untuk membangun solusi digital terbaik
        </Typography>
      </Box>

      <Suspense
        fallback={
          <Grid container spacing={2.5}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <Grid key={i} size={{ xs: 6, sm: 4, md: 2.4 }}>
                <Skeleton
                  variant="rectangular"
                  height={210}
                  sx={{ borderRadius: 4, bgcolor: 'background.paper' }}
                />
              </Grid>
            ))}
          </Grid>
        }
      >
        <SkillsAndExperienceContent />
      </Suspense>
    </Container>
  );
}

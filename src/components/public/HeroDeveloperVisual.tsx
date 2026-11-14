'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Paper, Chip } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';

const ROLES = [
  'Full-Stack Software Engineer',
  'Next.js & TypeScript Architect',
  'Backend & Database Engineer',
  'Modern UI/UX Craftsman',
];

export function TypewriterRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = ROLES[roleIndex];
    const speed = isDeleting ? 35 : 75;

    const timer = setTimeout(() => {
      if (!isDeleting && displayed.length < currentWord.length) {
        setDisplayed(currentWord.slice(0, displayed.length + 1));
      } else if (!isDeleting && displayed.length === currentWord.length) {
        setTimeout(() => setIsDeleting(true), 1600);
      } else if (isDeleting && displayed.length > 0) {
        setDisplayed(currentWord.slice(0, displayed.length - 1));
      } else if (isDeleting && displayed.length === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, roleIndex]);

  return (
    <Typography
      sx={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: { xs: '1.05rem', md: '1.25rem' },
        fontWeight: 700,
        color: '#10B981',
        minHeight: '1.9rem',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {'> '}
      {displayed}
      <span className="typewriter-cursor" />
    </Typography>
  );
}

function FloatingTechBadgeIcon({ id }: { id: 'nextjs' | 'ts' | 'react' | 'prisma' }) {
  const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
  if (id === 'prisma') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M19.8 16.5 13.2 3.1a1.1 1.1 0 0 0-1.95-.08L4.2 14.8a1.1 1.1 0 0 0 .35 1.48l5.8 3.9a1.5 1.5 0 0 0 1.38.17l7.32-2.38a1.1 1.1 0 0 0 .75-1.47Zm-8.2 1.85L13 5.9l4.9 10.1-6.3 2.35Z"
          fill="#34D399"
        />
      </svg>
    );
  }

  const urls: Record<'nextjs' | 'ts' | 'react', string> = {
    nextjs: `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
    ts: `${DEVICON_BASE}/typescript/typescript-original.svg`,
    react: `${DEVICON_BASE}/react/react-original.svg`,
  };

  return (
    <Box
      component="img"
      src={urls[id]}
      alt={id}
      sx={{ width: 15, height: 15, objectFit: 'contain', display: 'block' }}
    />
  );
}

const FLOATING_TECH_BADGES = [
  {
    id: 'nextjs' as const,
    label: 'Next.js',
    className: 'float-tech-1',
    hideOnMobile: false,
    sx: { top: -16, left: { xs: 14, sm: 22 } },
  },
  {
    id: 'ts' as const,
    label: 'TypeScript',
    className: 'float-tech-2',
    hideOnMobile: false,
    sx: { top: -15, right: { xs: 14, sm: 26 } },
  },
  {
    id: 'react' as const,
    label: 'React',
    className: 'float-tech-3',
    hideOnMobile: true,
    sx: { bottom: -15, left: 28 },
  },
  {
    id: 'prisma' as const,
    label: 'Prisma',
    className: 'float-tech-4',
    hideOnMobile: true,
    sx: { bottom: -15, right: 28 },
  },
];

export default function HeroDeveloperVisual() {
  const [activeTab, setActiveTab] = useState<'profile' | 'architecture' | 'runtime'>('profile');

  return (
    <Box sx={{ position: 'relative', py: 1.5 }}>
      {/* Ambient Emerald-Cyan Glow */}
      <Box
        sx={{
          position: 'absolute',
          inset: -16,
          background:
            'radial-gradient(circle at 70% 30%, rgba(16, 185, 129, 0.14) 0%, rgba(6, 182, 212, 0.07) 45%, transparent 70%)',
          filter: 'blur(24px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Floating Tech Badges around Hero Perimeter (Non-intrusive, Reduced Motion Safe) */}
      {FLOATING_TECH_BADGES.map((badge) => (
        <Box
          key={badge.id}
          className={badge.className}
          sx={{
            position: 'absolute',
            zIndex: 3,
            display: badge.hideOnMobile ? { xs: 'none', sm: 'inline-flex' } : 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.35,
            py: 0.45,
            borderRadius: '999px',
            bgcolor: 'rgba(12, 16, 25, 0.88)',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
            opacity: 0.86,
            pointerEvents: 'none',
            userSelect: 'none',
            ...badge.sx,
          }}
        >
          <FloatingTechBadgeIcon id={badge.id} />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.67rem',
              fontWeight: 600,
              color: '#CBD5E1',
              letterSpacing: '0.02em',
            }}
          >
            {badge.label}
          </Typography>
        </Box>
      ))}

      {/* Interactive Engineering Blueprint Card */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          zIndex: 1,
          borderRadius: '18px',
          bgcolor: 'rgba(12, 16, 25, 0.94)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Top Window Header with Interactive Tabs */}
        <Box
          sx={{
            px: 2,
            py: 1.25,
            bgcolor: 'rgba(22, 29, 43, 0.88)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Stack direction="row" spacing={0.8} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#EF4444' }} />
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#F59E0B' }} />
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10B981' }} />
          </Stack>

          <Stack direction="row" spacing={0.5}>
            {[
              { id: 'profile', label: 'engineer.ts', icon: <TerminalIcon sx={{ fontSize: 13 }} /> },
              {
                id: 'architecture',
                label: 'stack.config',
                icon: <HubOutlinedIcon sx={{ fontSize: 13 }} />,
              },
              {
                id: 'runtime',
                label: 'telemetry',
                icon: <SpeedOutlinedIcon sx={{ fontSize: 13 }} />,
              },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Box
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  sx={{
                    px: 1.25,
                    py: 0.4,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.6,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#10B981' : '#94A3B8',
                    bgcolor: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                    border: isActive
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : '1px solid transparent',
                    transition: 'all 0.15s ease',
                    '&:hover': { color: '#F8FAFC' },
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Interactive Body Content */}
        <Box sx={{ p: { xs: 2.5, md: 3 }, minHeight: 290 }}>
          {activeTab === 'profile' && (
            <Box sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: 1.85 }}>
              <Typography sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: '#64748B' }}>
                {'// Live Engineer Specification'}
              </Typography>
              <Typography sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: '#22D3EE' }}>
                export const{' '}
                <Box component="span" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
                  dzulfikar
                </Box>{' '}
                = {'{'}
              </Typography>
              <Box sx={{ pl: 2.5 }}>
                <Typography sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: '#CBD5E1' }}>
                  handle:{' '}
                  <Box component="span" sx={{ color: '#34D399' }}>
                    &apos;@NelsFikar&apos;
                  </Box>
                  ,
                </Typography>
                <Typography sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: '#CBD5E1' }}>
                  focus:{' '}
                  <Box component="span" sx={{ color: '#FBBF24' }}>
                    [&apos;Full-Stack Web&apos;, &apos;System Architecture&apos;, &apos;UI/UX&apos;]
                  </Box>
                  ,
                </Typography>
                <Typography sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: '#CBD5E1' }}>
                  coreStack:{' '}
                  <Box component="span" sx={{ color: '#38BDF8' }}>
                    [&apos;Next.js 16&apos;, &apos;TypeScript&apos;, &apos;PostgreSQL&apos;, &apos;Prisma&apos;]
                  </Box>
                  ,
                </Typography>
                <Typography sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: '#CBD5E1' }}>
                  principles:{' '}
                  <Box component="span" sx={{ color: '#34D399' }}>
                    &apos;Clean Code &bull; Type Safety &bull; High Performance&apos;
                  </Box>
                  ,
                </Typography>
                <Typography sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: '#CBD5E1' }}>
                  availableForHire:{' '}
                  <Box component="span" sx={{ color: '#10B981', fontWeight: 700 }}>
                    true
                  </Box>
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: '#22D3EE' }}>
                {'};'}
              </Typography>

              {/* Bottom Mini Stack Matrix */}
              <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 2.5 }}>
                {['Next.js App Router', 'React 19', 'TypeScript 5', 'Prisma ORM', 'Docker'].map(
                  (item) => (
                    <Chip
                      key={item}
                      label={item}
                      size="small"
                      sx={{
                        height: 24,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        bgcolor: 'rgba(16, 185, 129, 0.08)',
                        color: '#6EE7B7',
                        border: '1px solid rgba(16, 185, 129, 0.22)',
                      }}
                    />
                  )
                )}
              </Stack>
            </Box>
          )}

          {activeTab === 'architecture' && (
            <Stack spacing={1.5}>
              {[
                {
                  layer: '01 / PRESENTATION LAYER',
                  tech: 'Next.js 16 • React 19 • Tailwind v4 • MUI v9',
                  color: '#10B981',
                },
                {
                  layer: '02 / APPLICATION & API',
                  tech: 'Server Actions • REST API • Strict Zod/TS Contracts',
                  color: '#06B6D4',
                },
                {
                  layer: '03 / DATA & INFRASTRUCTURE',
                  tech: 'PostgreSQL • Prisma ORM • Docker • Linux CI/CD',
                  color: '#F59E0B',
                },
              ].map((row) => (
                <Box
                  key={row.layer}
                  sx={{
                    p: 1.75,
                    borderRadius: '10px',
                    bgcolor: 'rgba(255, 255, 255, 0.025)',
                    borderLeft: `3px solid ${row.color}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: row.color,
                      mb: 0.3,
                    }}
                  >
                    {row.layer}
                  </Typography>
                  <Typography sx={{ fontSize: '0.84rem', fontWeight: 600, color: '#F8FAFC' }}>
                    {row.tech}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}

          {activeTab === 'runtime' && (
            <Stack spacing={2}>
              {[
                { label: 'Type Safety & Schema Contracts', val: '100%', color: '#10B981' },
                { label: 'Core Web Vitals / Performance', val: '99 / 100', color: '#06B6D4' },
                { label: 'Clean Modular Architecture', val: 'Production Ready', color: '#F59E0B' },
              ].map((metric) => (
                <Box
                  key={metric.label}
                  sx={{
                    p: 1.75,
                    borderRadius: '10px',
                    bgcolor: 'rgba(255, 255, 255, 0.025)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 18, color: metric.color }} />
                    <Typography sx={{ fontSize: '0.84rem', color: '#E2E8F0', fontWeight: 600 }}>
                      {metric.label}
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: metric.color,
                    }}
                  >
                    {metric.val}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {/* Bottom Status Bar */}
        <Box
          sx={{
            px: 2.5,
            py: 1.25,
            bgcolor: 'rgba(8, 11, 17, 0.92)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box
              className="pulse-indicator"
              sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981' }}
            />
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: '#94A3B8',
              }}
            >
              STATUS: OPEN FOR COLLABORATION
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: '#10B981',
              fontWeight: 700,
            }}
          >
            UTF-8 // TS 5.x
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

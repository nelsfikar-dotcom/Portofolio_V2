'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useInView, useReducedMotion } from 'framer-motion';

interface StatCardConfig {
  code: string;
  target: number;
  suffix: string;
  label: string;
  accent: string;
}

const statItems: StatCardConfig[] = [
  {
    code: '01 / EXPERIENCE',
    target: 4,
    suffix: '+ Thn',
    label: 'Pengembangan Web End-to-End',
    accent: '#10B981',
  },
  {
    code: '02 / TECH STACK',
    target: 12,
    suffix: '+ Tech',
    label: 'Next.js, TypeScript & PostgreSQL',
    accent: '#06B6D4',
  },
  {
    code: '03 / RELIABILITY',
    target: 99,
    suffix: '/100',
    label: 'Standar Performa & Clean Code',
    accent: '#34D399',
  },
  {
    code: '04 / COLLABORATION',
    target: 24,
    suffix: ' Jam',
    label: 'Respons Cepat & Transparan',
    accent: '#F59E0B',
  },
];

function AnimatedStatValue({
  target,
  suffix,
  active,
  reducedMotion,
}: {
  target: number;
  suffix: string;
  active: boolean;
  reducedMotion: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active || reducedMotion) return;

    let animationFrameId: number;
    const duration = 950;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [active, reducedMotion, target]);

  const displayedNumber = reducedMotion ? target : active ? count : 0;

  return (
    <>
      {displayedNumber}
      {suffix}
    </>
  );
}

export default function StatCardsStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-40px' });
  const prefersReducedMotion = Boolean(useReducedMotion());

  return (
    <Paper
      ref={containerRef}
      elevation={0}
      sx={{
        borderRadius: '18px',
        bgcolor: 'var(--surface-card)',
        border: '1px solid var(--border-card)',
        overflow: 'hidden',
      }}
    >
      <Grid container>
        {statItems.map((item, idx) => (
          <Grid
            key={item.code}
            size={{ xs: 12, sm: 6, md: 3 }}
            sx={{
              p: { xs: 2.75, md: 3.5 },
              borderRight: {
                md: idx < statItems.length - 1 ? '1px solid var(--border-card)' : 'none',
              },
              borderBottom: {
                xs: idx < statItems.length - 1 ? '1px solid var(--border-card)' : 'none',
                md: 'none',
              },
              transition: 'background-color 0.2s ease',
              '&:hover': {
                bgcolor: 'var(--surface-subtle)',
              },
            }}
          >
            <Box
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: item.accent,
                letterSpacing: '0.08em',
                mb: 1,
              }}
            >
              {item.code}
            </Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.5rem', md: '1.8rem' },
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                mb: 0.5,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <AnimatedStatValue
                target={item.target}
                suffix={item.suffix}
                active={isInView}
                reducedMotion={prefersReducedMotion}
              />
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 500 }}>
              {item.label}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

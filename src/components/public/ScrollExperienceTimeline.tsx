'use client';

import React, { useRef } from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import SpotlightCard from '@/components/public/SpotLightCard';

export interface ExperienceTimelineItem {
  id: string;
  title: string;
  organization: string;
  periodLabel: string;
  description: string;
  isCurrent?: boolean;
}

export default function ScrollExperienceTimeline({
  items,
}: {
  items: ExperienceTimelineItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 78%', 'end 62%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <Box
      ref={containerRef}
      sx={{
        maxWidth: 860,
        mx: 'auto',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Base Muted Track Line */}
      <Box
        sx={{
          position: 'absolute',
          left: { xs: 16, md: 24 },
          top: 16,
          bottom: 16,
          width: '2px',
          bgcolor: 'var(--border-card)',
          borderRadius: '999px',
        }}
      />

      {/* Scroll-Filled Emerald-Cyan Progress Line */}
      <Box
        component={motion.div}
        style={{
          scaleY: prefersReducedMotion ? 1 : smoothProgress,
          transformOrigin: 'top',
        }}
        sx={{
          position: 'absolute',
          left: { xs: 16, md: 24 },
          top: 16,
          bottom: 16,
          width: '2px',
          borderRadius: '999px',
          background: 'linear-gradient(180deg, #10B981 0%, #06B6D4 65%, #34D399 100%)',
          boxShadow: '0 0 10px rgba(16, 185, 129, 0.35)',
          zIndex: 1,
        }}
      />

      <Stack spacing={3.5}>
        {items.map((exp, index) => {
          const isLatest = index === 0 || exp.isCurrent;
          return (
            <Box
              key={exp.id}
              component={motion.div}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.42,
                delay: Math.min(index * 0.06, 0.18),
                ease: [0.16, 1, 0.3, 1],
              }}
              sx={{
                position: 'relative',
                pl: { xs: 6, md: 8 },
              }}
            >
              {/* Timeline Node Indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  left: { xs: 9, md: 17 },
                  top: 26,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: isLatest ? '#10B981' : '#06B6D4',
                  border: '3px solid var(--bg-obsidian)',
                  boxShadow: isLatest
                    ? '0 0 0 3px rgba(16, 185, 129, 0.2), 0 0 12px rgba(16, 185, 129, 0.55)'
                    : '0 0 0 3px rgba(6, 182, 212, 0.16)',
                  zIndex: 2,
                  transition: 'transform 0.22s ease',
                }}
              />

              <SpotlightCard
                sx={{
                  p: { xs: 3, md: 3.5 },
                  '&:hover': {
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Box>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.25}
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      mb: 1.5,
                    }}
                  >
                    <Chip
                      label={exp.periodLabel}
                      size="small"
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        bgcolor: 'rgba(16, 185, 129, 0.12)',
                        color: 'primary.main',
                        border: '1px solid rgba(16, 185, 129, 0.28)',
                      }}
                    />

                    {isLatest && (
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: '#10B981',
                          letterSpacing: '0.06em',
                        }}
                      >
                        ● ACTIVE ROLE
                      </Typography>
                    )}
                  </Stack>

                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: '1.15rem',
                      color: 'var(--text-main)',
                      mb: 0.4,
                    }}
                  >
                    {exp.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      color: 'secondary.main',
                      mb: 1.5,
                    }}
                  >
                    {exp.organization}
                  </Typography>

                  <Typography
                    sx={{
                      color: 'var(--text-muted)',
                      fontSize: '0.88rem',
                      lineHeight: 1.75,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {exp.description}
                  </Typography>
                </Box>
              </SpotlightCard>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

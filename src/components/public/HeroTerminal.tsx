'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';
import CodeIcon from '@mui/icons-material/Code';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const tabs = [
  { id: 'profile', name: 'architect.ts', icon: <CodeIcon sx={{ fontSize: 14 }} /> },
  { id: 'stack', name: 'runtime.json', icon: <TerminalIcon sx={{ fontSize: 14 }} /> },
  { id: 'telemetry', name: 'diagnostics.log', icon: <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} /> },
];

export default function HeroTerminal() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Box
      sx={{
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.09)',
        bgcolor: '#080B12',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono), monospace',
      }}
    >
      {/* Terminal Title Bar */}
      <Box
        sx={{
          px: 2,
          py: 1.1,
          bgcolor: 'rgba(255, 255, 255, 0.025)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={0.85} sx={{ alignItems: 'center' }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#F43F5E' }} />
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#F59E0B' }} />
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10B981' }} />
          <Typography
            variant="caption"
            sx={{
              ml: 1,
              color: '#64748B',
              fontSize: '0.7rem',
              fontFamily: 'inherit',
              display: { xs: 'none', sm: 'inline-block' },
            }}
          >
            dzulfikar@node-01:~/systems
          </Typography>
        </Stack>

        {/* Tab Switcher */}
        <Stack direction="row" spacing={0.5}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Box
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  px: 1.1,
                  py: 0.35,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  bgcolor: isActive ? 'rgba(212, 255, 0, 0.1)' : 'transparent',
                  color: isActive ? '#D4FF00' : '#64748B',
                  border: isActive ? '1px solid rgba(212, 255, 0, 0.28)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    color: '#F8FAFC',
                    bgcolor: 'rgba(255, 255, 255, 0.04)',
                  },
                }}
              >
                {tab.icon}
                <Typography sx={{ fontSize: '0.68rem', fontFamily: 'inherit', fontWeight: isActive ? 700 : 500 }}>
                  {tab.name}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* Code Display Area */}
      <Box
        sx={{
          p: { xs: 2.25, sm: 2.75 },
          minHeight: 270,
          fontSize: { xs: '0.76rem', sm: '0.8rem' },
          lineHeight: 1.75,
          color: '#E2E8F0',
          overflowX: 'auto',
        }}
      >
        {activeTab === 'profile' && (
          <Box component="pre" sx={{ m: 0, fontFamily: 'inherit' }}>
            <span style={{ color: '#475569' }}>{'// System Architect Specification'}</span>{'\n'}
            <span style={{ color: '#F43F5E' }}>export const</span> <span style={{ color: '#38BDF8' }}>engineer</span> = {'{'}{'\n'}
            {'  '}<span style={{ color: '#94A3B8' }}>identity:</span> <span style={{ color: '#D4FF00' }}>&apos;Dzulfikar Tadah&apos;</span>,{'\n'}
            {'  '}<span style={{ color: '#94A3B8' }}>title:</span> <span style={{ color: '#D4FF00' }}>&apos;Fullstack Software Engineer&apos;</span>,{'\n'}
            {'  '}<span style={{ color: '#94A3B8' }}>focus:</span> <span style={{ color: '#E2E8F0' }}>&apos;Distributed Web & High-Craft UI&apos;</span>,{'\n'}
            {'  '}<span style={{ color: '#94A3B8' }}>coreDomains:</span> [{'\n'}
            {'    '}<span style={{ color: '#38BDF8' }}>&apos;Next.js 16 (App Router / PPR)&apos;</span>,{'\n'}
            {'    '}<span style={{ color: '#38BDF8' }}>&apos;TypeScript & Strict Type Systems&apos;</span>,{'\n'}
            {'    '}<span style={{ color: '#38BDF8' }}>&apos;PostgreSQL & Prisma Data Modeling&apos;</span>,{'\n'}
            {'  '}],{'\n'}
            {'  '}<span style={{ color: '#94A3B8' }}>availability:</span> <span style={{ color: '#10B981', fontWeight: 700 }}>&apos;OPEN_FOR_ENGAGEMENT&apos;</span>{'\n'}
            {'}'} <span style={{ color: '#F43F5E' }}>as const</span>;
          </Box>
        )}

        {activeTab === 'stack' && (
          <Box component="pre" sx={{ m: 0, fontFamily: 'inherit' }}>
            <span style={{ color: '#475569' }}>{'// Production Infrastructure Manifest'}</span>{'\n'}
            {'{'}{'\n'}
            {'  '}<span style={{ color: '#38BDF8' }}>&quot;runtime&quot;</span>: <span style={{ color: '#D4FF00' }}>&quot;Next.js 16.4 + React 19&quot;</span>,{'\n'}
            {'  '}<span style={{ color: '#38BDF8' }}>&quot;rendering&quot;</span>: <span style={{ color: '#D4FF00' }}>&quot;Cache Components & Partial Prerendering&quot;</span>,{'\n'}
            {'  '}<span style={{ color: '#38BDF8' }}>&quot;persistence&quot;</span>: <span style={{ color: '#10B981' }}>&quot;PostgreSQL + Prisma 6 ORM&quot;</span>,{'\n'}
            {'  '}<span style={{ color: '#38BDF8' }}>&quot;controlPlane&quot;</span>: <span style={{ color: '#38BDF8' }}>&quot;Integrated Admin CMS (/admin)&quot;</span>,{'\n'}
            {'  '}<span style={{ color: '#38BDF8' }}>&quot;typeSafety&quot;</span>: <span style={{ color: '#D4FF00' }}>&quot;Strict End-to-End Contracts&quot;</span>{'\n'}
            {'}'}
          </Box>
        )}

        {activeTab === 'telemetry' && (
          <Box component="pre" sx={{ m: 0, fontFamily: 'inherit' }}>
            <span style={{ color: '#475569' }}>{'// Live Production Diagnostics'}</span>{'\n'}
            <span style={{ color: '#10B981' }}>[OK]</span> Edge App Shell Prerender ...... <span style={{ color: '#38BDF8' }}>12ms TTFB</span>{'\n'}
            <span style={{ color: '#10B981' }}>[OK]</span> Prisma Connection Pool ........ <span style={{ color: '#D4FF00' }}>HEALTHY</span>{'\n'}
            <span style={{ color: '#10B981' }}>[OK]</span> Turbopack Incremental Graph ... <span style={{ color: '#38BDF8' }}>OPTIMIZED</span>{'\n'}
            <span style={{ color: '#10B981' }}>[OK]</span> Core Web Vitals (LCP / CLS) ... <span style={{ color: '#D4FF00' }}>99 / 100</span>{'\n'}
            <span style={{ color: '#10B981' }}>[OK]</span> Session Security & Hashing .... <span style={{ color: '#10B981' }}>ENFORCED</span>{'\n\n'}
            <span style={{ color: '#64748B' }}>SYSTEM STATUS: ALL NODES NOMINAL</span>
          </Box>
        )}
      </Box>

      {/* Terminal Footer Status Bar */}
      <Box
        sx={{
          px: 2,
          py: 0.75,
          bgcolor: 'rgba(255, 255, 255, 0.015)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.68rem',
          color: '#64748B',
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981' }} />
            <Typography sx={{ fontSize: 'inherit', color: '#94A3B8', fontFamily: 'inherit' }}>
              branch: main
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontSize: 'inherit',
              color: '#475569',
              fontFamily: 'inherit',
              display: { xs: 'none', sm: 'inline-block' },
            }}
          >
            UTF-8 // TS 5.x
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: 'inherit', color: '#D4FF00', fontFamily: 'inherit', fontWeight: 600 }}>
          READY
        </Typography>
      </Box>
    </Box>
  );
}

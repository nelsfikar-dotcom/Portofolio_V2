'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

const HeroCanvas = dynamic(() => import('@/components/canvas/HeroCanvas'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        width: '100%',
        height: { xs: 320, md: 420 },
        borderRadius: 4,
        border: '1px solid rgba(212, 255, 0, 0.1)',
        bgcolor: 'background.paper',
      }}
    />
  ),
});

export default function HeroCanvasWrapper() {
  return <HeroCanvas />;
}
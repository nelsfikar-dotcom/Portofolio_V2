'use client';

import React, { useRef, useState } from 'react';
import { Box, BoxProps } from '@mui/material';

interface SpotlightCardProps extends BoxProps {
  children: React.ReactNode;
  spotlightColor?: string;
}

export default function SpotlightCard({
  children,
  spotlightColor = 'rgba(16, 185, 129, 0.08)',
  sx,
  ...props
}: SpotlightCardProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <Box
      ref={boxRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: 'relative',
        borderRadius: '18px',
        overflow: 'hidden',
        border: '1px solid var(--border-card)',
        bgcolor: 'var(--surface-card)',
        transition: 'border-color 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
        '&:hover': {
          borderColor: 'rgba(16, 185, 129, 0.42)',
          transform: 'translateY(-4px)',
          boxShadow: '0 18px 40px rgba(0, 0, 0, 0.18)',
        },
        ...sx,
      }}
      {...props}
    >
      {/* Subtle Radial Cursor Spotlight Layer */}
      <Box
        sx={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          opacity,
          transition: 'opacity 0.25s ease',
          background: `radial-gradient(360px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

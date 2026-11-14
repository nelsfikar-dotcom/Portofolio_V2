'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Box, Typography, Stack } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

interface InteractiveProfileCardProps {
  fullName: string;
  handle?: string;
  location?: string;
  avatarUrl?: string | null;
}

export default function InteractiveProfileCard({
  fullName,
  handle = '@NelsFikar',
  location = 'Indonesia',
  avatarUrl,
}: InteractiveProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 150, y: 150 });
  const prefersReducedMotion = useReducedMotion();

  // Normalized mouse position (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for 3D tilt & image parallax
  const springConfig = { stiffness: 180, damping: 22, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-7, 7]);
  const imageParallaxX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const imageParallaxY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReducedMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    setCursorPos({ x: localX, y: localY });
    mouseX.set(localX / rect.width - 0.5);
    mouseY.set(localY / rect.height - 0.5);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const resolvedPhoto = avatarUrl && avatarUrl.trim().length > 0 ? avatarUrl : '/me1.png';

  return (
    <Box
      sx={{
        perspective: '1100px',
        position: 'relative',
        maxWidth: 340,
        mx: 'auto',
      }}
    >
      {/* Ambient Emerald-Cyan Backlight Glow (intensifies on hover) */}
      <Box
        sx={{
          position: 'absolute',
          inset: -14,
          borderRadius: '28px',
          background:
            'radial-gradient(circle at 50% 45%, rgba(16, 185, 129, 0.24) 0%, rgba(6, 182, 212, 0.14) 50%, transparent 75%)',
          filter: 'blur(26px)',
          opacity: isHovered ? 0.95 : 0.45,
          transform: isHovered ? 'scale(1.04)' : 'scale(0.96)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Interactive 3D Tilt & Cursor-Tracking Box */}
      <Box
        ref={cardRef}
        component={motion.div}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        sx={{
          position: 'relative',
          zIndex: 1,
          p: 2.25,
          borderRadius: '22px',
          bgcolor: 'var(--surface-elevated)',
          border: isHovered
            ? '1px solid rgba(16, 185, 129, 0.55)'
            : '1px solid rgba(16, 185, 129, 0.25)',
          boxShadow: isHovered
            ? '0 24px 50px rgba(0, 0, 0, 0.38), 0 0 28px rgba(16, 185, 129, 0.16)'
            : '0 14px 32px rgba(0, 0, 0, 0.22)',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color 0.28s ease, box-shadow 0.28s ease',
        }}
      >
        {/* Dynamic Cursor-Following Radial Spotlight Overlay */}
        <Box
          sx={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.25s ease',
            background: `radial-gradient(280px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(16, 185, 129, 0.22), rgba(6, 182, 212, 0.08) 45%, transparent 72%)`,
            zIndex: 3,
          }}
        />

        {/* Portrait Photo Container with Zoom + Parallax on Hover */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 250, sm: 270 },
            borderRadius: '16px',
            overflow: 'hidden',
            mb: 2.25,
            bgcolor: '#0B111E',
            border: '1px solid var(--border-card)',
          }}
        >
          <Box
            component={motion.div}
            style={{
              x: prefersReducedMotion ? 0 : imageParallaxX,
              y: prefersReducedMotion ? 0 : imageParallaxY,
            }}
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transform: isHovered ? 'scale(1.08)' : 'scale(1.01)',
              transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <Image
              src={resolvedPhoto}
              alt={fullName}
              fill
              sizes="(max-width: 768px) 280px, 320px"
              style={{
                objectFit: 'cover',
                objectPosition: 'center 28%',
              }}
              priority
            />
          </Box>

          {/* Subtle Bottom Vignette + Location Pill Inside Photo */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(8, 11, 17, 0) 50%, rgba(8, 11, 17, 0.82) 100%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Interactive Specular Sheen Sweep on Hover */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '65%',
              left: isHovered ? '125%' : '-85%',
              transform: 'skewX(-20deg)',
              background:
                'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.18), transparent)',
              transition: isHovered ? 'left 0.65s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Floating Location Badge at Bottom-Left of Photo */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              zIndex: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1.25,
              py: 0.4,
              borderRadius: '999px',
              bgcolor: 'rgba(8, 11, 17, 0.78)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'transform 0.25s ease, border-color 0.25s ease',
              ...(isHovered && {
                borderColor: 'rgba(16, 185, 129, 0.45)',
              }),
            }}
          >
            <LocationOnOutlinedIcon sx={{ fontSize: 13, color: '#10B981' }} />
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.67rem',
                fontWeight: 600,
                color: '#F8FAFC',
              }}
            >
              {location}
            </Typography>
          </Box>
        </Box>

        {/* Identity & Status Footer */}
        <Box sx={{ position: 'relative', zIndex: 4, textAlign: 'center', pb: 0.5 }}>
          <Stack
            direction="row"
            spacing={0.6}
            sx={{ justifyContent: 'center', alignItems: 'center', mb: 0.25 }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: '1.15rem',
                color: 'var(--text-main)',
                letterSpacing: '-0.01em',
              }}
            >
              {fullName}
            </Typography>
            <VerifiedOutlinedIcon
              sx={{
                fontSize: 17,
                color: '#10B981',
                transform: isHovered ? 'scale(1.12)' : 'scale(1)',
                transition: 'transform 0.25s ease',
              }}
            />
          </Stack>

          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem',
              color: '#10B981',
              fontWeight: 600,
              mb: 1.75,
            }}
          >
            {handle}
          </Typography>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.75,
              py: 0.55,
              borderRadius: '999px',
              bgcolor: isHovered ? 'rgba(16, 185, 129, 0.18)' : 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              transition: 'all 0.25s ease',
            }}
          >
            <Box
              className="pulse-indicator"
              sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#10B981' }}
            />
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#10B981' }}>
              Open for Collaboration
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

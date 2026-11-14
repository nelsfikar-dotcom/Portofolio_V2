'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Stack, Typography, Button } from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import TerminalIcon from '@mui/icons-material/Terminal';
import HeroTerminal from '@/components/public/HeroTerminal';

function InteractiveMesh({ wireframeMode }: { wireframeMode: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.32;
    meshRef.current.rotation.y = t * 0.42;

    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.25;
      ringRef.current.rotation.x = Math.sin(t * 0.4) * 0.35;
    }

    const targetX = (state.pointer.x * Math.PI) / 6;
    const targetY = (state.pointer.y * Math.PI) / 6;
    meshRef.current.rotation.x += 0.05 * (targetY - meshRef.current.rotation.x);
    meshRef.current.rotation.y += 0.05 * (targetX - meshRef.current.rotation.y);
  });

  return (
    <group>
      <Float speed={1.8} rotationIntensity={1.1} floatIntensity={1.2}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.72 : 1.58}
        >
          <icosahedronGeometry args={[1, 2]} />
          <MeshDistortMaterial
            color={hovered ? '#D4FF00' : '#0f172a'}
            emissive={hovered ? '#D4FF00' : '#38BDF8'}
            emissiveIntensity={hovered ? 0.5 : 0.22}
            wireframe={wireframeMode && !hovered}
            roughness={0.18}
            metalness={0.85}
            distort={0.24}
            speed={2.4}
          />
        </mesh>
      </Float>

      {/* Orbital Technical Ring */}
      <mesh ref={ringRef} scale={2.35}>
        <torusGeometry args={[1, 0.008, 16, 100]} />
        <meshBasicMaterial color="#D4FF00" transparent opacity={0.32} />
      </mesh>
    </group>
  );
}

export default function HeroCanvas() {
  const [viewMode, setViewMode] = useState<'3d' | 'code'>('3d');
  const [wireframe, setWireframe] = useState(true);

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '14px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.09)',
        bgcolor: '#090C14',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        position: 'relative',
      }}
    >
      {/* Top Viewport Control Bar */}
      <Stack
        direction="row"
        sx={{
          px: 2,
          py: 1.1,
          bgcolor: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box
            className="pulse-indicator"
            sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#D4FF00' }}
          />
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#94A3B8',
              letterSpacing: '0.06em',
            }}
          >
            {viewMode === '3d' ? 'WEBGL.VIEWPORT // CORE_MESH' : 'SYS.INSPECTOR // RUNTIME_SPEC'}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.75}>
          <Button
            size="small"
            onClick={() => setViewMode('3d')}
            startIcon={<ViewInArIcon sx={{ fontSize: 14 }} />}
            sx={{
              py: 0.3,
              px: 1.1,
              minWidth: 0,
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono), monospace',
              bgcolor: viewMode === '3d' ? 'rgba(212, 255, 0, 0.14)' : 'transparent',
              color: viewMode === '3d' ? 'primary.main' : '#64748B',
              border:
                viewMode === '3d'
                  ? '1px solid rgba(212, 255, 0, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            3D Core
          </Button>
          <Button
            size="small"
            onClick={() => setViewMode('code')}
            startIcon={<TerminalIcon sx={{ fontSize: 14 }} />}
            sx={{
              py: 0.3,
              px: 1.1,
              minWidth: 0,
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono), monospace',
              bgcolor: viewMode === 'code' ? 'rgba(212, 255, 0, 0.14)' : 'transparent',
              color: viewMode === 'code' ? 'primary.main' : '#64748B',
              border:
                viewMode === 'code'
                  ? '1px solid rgba(212, 255, 0, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            Spec
          </Button>
        </Stack>
      </Stack>

      {viewMode === '3d' ? (
        <Box
          sx={{
            width: '100%',
            height: { xs: 320, md: 390 },
            position: 'relative',
            background:
              'radial-gradient(circle at 50% 50%, rgba(212, 255, 0, 0.07) 0%, rgba(56, 189, 248, 0.04) 40%, rgba(9, 12, 20, 0.98) 80%)',
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 4.6], fov: 45 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.75} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} color="#D4FF00" />
            <pointLight position={[-5, -5, -5]} intensity={0.9} color="#38BDF8" />
            <InteractiveMesh wireframeMode={wireframe} />
          </Canvas>

          {/* Bottom HUD Telemetry Overlay */}
          <Stack
            direction="row"
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 14,
              right: 14,
              justifyContent: 'space-between',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                px: 1.25,
                py: 0.4,
                borderRadius: '6px',
                bgcolor: 'rgba(6, 8, 13, 0.75)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.64rem',
                  color: '#94A3B8',
                }}
              >
                INTERACTIVE // HOVER & POINTER TRACKING
              </Typography>
            </Box>

            <Button
              size="small"
              onClick={() => setWireframe((w) => !w)}
              sx={{
                pointerEvents: 'auto',
                py: 0.3,
                px: 1.1,
                fontSize: '0.64rem',
                fontFamily: 'var(--font-mono), monospace',
                bgcolor: 'rgba(6, 8, 13, 0.8)',
                color: '#E2E8F0',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
              }}
            >
              MODE: {wireframe ? 'WIREFRAME' : 'SOLID'}
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box sx={{ p: 1.5, bgcolor: '#06080D' }}>
          <HeroTerminal />
        </Box>
      )}
    </Box>
  );
}

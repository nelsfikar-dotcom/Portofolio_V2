'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import CodeIcon from '@mui/icons-material/Code';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import SpotlightCard from '@/components/public/SpotLightCard';

export interface ProjectCardData {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  thumbnail?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
  year: number;
  technologies: { id: string; name: string }[];
}

const ACCENT_THEMES = [
  {
    bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(6, 182, 212, 0.12) 100%)',
    accent: '#10B981',
  },
  {
    bg: 'linear-gradient(135deg, rgba(6, 182, 212, 0.18) 0%, rgba(59, 130, 246, 0.12) 100%)',
    accent: '#06B6D4',
  },
  {
    bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(16, 185, 129, 0.12) 100%)',
    accent: '#F59E0B',
  },
  {
    bg: 'linear-gradient(135deg, rgba(52, 211, 153, 0.18) 0%, rgba(14, 165, 233, 0.12) 100%)',
    accent: '#059669',
  },
];

export default function ProjectCard({
  project,
  index,
}: {
  project: ProjectCardData;
  index: number;
}) {
  const theme = ACCENT_THEMES[index % ACCENT_THEMES.length];
  const visibleTech = project.technologies.slice(0, 5);
  const extraTechCount = Math.max(0, project.technologies.length - 5);

  const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(
    project.thumbnail || null
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', project.id);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setCurrentThumbnail(data.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <SpotlightCard
      sx={{
        height: '100%',
        '&:hover .project-preview-media': {
          transform: 'scale(1.06)',
        },
        '&:hover .project-preview-cta': {
          opacity: 1,
          transform: 'translateY(0)',
        },
        '&:hover .project-upload-btn': {
          opacity: 1,
          transform: 'translateY(0)',
        },
        '&:hover .project-spec-box': {
          borderColor: `${theme.accent}55`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box>
        {/* Hidden File Input for Quick App/Web Preview Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Interactive Visual Preview Banner */}
        <Box
          sx={{
            position: 'relative',
            height: 215,
            overflow: 'hidden',
            p: 2.25,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-card)',
          }}
        >
          {/* Zoomable Media / Gradient Backdrop Layer */}
          <Box
            className="project-preview-media"
            sx={{
              position: 'absolute',
              inset: 0,
              background: currentThumbnail
                ? `url(${currentThumbnail}) center top/cover no-repeat`
                : theme.bg,
              transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
              zIndex: 0,
            }}
          />

          {/* Subtle Protective Gradient Overlay when Thumbnail Image is Present */}
          {currentThumbnail && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(8, 11, 17, 0.55) 0%, rgba(8, 11, 17, 0.15) 45%, rgba(8, 11, 17, 0.72) 100%)',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Top Metadata Row */}
          <Stack
            direction="row"
            sx={{
              position: 'relative',
              zIndex: 2,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Chip
              label={project.category}
              size="small"
              sx={{
                height: 24,
                bgcolor: 'var(--surface-card)',
                backdropFilter: 'blur(8px)',
                color: theme.accent,
                border: `1px solid ${theme.accent}44`,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                fontWeight: 700,
              }}
            />

            <Stack direction="row" spacing={0.85} sx={{ alignItems: 'center' }}>
              {/* Quick Upload / Change App Preview Photo Button */}
              <Box
                component="button"
                type="button"
                onClick={handleUploadClick}
                className="project-upload-btn"
                title="Pasang atau ganti foto tampilan aplikasi/web"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.1,
                  py: 0.35,
                  borderRadius: '6px',
                  bgcolor: 'rgba(15, 23, 42, 0.86)',
                  color: '#E2E8F0',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(8px)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  opacity: currentThumbnail ? 0 : 0.92,
                  transform: currentThumbnail ? 'translateY(4px)' : 'translateY(0)',
                  transition: 'all 0.22s ease',
                  '&:hover': {
                    bgcolor: 'rgba(16, 185, 129, 0.92)',
                    color: '#04130D',
                    borderColor: '#10B981',
                  },
                }}
              >
                {uploading ? (
                  <CircularProgress size={11} color="inherit" />
                ) : (
                  <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 13 }} />
                )}
                {currentThumbnail ? 'Ganti Foto' : 'Pasang Foto'}
              </Box>

              {/* Hover-revealed "Lihat detail ↗" pill */}
              <Link href={`/projects/${project.slug}`} style={{ textDecoration: 'none' }}>
                <Box
                  className="project-preview-cta"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.4,
                    px: 1.15,
                    py: 0.35,
                    borderRadius: '6px',
                    bgcolor: 'rgba(16, 185, 129, 0.95)',
                    color: '#04130D',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    opacity: 0,
                    transform: 'translateY(5px)',
                    transition:
                      'opacity 0.22s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.28)',
                  }}
                >
                  Lihat detail
                  <ArrowOutwardIcon sx={{ fontSize: 12 }} />
                </Box>
              </Link>

              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  px: 1.25,
                  py: 0.3,
                  borderRadius: '6px',
                  bgcolor: 'var(--surface-card)',
                  border: '1px solid var(--border-card)',
                }}
              >
                {project.year}
              </Typography>
            </Stack>
          </Stack>

          {/* Bottom Preview Footer: Either Clean Caption Overlay on Image OR Code Spec Box */}
          {currentThumbnail ? (
            <Stack
              direction="row"
              sx={{
                position: 'relative',
                zIndex: 2,
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 1.5,
                py: 0.85,
                borderRadius: '10px',
                bgcolor: 'rgba(8, 11, 17, 0.78)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', minWidth: 0 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#10B981', flexShrink: 0 }} />
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#F8FAFC',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {project.title}
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: '#34D399',
                  fontWeight: 700,
                  ml: 1,
                  flexShrink: 0,
                }}
              >
                PREVIEW
              </Typography>
            </Stack>
          ) : (
            <Link href={`/projects/${project.slug}`} style={{ textDecoration: 'none' }}>
              <Box
                className="project-spec-box"
                sx={{
                  position: 'relative',
                  zIndex: 2,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: 'var(--surface-card)',
                  border: '1px solid var(--border-card)',
                  backdropFilter: 'blur(8px)',
                  transition:
                    'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s ease',
                }}
              >
                <Stack
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: theme.accent,
                      fontWeight: 700,
                    }}
                  >
                    {`// ${project.slug}`}
                  </Typography>
                  <ArrowOutwardIcon sx={{ fontSize: 14, color: 'var(--text-muted)' }} />
                </Stack>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: 'var(--text-main)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {project.title}
                </Typography>
              </Box>
            </Link>
          )}
        </Box>

        {/* Body Content */}
        <Box sx={{ p: 3 }}>
          <Link href={`/projects/${project.slug}`} style={{ textDecoration: 'none' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: '1.22rem',
                color: 'var(--text-main)',
                mb: 1,
                transition: 'color 0.18s ease',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {project.title}
            </Typography>
          </Link>

          <Typography
            variant="body2"
            sx={{
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              mb: 2.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {project.summary}
          </Typography>

          {/* Tech Chips */}
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75 }}>
            {visibleTech.map((tech) => (
              <Chip
                key={tech.id}
                label={tech.name}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  color: 'primary.main',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              />
            ))}
            {extraTechCount > 0 && (
              <Chip
                label={`+${extraTechCount}`}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  bgcolor: 'var(--surface-subtle)',
                  color: 'var(--text-muted)',
                }}
              />
            )}
          </Stack>
        </Box>
      </Box>

      {/* Bottom Action Footer */}
      <Stack
        direction="row"
        spacing={1.25}
        sx={{
          px: 3,
          pb: 3,
          pt: 1,
        }}
      >
        {project.liveUrl ? (
          <Button
            component="a"
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            fullWidth
            size="small"
            endIcon={<LaunchIcon sx={{ fontSize: 14 }} />}
            sx={{ py: 0.9, borderRadius: '9px' }}
          >
            Live Demo
          </Button>
        ) : (
          <Link href={`/projects/${project.slug}`} style={{ textDecoration: 'none', width: '100%' }}>
            <Button
              variant="contained"
              fullWidth
              size="small"
              endIcon={<ArrowOutwardIcon sx={{ fontSize: 14 }} />}
              sx={{ py: 0.9, borderRadius: '9px' }}
            >
              Studi Kasus
            </Button>
          </Link>
        )}

        {project.repoUrl ? (
          <Button
            component="a"
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            fullWidth
            size="small"
            startIcon={<CodeIcon sx={{ fontSize: 15 }} />}
            sx={{ py: 0.9, borderRadius: '9px' }}
          >
            Source Code
          </Button>
        ) : (
          <Link href={`/projects/${project.slug}`} style={{ textDecoration: 'none', width: '100%' }}>
            <Button
              variant="outlined"
              fullWidth
              size="small"
              endIcon={<ArrowOutwardIcon sx={{ fontSize: 14 }} />}
              sx={{ py: 0.9, borderRadius: '9px' }}
            >
              Detail
            </Button>
          </Link>
        )}
      </Stack>
    </SpotlightCard>
  );
}

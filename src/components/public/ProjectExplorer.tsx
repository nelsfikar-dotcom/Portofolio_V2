'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProjectCard from '@/components/public/ProjectCard';

interface Technology {
  id: string;
  name: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  thumbnail: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  year: number;
  featured: boolean;
  technologies: Technology[];
}

export default function ProjectExplorer({ projects }: { projects: ProjectItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add('Semua');
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchCategory =
        selectedCategory === 'Semua' ||
        project.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some((t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchCategory && matchSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <Box>
      {/* Filter and Search Bar */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2.5}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          mb: 5,
          p: 2,
          borderRadius: '18px',
          bgcolor: 'var(--surface-card)',
          border: '1px solid var(--border-card)',
        }}
      >
        {/* Category Pills */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <Button
                key={category}
                size="small"
                onClick={() => setSelectedCategory(category)}
                sx={{
                  borderRadius: '999px',
                  px: 2.25,
                  py: 0.65,
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  background: isSelected
                    ? 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)'
                    : 'var(--surface-elevated)',
                  color: isSelected ? '#04130D' : 'var(--text-muted)',
                  border: isSelected
                    ? '1px solid rgba(16, 185, 129, 0.5)'
                    : '1px solid var(--border-card)',
                  boxShadow: isSelected ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none',
                  '&:hover': {
                    color: isSelected ? '#04130D' : 'var(--text-main)',
                    bgcolor: isSelected ? undefined : 'var(--surface-subtle)',
                  },
                }}
              >
                {category}
              </Button>
            );
          })}
        </Stack>

        {/* Search Input */}
        <TextField
          size="small"
          placeholder="Cari teknologi / judul proyek..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'var(--text-muted)', fontSize: 19 }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '999px',
                fontSize: '0.85rem',
                bgcolor: 'var(--surface-elevated)',
                width: { xs: '100%', sm: 280 },
              },
            },
          }}
        />
      </Stack>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Box
          sx={{
            py: 10,
            textAlign: 'center',
            border: '1px dashed var(--border-card)',
            borderRadius: '20px',
            bgcolor: 'var(--surface-card)',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, fontSize: '1.2rem' }}>
            Tidak ada proyek yang sesuai
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Coba ubah kata kunci pencarian atau pilih kategori lain.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3.5}>
          {filteredProjects.map((project, idx) => (
            <Grid key={project.id} size={{ xs: 12, md: 6 }}>
              <ProjectCard project={project} index={idx} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

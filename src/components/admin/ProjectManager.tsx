'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  FormControlLabel,
  Switch,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
  Grid,
  Snackbar,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import GitHubIcon from '@mui/icons-material/GitHub';
import SearchIcon from '@mui/icons-material/Search';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { ContentStatus } from '@prisma/client';
import { saveProject, deleteProject } from '@/lib/admin-actions';

interface ProjectData {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  thumbnail?: string | null;
  year: number;
  featured: boolean;
  status: ContentStatus;
  liveUrl: string | null;
  repoUrl: string | null;
  technologies: { id: string; name: string }[];
}

type FilterMode = 'ALL' | 'PUBLISHED' | 'DRAFT' | 'FEATURED';

export default function ProjectManager({ initialProjects }: { initialProjects: ProjectData[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('ALL');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    summary: string;
    description: string;
    category: string;
    thumbnail: string;
    year: number;
    featured: boolean;
    status: ContentStatus;
    liveUrl: string;
    repoUrl: string;
    technologies: string;
  }>({
    title: '',
    slug: '',
    summary: '',
    description: '',
    category: 'Fullstack Web App',
    thumbnail: '',
    year: 2026,
    featured: false,
    status: ContentStatus.PUBLISHED,
    liveUrl: '',
    repoUrl: '',
    technologies: 'Next.js, TypeScript, PostgreSQL, Prisma',
  });

  const stats = useMemo(() => {
    const published = projects.filter((p) => p.status === ContentStatus.PUBLISHED).length;
    const drafts = projects.length - published;
    const featured = projects.filter((p) => p.featured).length;
    return { total: projects.length, published, drafts, featured };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (filterMode === 'PUBLISHED' && p.status !== ContentStatus.PUBLISHED) return false;
      if (filterMode === 'DRAFT' && p.status !== ContentStatus.DRAFT) return false;
      if (filterMode === 'FEATURED' && !p.featured) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inSlug = p.slug.toLowerCase().includes(q);
        const inCat = p.category.toLowerCase().includes(q);
        const inTech = p.technologies.some((t) => t.name.toLowerCase().includes(q));
        return inTitle || inSlug || inCat || inTech;
      }
      return true;
    });
  }, [projects, filterMode, searchQuery]);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      summary: '',
      description: '',
      category: 'Fullstack Web App',
      thumbnail: '',
      year: 2026,
      featured: false,
      status: ContentStatus.PUBLISHED,
      liveUrl: '',
      repoUrl: '',
      technologies: 'Next.js, TypeScript, PostgreSQL',
    });
    setError(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (project: ProjectData) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      description: project.description,
      category: project.category,
      thumbnail: project.thumbnail || '',
      year: project.year,
      featured: project.featured,
      status: project.status,
      liveUrl: project.liveUrl || '',
      repoUrl: project.repoUrl || '',
      technologies: project.technologies.map((t) => t.name).join(', '),
    });
    setError(null);
    setOpenDialog(true);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    try {
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadForm,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah gambar');
      }
      setFormData((prev) => ({ ...prev, thumbnail: data.url }));
      setToast('Foto tampilan aplikasi berhasil diunggah.');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Gagal mengunggah gambar.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAutoSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingProject ? prev.slug : handleAutoSlug(val),
    }));
  };

  const handleQuickToggleFeatured = async (proj: ProjectData) => {
    const nextFeatured = !proj.featured;
    setProjects((prev) =>
      prev.map((item) => (item.id === proj.id ? { ...item, featured: nextFeatured } : item))
    );
    await saveProject({
      id: proj.id,
      title: proj.title,
      slug: proj.slug,
      summary: proj.summary,
      description: proj.description,
      category: proj.category,
      year: proj.year,
      featured: nextFeatured,
      status: proj.status,
      liveUrl: proj.liveUrl || '',
      repoUrl: proj.repoUrl || '',
      technologies: proj.technologies.map((t) => t.name),
    });
    setToast(nextFeatured ? `"${proj.title}" marked as Featured.` : `"${proj.title}" unfeatured.`);
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const techArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      await saveProject({
        id: editingProject?.id,
        title: formData.title,
        slug: formData.slug,
        summary: formData.summary,
        description: formData.description,
        category: formData.category,
        thumbnail: formData.thumbnail || null,
        year: Number(formData.year),
        featured: formData.featured,
        status: formData.status,
        liveUrl: formData.liveUrl,
        repoUrl: formData.repoUrl,
        technologies: techArray,
      });

      setOpenDialog(false);
      setToast(editingProject ? 'Project updated in registry.' : 'New project deployed to registry.');
      router.refresh();
      window.location.reload();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to save project.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteProject(deleteTarget.id);
    setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setToast(`Deleted "${deleteTarget.title}".`);
    setDeleteTarget(null);
    router.refresh();
  };

  return (
    <Box>
      {/* Module Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-end' }, mb: 3.5 }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'var(--font-mono), monospace',
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}
          >
            MODULE 02 // CASE STUDIES & DEPLOYMENTS
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mt: 0.5 }}>
            Projects Registry
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Deploy New Project
        </Button>
      </Stack>

      {/* Telemetry Summary Strip */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'TOTAL INDEXED', value: stats.total, color: '#F8FAFC' },
          { label: 'PUBLISHED LIVE', value: stats.published, color: '#10B981' },
          { label: 'STAGED DRAFTS', value: stats.drafts, color: '#F59E0B' },
          { label: 'HOME FEATURED', value: stats.featured, color: '#6366F1' },
        ].map((item) => (
          <Grid key={item.label} size={{ xs: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: '#0B0E17',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '10px',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.65rem',
                  color: '#64748B',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                {item.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  color: item.color,
                  lineHeight: 1,
                }}
              >
                {String(item.value).padStart(2, '0')}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Filter & Search Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2.5,
          bgcolor: '#0B0E17',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '10px',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}
        >
          <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75 }}>
            {(['ALL', 'PUBLISHED', 'DRAFT', 'FEATURED'] as FilterMode[]).map((mode) => {
              const active = filterMode === mode;
              return (
                <Button
                  key={mode}
                  size="small"
                  onClick={() => setFilterMode(mode)}
                  sx={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.72rem',
                    px: 1.5,
                    py: 0.5,
                    bgcolor: active ? 'rgba(99, 102, 241, 0.14)' : 'rgba(255, 255, 255, 0.02)',
                    color: active ? 'primary.main' : '#94A3B8',
                    border: active
                      ? '1px solid rgba(99, 102, 241, 0.35)'
                      : '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {mode}
                </Button>
              );
            })}
          </Stack>

          <TextField
            size="small"
            placeholder="Filter by title, slug, or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: '100%', md: 300 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 17, color: '#64748B' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </Paper>

      {/* Projects Table */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#0B0E17',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 52 }}>Pin</TableCell>
                <TableCell>Project & Route</TableCell>
                <TableCell>Classification</TableCell>
                <TableCell>Architecture Stack</TableCell>
                <TableCell>State</TableCell>
                <TableCell align="right">Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 7, color: 'text.secondary' }}>
                    No projects match the current filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((p) => (
                  <TableRow
                    key={p.id}
                    sx={{
                      transition: 'background-color 0.15s ease',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                    }}
                  >
                    <TableCell>
                      <Tooltip title={p.featured ? 'Remove from Home Featured' : 'Pin to Home Featured'}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuickToggleFeatured(p)}
                          sx={{ color: p.featured ? '#6366F1' : '#475569' }}
                        >
                          {p.featured ? (
                            <StarRoundedIcon fontSize="small" />
                          ) : (
                            <StarBorderRoundedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                        {p.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: 'var(--font-mono), monospace', color: '#64748B' }}
                      >
                        /projects/{p.slug}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.83rem' }}>
                        {p.category}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: 'var(--font-mono), monospace', color: '#64748B' }}
                      >
                        FY {p.year}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.6, maxWidth: 320 }}>
                        {p.technologies.slice(0, 4).map((tech) => (
                          <Chip
                            key={tech.id}
                            label={tech.name}
                            size="small"
                            sx={{
                              fontSize: '0.68rem',
                              height: 21,
                              fontFamily: 'var(--font-mono), monospace',
                              bgcolor: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.07)',
                              color: '#CBD5E1',
                            }}
                          />
                        ))}
                        {p.technologies.length > 4 && (
                          <Chip
                            label={`+${p.technologies.length - 4}`}
                            size="small"
                            sx={{
                              fontSize: '0.68rem',
                              height: 21,
                              fontFamily: 'var(--font-mono), monospace',
                            }}
                          />
                        )}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={p.status}
                        size="small"
                        sx={{
                          height: 22,
                          fontFamily: 'var(--font-mono), monospace',
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          bgcolor:
                            p.status === ContentStatus.PUBLISHED
                              ? 'rgba(16, 185, 129, 0.12)'
                              : 'rgba(245, 158, 11, 0.12)',
                          color:
                            p.status === ContentStatus.PUBLISHED ? '#34D399' : '#FBBF24',
                          border:
                            p.status === ContentStatus.PUBLISHED
                              ? '1px solid rgba(16, 185, 129, 0.28)'
                              : '1px solid rgba(245, 158, 11, 0.28)',
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                        {p.liveUrl && (
                          <Tooltip title="Open Live Deployment">
                            <IconButton
                              component="a"
                              href={p.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              sx={{ color: '#94A3B8', '&:hover': { color: 'primary.main' } }}
                            >
                              <LaunchIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {p.repoUrl && (
                          <Tooltip title="View Source Repository">
                            <IconButton
                              component="a"
                              href={p.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              sx={{ color: '#94A3B8', '&:hover': { color: '#FFFFFF' } }}
                            >
                              <GitHubIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Edit Specification">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(p)}
                            sx={{ color: '#94A3B8', '&:hover': { color: 'primary.main' } }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove Project">
                          <IconButton
                            size="small"
                            onClick={() => setDeleteTarget(p)}
                            sx={{ color: '#94A3B8', '&:hover': { color: '#FB7185' } }}
                          >
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create / Edit Project Modal */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {editingProject ? `Edit Project // ${editingProject.title}` : 'Deploy New Project Specification'}
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Project Title"
                  required
                  fullWidth
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
                <TextField
                  label="URL Slug"
                  required
                  fullWidth
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  helperText="Route identifier, e.g. ecommerce-platform"
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Category / Domain"
                  required
                  fullWidth
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
                <TextField
                  label="Release Year"
                  type="number"
                  required
                  sx={{ width: { sm: 160 } }}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                />
                <TextField
                  select
                  label="Publication State"
                  sx={{ width: { sm: 190 } }}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
                >
                  <MenuItem value={ContentStatus.PUBLISHED}>PUBLISHED</MenuItem>
                  <MenuItem value={ContentStatus.DRAFT}>DRAFT</MenuItem>
                </TextField>
              </Stack>

              <TextField
                label="Executive Summary"
                required
                multiline
                rows={2}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                helperText="Concise value proposition displayed on catalog cards."
              />

              <TextField
                label="Technical Architecture & Case Study (Description)"
                required
                multiline
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                helperText="Detail the engineering problem, system architecture, and measurable outcomes."
              />

              <TextField
                label="Technology Stack (Comma-separated)"
                required
                fullWidth
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                helperText="Example: Next.js, TypeScript, PostgreSQL, Prisma, Docker"
              />

              {/* App / Web Screenshot Upload & Preview */}
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: '12px',
                  bgcolor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px dashed rgba(16, 185, 129, 0.35)',
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', mb: 1.5 }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      Foto / Tampilan Aplikasi & Web (Thumbnail)
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                      Unggah screenshot tampilan aplikasi/website dari komputer atau tempel URL gambar
                    </Typography>
                  </Box>

                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    disabled={uploadingImage}
                    startIcon={
                      uploadingImage ? (
                        <CircularProgress size={15} color="inherit" />
                      ) : (
                        <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 17 }} />
                      )
                    }
                    sx={{ flexShrink: 0 }}
                  >
                    {uploadingImage ? 'Mengunggah...' : 'Upload Foto Aplikasi'}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      hidden
                      onChange={handleThumbnailUpload}
                    />
                  </Button>
                </Stack>

                <TextField
                  size="small"
                  label="URL Gambar / Path Thumbnail"
                  fullWidth
                  placeholder="/uploads/nama-file.png atau https://..."
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                />

                {formData.thumbnail && (
                  <Box
                    sx={{
                      mt: 2,
                      position: 'relative',
                      height: 160,
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-card)',
                      background: `url(${formData.thumbnail}) center top/cover no-repeat`,
                    }}
                  />
                )}
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Live Production URL (Optional)"
                  fullWidth
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                />
                <TextField
                  label="GitHub Repository URL (Optional)"
                  fullWidth
                  value={formData.repoUrl}
                  onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                />
              </Stack>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    color="primary"
                  />
                }
                label="Pin as Featured Case Study on Public Overview"
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading} sx={{ px: 3 }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Save Specification'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Project Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to permanently remove{' '}
            <Box component="span" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
              {deleteTarget?.title}
            </Box>{' '}
            from the registry? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDeleteTarget(null)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{ bgcolor: '#F43F5E', color: '#FFFFFF', '&:hover': { bgcolor: '#E11D48' } }}
          >
            Delete Project
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        message={toast}
      />
    </Box>
  );
}

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
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  InputAdornment,
  Snackbar,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/Search';
import LaunchIcon from '@mui/icons-material/Launch';
import { ContentStatus } from '@prisma/client';
import { saveArticle, deleteArticle } from '@/lib/admin-actions';

interface ArticleData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string | null;
  status: ContentStatus;
  publishedAt: Date | null;
  createdAt: Date;
}

export default function JournalManager({ initialArticles }: { initialArticles: ArticleData[] }) {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleData[]>(initialArticles);
  const [statusFilter, setStatusFilter] = useState<'ALL' | ContentStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverUrl: string;
    status: ContentStatus;
  }>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverUrl: '',
    status: ContentStatus.PUBLISHED,
  });

  const publishedCount = articles.filter((a) => a.status === ContentStatus.PUBLISHED).length;
  const draftCount = articles.length - publishedCount;

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [articles, statusFilter, searchQuery]);

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverUrl: '',
      status: ContentStatus.PUBLISHED,
    });
    setError(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (art: ArticleData) => {
    setEditingArticle(art);
    setFormData({
      title: art.title,
      slug: art.slug,
      excerpt: art.excerpt,
      content: art.content,
      coverUrl: art.coverUrl || '',
      status: art.status,
    });
    setError(null);
    setOpenDialog(true);
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
      slug: editingArticle ? prev.slug : handleAutoSlug(val),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await saveArticle({
        id: editingArticle?.id,
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        coverUrl: formData.coverUrl || undefined,
        status: formData.status,
      });

      setOpenDialog(false);
      setToast(editingArticle ? 'Article updated.' : 'New article published.');
      router.refresh();
      window.location.reload();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to save article.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteArticle(deleteTarget.id);
    setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    setToast(`Deleted "${deleteTarget.title}".`);
    setDeleteTarget(null);
    router.refresh();
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(
      new Date(date)
    );

  const estimateReadMin = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 180));
  };

  return (
    <Box>
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
            MODULE 05 // EDITORIAL & TECHNICAL NOTES
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mt: 0.5 }}>
            Engineering Journal ({articles.length})
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Compose Dispatch
        </Button>
      </Stack>

      {/* Telemetry Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'TOTAL DISPATCHES', value: articles.length, color: '#F8FAFC' },
          { label: 'PUBLISHED LIVE', value: publishedCount, color: '#10B981' },
          { label: 'STAGED DRAFTS', value: draftCount, color: '#F59E0B' },
        ].map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
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
                {stat.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: stat.color,
                  lineHeight: 1,
                }}
              >
                {String(stat.value).padStart(2, '0')}
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
          <Stack direction="row" spacing={0.75}>
            {(['ALL', ContentStatus.PUBLISHED, ContentStatus.DRAFT] as const).map((st) => {
              const active = statusFilter === st;
              return (
                <Button
                  key={st}
                  size="small"
                  onClick={() => setStatusFilter(st)}
                  sx={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.72rem',
                    px: 1.5,
                    py: 0.5,
                    bgcolor: active ? 'rgba(99, 102, 241, 0.14)' : 'transparent',
                    color: active ? 'primary.main' : '#94A3B8',
                    border: active
                      ? '1px solid rgba(99, 102, 241, 0.35)'
                      : '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {st}
                </Button>
              );
            })}
          </Stack>

          <TextField
            size="small"
            placeholder="Search article title or excerpt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: '100%', md: 280 } }}
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
                <TableCell>Article & Route</TableCell>
                <TableCell>Read Length</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>State</TableCell>
                <TableCell align="right">Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 7, color: 'text.secondary' }}>
                    No journal articles match the active filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((art) => (
                  <TableRow
                    key={art.id}
                    sx={{
                      transition: 'background-color 0.15s ease',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                        {art.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: 'var(--font-mono), monospace', color: '#64748B' }}
                      >
                        /journal/{art.slug}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: 'var(--font-mono), monospace', color: '#94A3B8' }}
                      >
                        ~{estimateReadMin(art.content)} min read
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: 'var(--font-mono), monospace', color: '#94A3B8' }}
                      >
                        {art.publishedAt ? formatDate(art.publishedAt) : formatDate(art.createdAt)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={art.status}
                        size="small"
                        sx={{
                          height: 22,
                          fontFamily: 'var(--font-mono), monospace',
                          bgcolor:
                            art.status === ContentStatus.PUBLISHED
                              ? 'rgba(16, 185, 129, 0.12)'
                              : 'rgba(245, 158, 11, 0.12)',
                          color:
                            art.status === ContentStatus.PUBLISHED ? '#34D399' : '#FBBF24',
                          border:
                            art.status === ContentStatus.PUBLISHED
                              ? '1px solid rgba(16, 185, 129, 0.28)'
                              : '1px solid rgba(245, 158, 11, 0.28)',
                          fontWeight: 700,
                          fontSize: '0.68rem',
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                        {art.status === ContentStatus.PUBLISHED && (
                          <Tooltip title="View Live Article">
                            <IconButton
                              component="a"
                              href={`/journal/${art.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              sx={{ color: '#94A3B8', '&:hover': { color: 'primary.main' } }}
                            >
                              <LaunchIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(art)}
                          sx={{ color: '#94A3B8', '&:hover': { color: 'primary.main' } }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => setDeleteTarget(art)}
                          sx={{ color: '#94A3B8', '&:hover': { color: '#FB7185' } }}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog Modal Form */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {editingArticle ? `Edit Article // ${editingArticle.title}` : 'Compose Technical Article'}
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2.5 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Article Headline"
                  required
                  fullWidth
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Designing Zero-Latency Edge Architectures with Next.js 16"
                />
                <TextField
                  label="Route Slug"
                  required
                  fullWidth
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </Stack>

              <TextField
                select
                label="Publication State"
                sx={{ width: { sm: 220 } }}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
              >
                <MenuItem value={ContentStatus.PUBLISHED}>PUBLISHED</MenuItem>
                <MenuItem value={ContentStatus.DRAFT}>DRAFT</MenuItem>
              </TextField>

              <TextField
                label="Abstract / Excerpt"
                required
                multiline
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                helperText="Displayed on the journal index and social OpenGraph cards."
              />

              <TextField
                label="Article Body (Markdown / Technical Prose)"
                required
                multiline
                rows={11}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading} sx={{ px: 3 }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Save Dispatch'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Article</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Permanently delete{' '}
            <Box component="span" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
              {deleteTarget?.title}
            </Box>
            ?
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
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast(null)} message={toast} />
    </Box>
  );
}

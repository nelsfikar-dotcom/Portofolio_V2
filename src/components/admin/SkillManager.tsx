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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { SkillCategory } from '@prisma/client';
import { saveSkill, deleteSkill } from '@/lib/admin-actions';

interface SkillData {
  id: string;
  name: string;
  category: SkillCategory;
  level: string | null;
  sortOrder: number;
}

const categories: { value: SkillCategory; label: string; color: string }[] = [
  { value: SkillCategory.FRONTEND, label: 'Frontend', color: '#6366F1' },
  { value: SkillCategory.BACKEND, label: 'Backend', color: '#38BDF8' },
  { value: SkillCategory.DATABASE, label: 'Database', color: '#10B981' },
  { value: SkillCategory.TOOLS, label: 'Tools & DevOps', color: '#F59E0B' },
  { value: SkillCategory.OTHER, label: 'Architecture & Other', color: '#A855F7' },
];

export default function SkillManager({ initialSkills }: { initialSkills: SkillData[] }) {
  const router = useRouter();
  const [skills, setSkills] = useState<SkillData[]>(initialSkills);
  const [selectedCat, setSelectedCat] = useState<SkillCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SkillData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    category: SkillCategory;
    level: string;
    sortOrder: number;
  }>({
    name: '',
    category: SkillCategory.FRONTEND,
    level: 'Production-Ready',
    sortOrder: 1,
  });

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      if (selectedCat !== 'ALL' && s.category !== selectedCat) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          (s.level && s.level.toLowerCase().includes(q)) ||
          s.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [skills, selectedCat, searchQuery]);

  const handleOpenCreate = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: selectedCat === 'ALL' ? SkillCategory.FRONTEND : selectedCat,
      level: 'Production-Ready',
      sortOrder: skills.length + 1,
    });
    setError(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (skill: SkillData) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level || '',
      sortOrder: skill.sortOrder,
    });
    setError(null);
    setOpenDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await saveSkill({
        id: editingSkill?.id,
        name: formData.name,
        category: formData.category,
        level: formData.level,
        sortOrder: Number(formData.sortOrder),
      });

      setOpenDialog(false);
      setToast(editingSkill ? 'Skill specification updated.' : 'New skill indexed.');
      router.refresh();
      window.location.reload();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to save skill.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteSkill(deleteTarget.id);
    setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setToast(`Removed "${deleteTarget.name}" from stack.`);
    setDeleteTarget(null);
    router.refresh();
  };

  const getCategoryColor = (cat: SkillCategory) =>
    categories.find((c) => c.value === cat)?.color || '#6366F1';

  return (
    <Box>
      {/* Header */}
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
              color: '#38BDF8',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}
          >
            MODULE 03 // CAPABILITY TAXONOMY
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mt: 0.5 }}>
            Technical Stack Matrix ({skills.length})
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Index New Skill
        </Button>
      </Stack>

      {/* Domain Distribution Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {categories.map((cat) => {
          const count = skills.filter((s) => s.category === cat.value).length;
          return (
            <Grid key={cat.value} size={{ xs: 6, sm: 4, md: 2.4 }}>
              <Paper
                elevation={0}
                onClick={() =>
                  setSelectedCat((prev) => (prev === cat.value ? 'ALL' : cat.value))
                }
                sx={{
                  p: 2,
                  bgcolor: '#0B0E17',
                  border:
                    selectedCat === cat.value
                      ? `1px solid ${cat.color}`
                      : '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: `${cat.color}88`,
                  },
                }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.75 }}>
                  <Box
                    sx={{ width: 7, height: 7, borderRadius: '2px', bgcolor: cat.color }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.65rem',
                      color: '#94A3B8',
                      fontWeight: 600,
                    }}
                  >
                    {cat.value}
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#F8FAFC',
                    lineHeight: 1,
                  }}
                >
                  {String(count).padStart(2, '0')}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
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
            <Button
              size="small"
              onClick={() => setSelectedCat('ALL')}
              sx={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.72rem',
                px: 1.5,
                py: 0.5,
                bgcolor: selectedCat === 'ALL' ? 'rgba(99, 102, 241, 0.14)' : 'transparent',
                color: selectedCat === 'ALL' ? 'primary.main' : '#94A3B8',
                border:
                  selectedCat === 'ALL'
                    ? '1px solid rgba(99, 102, 241, 0.35)'
                    : '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              ALL DOMAINS
            </Button>
            {categories.map((cat) => {
              const active = selectedCat === cat.value;
              return (
                <Button
                  key={cat.value}
                  size="small"
                  onClick={() => setSelectedCat(cat.value)}
                  sx={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.72rem',
                    px: 1.5,
                    py: 0.5,
                    bgcolor: active ? `${cat.color}1F` : 'transparent',
                    color: active ? cat.color : '#94A3B8',
                    border: active
                      ? `1px solid ${cat.color}66`
                      : '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {cat.label}
                </Button>
              );
            })}
          </Stack>

          <TextField
            size="small"
            placeholder="Search capability or proficiency..."
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

      {/* Skills Table */}
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
                <TableCell sx={{ width: 90 }}>Index</TableCell>
                <TableCell>Capability / Technology</TableCell>
                <TableCell>Architecture Domain</TableCell>
                <TableCell>Proficiency Tier</TableCell>
                <TableCell align="right">Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSkills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 7, color: 'text.secondary' }}>
                    No skills match the active filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSkills.map((s) => {
                  const color = getCategoryColor(s.category);
                  return (
                    <TableRow
                      key={s.id}
                      sx={{
                        transition: 'background-color 0.15s ease',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontFamily: 'var(--font-mono), monospace',
                          color: '#64748B',
                          fontSize: '0.78rem',
                        }}
                      >
                        #{String(s.sortOrder).padStart(2, '0')}
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                          {s.name}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={s.category}
                          size="small"
                          sx={{
                            height: 22,
                            fontFamily: 'var(--font-mono), monospace',
                            bgcolor: `${color}1A`,
                            color,
                            border: `1px solid ${color}40`,
                            fontWeight: 700,
                            fontSize: '0.68rem',
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: 'var(--font-mono), monospace',
                            color: '#94A3B8',
                            px: 1,
                            py: 0.35,
                            borderRadius: '4px',
                            bgcolor: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                          }}
                        >
                          {s.level || 'Production-Ready'}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(s)}
                          sx={{ color: '#94A3B8', '&:hover': { color: 'primary.main' } }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => setDeleteTarget(s)}
                          sx={{ color: '#94A3B8', '&:hover': { color: '#FB7185' } }}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog Modal Form */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {editingSkill ? `Edit Capability // ${editingSkill.name}` : 'Index New Technical Capability'}
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2.5 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                label="Technology / Capability Name"
                required
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Next.js 16 (App Router)"
              />

              <TextField
                select
                label="Architecture Domain"
                required
                fullWidth
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as SkillCategory })}
              >
                {categories.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Proficiency Tier / Context (Optional)"
                fullWidth
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                placeholder="e.g. Core Stack, Advanced, Production-Ready"
              />

              <TextField
                label="Display Sort Order"
                type="number"
                required
                fullWidth
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Save Capability'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Remove Capability</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Remove{' '}
            <Box component="span" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
              {deleteTarget?.name}
            </Box>{' '}
            from the technical stack matrix?
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
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast(null)} message={toast} />
    </Box>
  );
}

'use client';

import React, { useState } from 'react';
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
  Alert,
  CircularProgress,
  Grid,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { saveExperience, deleteExperience } from '@/lib/admin-actions';

interface ExperienceData {
  id: string;
  title: string;
  organization: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
}

export default function ExperienceManager({
  initialExperiences,
}: {
  initialExperiences: ExperienceData[];
}) {
  const router = useRouter();
  const [experiences, setExperiences] = useState<ExperienceData[]>(initialExperiences);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExperienceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    description: '',
    startDate: new Date().toISOString().substring(0, 10),
    endDate: '',
    isCurrent: true,
  });

  const activeCount = experiences.filter((e) => e.isCurrent).length;
  const pastCount = experiences.length - activeCount;

  const handleOpenCreate = () => {
    setEditingExp(null);
    setFormData({
      title: '',
      organization: '',
      description: '',
      startDate: new Date().toISOString().substring(0, 10),
      endDate: '',
      isCurrent: true,
    });
    setError(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (exp: ExperienceData) => {
    setEditingExp(exp);
    setFormData({
      title: exp.title,
      organization: exp.organization,
      description: exp.description,
      startDate: new Date(exp.startDate).toISOString().substring(0, 10),
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().substring(0, 10) : '',
      isCurrent: exp.isCurrent,
    });
    setError(null);
    setOpenDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await saveExperience({
        id: editingExp?.id,
        title: formData.title,
        organization: formData.organization,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        isCurrent: formData.isCurrent,
      });

      setOpenDialog(false);
      setToast(editingExp ? 'Career record updated.' : 'New career milestone added.');
      router.refresh();
      window.location.reload();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to save experience.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteExperience(deleteTarget.id);
    setExperiences((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setToast(`Removed "${deleteTarget.title}".`);
    setDeleteTarget(null);
    router.refresh();
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(new Date(date));

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
              color: '#10B981',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}
          >
            MODULE 04 // CHRONOLOGICAL TRACK RECORD
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mt: 0.5 }}>
            Career & Experience Log ({experiences.length})
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Log Career Milestone
        </Button>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'TOTAL MILESTONES', value: experiences.length, color: '#F8FAFC' },
          { label: 'ACTIVE TENURE', value: activeCount, color: '#10B981' },
          { label: 'COMPLETED ROLES', value: pastCount, color: '#38BDF8' },
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
                <TableCell>Role & Engineering Scope</TableCell>
                <TableCell>Organization</TableCell>
                <TableCell>Tenure Window</TableCell>
                <TableCell align="right">Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {experiences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 7, color: 'text.secondary' }}>
                    No career experience entries logged yet.
                  </TableCell>
                </TableRow>
              ) : (
                experiences.map((exp) => (
                  <TableRow
                    key={exp.id}
                    sx={{
                      transition: 'background-color 0.15s ease',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                        {exp.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          maxWidth: 460,
                        }}
                      >
                        {exp.description}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#E2E8F0', fontWeight: 600 }}>
                        {exp.organization}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          exp.isCurrent
                            ? `${formatDate(exp.startDate)} — PRESENT`
                            : `${formatDate(exp.startDate)} — ${exp.endDate ? formatDate(exp.endDate) : ''}`
                        }
                        size="small"
                        sx={{
                          height: 22,
                          fontFamily: 'var(--font-mono), monospace',
                          bgcolor: exp.isCurrent
                            ? 'rgba(16, 185, 129, 0.12)'
                            : 'rgba(255, 255, 255, 0.04)',
                          color: exp.isCurrent ? '#34D399' : '#94A3B8',
                          border: exp.isCurrent
                            ? '1px solid rgba(16, 185, 129, 0.28)'
                            : '1px solid rgba(255, 255, 255, 0.08)',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(exp)}
                        sx={{ color: '#94A3B8', '&:hover': { color: 'primary.main' } }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setDeleteTarget(exp)}
                        sx={{ color: '#94A3B8', '&:hover': { color: '#FB7185' } }}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog Modal Form */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {editingExp ? `Edit Career Entry // ${editingExp.title}` : 'Log New Career Milestone'}
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2.5 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                label="Role / Position Title"
                required
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Fullstack Engineer"
              />

              <TextField
                label="Company / Organization"
                required
                fullWidth
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. Acme Systems Inc."
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Start Date"
                  type="date"
                  required
                  fullWidth
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />

                {!formData.isCurrent && (
                  <TextField
                    label="End Date"
                    type="date"
                    required={!formData.isCurrent}
                    fullWidth
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              </Stack>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isCurrent}
                    onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                    color="primary"
                  />
                }
                label="Currently active in this role"
              />

              <TextField
                label="Architectural Scope & Key Deliverables"
                required
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                helperText="Describe systems engineered, performance improvements, and leadership scope."
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Save Milestone'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Remove Career Record</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Permanently remove{' '}
            <Box component="span" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
              {deleteTarget?.title}
            </Box>{' '}
            at {deleteTarget?.organization}?
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

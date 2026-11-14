'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  Chip,
} from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { updateProfile } from '@/lib/admin-actions';

interface ProfileData {
  id: string;
  fullName: string;
  role: string;
  headline: string;
  biography: string;
  location: string | null;
  avatarUrl: string | null;
  cvUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  emailPublic: string | null;
}

export default function ProfileManager({ initialProfile }: { initialProfile: ProfileData | null }) {
  const [formData, setFormData] = useState({
    fullName: initialProfile?.fullName || 'Dzulfikar Tadah',
    role: initialProfile?.role || 'Fullstack Software Engineer',
    headline: initialProfile?.headline || '',
    biography: initialProfile?.biography || '',
    location: initialProfile?.location || 'Indonesia',
    emailPublic: initialProfile?.emailPublic || 'contact@dzulfikar.dev',
    githubUrl: initialProfile?.githubUrl || 'https://github.com/nelsfikar-dotcom',
    linkedinUrl: initialProfile?.linkedinUrl || 'https://linkedin.com',
    cvUrl: initialProfile?.cvUrl || '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      await updateProfile({
        fullName: formData.fullName,
        role: formData.role,
        headline: formData.headline,
        biography: formData.biography,
        location: formData.location || undefined,
        emailPublic: formData.emailPublic || undefined,
        githubUrl: formData.githubUrl || undefined,
        linkedinUrl: formData.linkedinUrl || undefined,
        cvUrl: formData.cvUrl || undefined,
      });

      setSuccess('Operator identity synchronized across all public routes.');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3.5 }}>
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'var(--font-mono), monospace',
            color: 'primary.main',
            fontWeight: 700,
            letterSpacing: '0.1em',
          }}
        >
          MODULE 07 // PUBLIC IDENTITY & METADATA
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mt: 0.5 }}>
          Operator Identity Configuration
        </Typography>
      </Box>

      <Grid container spacing={3.5} sx={{ alignItems: 'flex-start' }}>
        {/* Left Column: Configuration Form */}
        <Grid size={{ xs: 12, lg: 7.5 }}>
          <Paper
            elevation={0}
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: { xs: 3, md: 4 },
              bgcolor: '#0B0E17',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
            }}
          >
            <Stack spacing={3}>
              {success && (
                <Alert
                  severity="success"
                  sx={{
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    color: '#34D399',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  {success}
                </Alert>
              )}
              {error && <Alert severity="error">{error}</Alert>}

              <Typography
                variant="caption"
                sx={{ fontFamily: 'var(--font-mono), monospace', color: '#64748B', fontWeight: 700 }}
              >
                01 // CORE IDENTITY & NARRATIVE
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <TextField
                  label="Full Name"
                  required
                  fullWidth
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                <TextField
                  label="Primary Engineering Title"
                  required
                  fullWidth
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </Stack>

              <TextField
                label="Hero Value Proposition (Headline)"
                required
                fullWidth
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                helperText="Primary statement displayed on the public overview."
              />

              <TextField
                label="Executive Biography"
                required
                multiline
                rows={5}
                fullWidth
                value={formData.biography}
                onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                helperText="Architectural philosophy, specialization, and track record shown on /about."
              />

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)' }} />

              <Typography
                variant="caption"
                sx={{ fontFamily: 'var(--font-mono), monospace', color: '#64748B', fontWeight: 700 }}
              >
                02 // PUBLIC ENDPOINTS & ARTIFACTS
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <TextField
                  label="Location / Timezone"
                  fullWidth
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <TextField
                  label="Public Contact Email"
                  fullWidth
                  value={formData.emailPublic}
                  onChange={(e) => setFormData({ ...formData, emailPublic: e.target.value })}
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <TextField
                  label="GitHub Profile URL"
                  fullWidth
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                />
                <TextField
                  label="LinkedIn Profile URL"
                  fullWidth
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                />
              </Stack>

              <TextField
                label="Resume / CV Document URL"
                fullWidth
                value={formData.cvUrl}
                onChange={(e) => setFormData({ ...formData, cvUrl: e.target.value })}
                placeholder="https://..."
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} color="inherit" /> : <SaveOutlinedIcon />
                }
                sx={{ alignSelf: 'flex-start', px: 3.5 }}
              >
                {loading ? 'Synchronizing...' : 'Commit Identity Changes'}
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column: Live Public Card Preview */}
        <Grid size={{ xs: 12, lg: 4.5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3.5,
              bgcolor: '#0B0E17',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              backgroundImage:
                'radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.06) 0%, transparent 55%)',
            }}
          >
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'primary.main',
                  fontWeight: 700,
                }}
              >
                LIVE PREVIEW // PUBLIC DOSSIER CARD
              </Typography>
              <Chip
                label="REALTIME"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono), monospace',
                  bgcolor: 'rgba(16, 185, 129, 0.14)',
                  color: '#34D399',
                }}
              />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2.5 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '10px',
                  bgcolor: '#6366F1',
                  color: '#06080D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono), monospace',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                }}
              >
                {formData.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'DT'}
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {formData.fullName || 'Your Name'}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontFamily: 'var(--font-mono), monospace', color: 'primary.main' }}
                >
                  {formData.role || 'Software Engineer'}
                </Typography>
              </Box>
            </Stack>

            <Typography
              variant="body2"
              sx={{ color: '#E2E8F0', fontWeight: 600, mb: 1.5, lineHeight: 1.5 }}
            >
              {formData.headline || 'Headline preview will appear here...'}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.7,
                mb: 2.5,
              }}
            >
              {formData.biography || 'Biography preview...'}
            </Typography>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)', mb: 2 }} />

            <Stack spacing={1.25}>
              <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', color: '#94A3B8' }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 16, color: '#38BDF8' }} />
                <Typography variant="caption">{formData.location || 'Unset'}</Typography>
              </Stack>
              <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', color: '#94A3B8' }}>
                <EmailOutlinedIcon sx={{ fontSize: 16, color: '#6366F1' }} />
                <Typography variant="caption" sx={{ fontFamily: 'var(--font-mono), monospace' }}>
                  {formData.emailPublic || 'Unset'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', color: '#94A3B8' }}>
                <GitHubIcon sx={{ fontSize: 15, color: '#E2E8F0' }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'var(--font-mono), monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formData.githubUrl || 'Not configured'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', color: '#94A3B8' }}>
                <LinkedInIcon sx={{ fontSize: 15, color: '#38BDF8' }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'var(--font-mono), monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formData.linkedinUrl || 'Not configured'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', color: '#94A3B8' }}>
                <DescriptionOutlinedIcon sx={{ fontSize: 15, color: '#10B981' }} />
                <Typography variant="caption" sx={{ fontFamily: 'var(--font-mono), monospace' }}>
                  {formData.cvUrl ? 'CV Artifact Linked' : 'No CV URL linked'}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

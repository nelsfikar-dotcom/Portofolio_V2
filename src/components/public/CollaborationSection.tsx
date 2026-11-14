'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Alert,
  MenuItem,
  Stack,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

const PROJECT_TYPES = [
  'Web Application (Full-Stack)',
  'Company Profile / Landing Page',
  'UI/UX Design & Prototyping',
  'REST API / Backend Architecture',
  'Technical Consultation',
];

const BUDGET_RANGES = [
  '< Rp 3.000.000',
  'Rp 3.000.000 - Rp 7.500.000',
  'Rp 7.500.000 - Rp 15.000.000',
  '> Rp 15.000.000',
  'Diskusikan Lebih Lanjut',
];

export default function CollaborationSection({
  email = 'dzullfkar.t@gmail.com',
  github = 'https://github.com/nelsfikar-dotcom',
  linkedin = 'https://www.linkedin.com/in/dzulfikar-tadah-b52619426/',
}: {
  email?: string;
  github?: string;
  linkedin?: string;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: '',
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, text: '' });

    const subjectParts = [
      formData.projectType || 'General Inquiry',
      formData.budget ? `Budget: ${formData.budget}` : '',
    ].filter(Boolean);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: subjectParts.join(' | '),
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim pesan');
      }

      setStatus({
        type: 'success',
        text: 'Pesan Anda berhasil dikirim! Saya akan merespons dalam waktu kurang dari 24 jam.',
      });
      setFormData({
        name: '',
        email: '',
        projectType: '',
        budget: '',
        message: '',
      });
    } catch (err: unknown) {
      setStatus({
        type: 'error',
        text: err instanceof Error ? err.message : 'Terjadi kesalahan saat mengirim pesan.',
      });
    } finally {
      setLoading(false);
    }
  };

  const directContacts = [
    {
      label: 'GitHub',
      value: '@NelsFikar',
      href: github,
      icon: <GitHubIcon sx={{ fontSize: 19, color: 'var(--text-main)' }} />,
      bg: 'var(--surface-subtle)',
    },
    {
      label: 'Instagram',
      value: '@dzulfkar._',
      href: 'https://www.instagram.com/dzulfkar._',
      icon: <InstagramIcon sx={{ fontSize: 19, color: '#EC4899' }} />,
      bg: 'rgba(236, 72, 153, 0.12)',
    },
    {
      label: 'LinkedIn',
      value: 'Dzulfikar Tadah',
      href: linkedin,
      icon: <LinkedInIcon sx={{ fontSize: 19, color: '#0EA5E9' }} />,
      bg: 'rgba(14, 165, 233, 0.12)',
    },
    {
      label: 'Email / Gmail',
      value: email,
      href: `mailto:${email}`,
      icon: <EmailOutlinedIcon sx={{ fontSize: 19, color: '#F59E0B' }} />,
      bg: 'rgba(245, 158, 11, 0.12)',
    },
    {
      label: 'WhatsApp (WA)',
      value: 'Chat langsung via WhatsApp',
      href: 'https://wa.me/6285705291761',
      icon: <WhatsAppIcon sx={{ fontSize: 19, color: '#10B981' }} />,
      bg: 'rgba(16, 185, 129, 0.12)',
    },
  ];

  return (
    <Box component="section">
      <Box sx={{ mb: 5 }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'primary.main',
            letterSpacing: '0.1em',
            mb: 0.75,
          }}
        >
          {'COLLABORATION // DIRECT DISPATCH'}
        </Typography>
        <Typography
          variant="h2"
          className="gradient-text"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.85rem', md: '2.5rem' },
            mb: 1,
          }}
        >
          Diskusi & Pengajuan Proyek
        </Typography>
        <Typography sx={{ color: 'var(--text-muted)', maxWidth: 580, fontSize: '0.95rem' }}>
          Punya ide proyek atau tawaran kolaborasi? Hubungi saya melalui 5 kanal langsung atau isi
          formulir di bawah ini.
        </Typography>
      </Box>

      <Grid container spacing={3.5}>
        {/* Left: 5 Direct Channels (GitHub, Instagram, LinkedIn, Email/Gmail, WA) */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3.5,
              borderRadius: '18px',
              bgcolor: 'var(--surface-card)',
              border: '1px solid var(--border-card)',
              height: '100%',
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', mb: 0.5 }}>
              Connect With Me
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.82rem', mb: 2.5 }}>
              5 saluran komunikasi resmi yang aktif setiap hari
            </Typography>

            <Stack spacing={1.5}>
              {directContacts.map((contact) => (
                <Box
                  key={contact.label}
                  component="a"
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    p: 1.75,
                    borderRadius: '12px',
                    bgcolor: 'var(--surface-elevated)',
                    border: '1px solid var(--border-card)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.75,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'rgba(16, 185, 129, 0.45)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      bgcolor: contact.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {contact.icon}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                      {contact.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.76rem',
                        color: 'var(--text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {contact.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Right: Project Inquiry Form */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: '18px',
              bgcolor: 'var(--surface-card)',
              border: '1px solid var(--border-card)',
              height: '100%',
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)', mb: 0.5 }}>
              Kirim Pesan / Pengajuan Proyek
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.84rem', mb: 3 }}>
              Pesan akan langsung masuk ke sistem inbox Admin Dashboard
            </Typography>

            {status.type && (
              <Alert
                severity={status.type}
                sx={{
                  mb: 3,
                  borderRadius: '10px',
                }}
              >
                {status.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2.25}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', mb: 0.75 }}>
                    Nama Lengkap *
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    placeholder="Nama Anda"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    size="small"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', mb: 0.75 }}>
                    Email / Gmail *
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    type="email"
                    placeholder="nama@gmail.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    size="small"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', mb: 0.75 }}>
                    Kategori Kebutuhan *
                  </Typography>
                  <TextField
                    select
                    required
                    fullWidth
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    disabled={loading}
                    size="small"
                    slotProps={{ select: { displayEmpty: true } }}
                  >
                    <MenuItem value="" disabled>
                      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                        Pilih kategori
                      </Typography>
                    </MenuItem>
                    {PROJECT_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', mb: 0.75 }}>
                    Estimasi Budget (Opsional)
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    disabled={loading}
                    size="small"
                    slotProps={{ select: { displayEmpty: true } }}
                  >
                    <MenuItem value="">
                      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                        Pilih kisaran budget
                      </Typography>
                    </MenuItem>
                    {BUDGET_RANGES.map((b) => (
                      <MenuItem key={b} value={b}>
                        {b}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', mb: 0.75 }}>
                    Detail Pesan / Proyek *
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Jelaskan kebutuhan sistem, fitur utama, atau timeline yang direncanakan..."
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={<SendRoundedIcon />}
                    sx={{ py: 1.35, borderRadius: '10px', fontSize: '0.9rem' }}
                  >
                    {loading ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

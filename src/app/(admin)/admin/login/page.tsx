'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TerminalIcon from '@mui/icons-material/Terminal';
import Link from 'next/link';
import { handleLogin } from '@/lib/admin-actions';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await handleLogin(null, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#06080D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          component="form"
          onSubmit={onSubmit}
          sx={{
            p: { xs: 3.5, sm: 4.5 },
            bgcolor: '#0B0E17',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '14px',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.65)',
          }}
        >
          {/* Console Top Status */}
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 2,
              mb: 3,
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <TerminalIcon sx={{ fontSize: 15, color: 'primary.main' }} />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: '#94A3B8',
                  fontWeight: 700,
                  fontSize: '0.68rem',
                }}
              >
                DZULFIKAR.OS // AUTH_GATE
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
              <Box
                className="pulse-indicator"
                sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981' }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: '#64748B',
                  fontSize: '0.64rem',
                }}
              >
                TLS_READY
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={2} sx={{ mb: 3.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '10px',
                bgcolor: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main',
              }}
            >
              <LockOutlinedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h2" sx={{ fontSize: '1.45rem', fontWeight: 800 }}>
                Operator Authentication
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.84rem' }}>
                Verify credentials to access the portfolio content control plane.
              </Typography>
            </Box>
          </Stack>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                bgcolor: 'rgba(244, 63, 94, 0.1)',
                color: '#FB7185',
                border: '1px solid rgba(244, 63, 94, 0.3)',
              }}
            >
              {error}
            </Alert>
          )}

          <Stack spacing={2.25}>
            <TextField
              label="Operator Email"
              name="email"
              type="email"
              required
              fullWidth
              defaultValue="admin@dzulfikar.dev"
            />

            <TextField
              label="Access Passphrase"
              name="password"
              type="password"
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ py: 1.25, mt: 0.5 }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Initialize Session →'}
            </Button>
          </Stack>

          <Box
            sx={{
              mt: 3.5,
              pt: 2.5,
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              textAlign: 'center',
            }}
          >
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button
                size="small"
                startIcon={<ArrowBackIcon sx={{ fontSize: 15 }} />}
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
              >
                Return to Public Interface
              </Button>
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

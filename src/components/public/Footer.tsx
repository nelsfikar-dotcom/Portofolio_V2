'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
  Stack,
  IconButton,
  Divider,
  Grid,
  Button,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import MotionFadeUp from '@/components/public/MotionFadeUp';

const quickLinks = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Skills', href: '/skills' },
  { label: 'Experience', href: '/experience' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
];

const directSocials = [
  {
    label: 'GitHub',
    href: 'https://github.com/nelsfikar-dotcom',
    icon: <GitHubIcon sx={{ fontSize: 18 }} />,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/dzulfkar._',
    icon: <InstagramIcon sx={{ fontSize: 18 }} />,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/dzulfikar-tadah-b52619426/',
    icon: <LinkedInIcon sx={{ fontSize: 18 }} />,
  },
  {
    label: 'Email / Gmail',
    href: 'mailto:dzullfkar.t@gmail.com',
    icon: <EmailOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/6285705291761',
    icon: <WhatsAppIcon sx={{ fontSize: 18 }} />,
  },
];

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        mt: 12,
        pt: 8,
        pb: 5,
        bgcolor: 'var(--footer-bg)',
        borderTop: '1px solid var(--border-card)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -1,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(640px, 85%)',
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.45) 50%, transparent 100%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg">
        <MotionFadeUp yOffset={10} duration={0.45}>
          <Grid container spacing={{ xs: 4, md: 5 }} sx={{ mb: 6, alignItems: 'flex-start' }}>
            {/* Column 1: Identity & 5 Core Social Channels */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    position: 'relative',
                    width: 38,
                    height: 38,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1.5px solid rgba(16, 185, 129, 0.5)',
                    bgcolor: '#0B111E',
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src="/me1.png"
                    alt="Dzulfikar Tadah"
                    fill
                    sizes="38px"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center 25%',
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      color: 'var(--text-main)',
                      lineHeight: 1.2,
                    }}
                  >
                    Dzulfikar Tadah
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.74rem',
                      color: 'var(--emerald-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                    }}
                  >
                    Full-Stack Software Engineer
                  </Typography>
                </Box>
              </Stack>

              <Typography
                variant="body2"
                sx={{
                  color: 'var(--text-muted)',
                  maxWidth: 360,
                  lineHeight: 1.75,
                  mb: 2.75,
                }}
              >
                Membangun aplikasi web modern dengan arsitektur bersih, tipe data ketat, dan
                pengalaman pengguna yang presisi.
              </Typography>

              <Stack direction="row" spacing={1}>
                {directSocials.map((item) => (
                  <IconButton
                    key={item.label}
                    component="a"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    title={item.label}
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '10px',
                      bgcolor: 'var(--surface-elevated)',
                      border: '1px solid var(--border-card)',
                      color: 'var(--text-muted)',
                      transition:
                        'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
                      '&:hover': {
                        color: 'var(--emerald-primary)',
                        borderColor: 'rgba(16, 185, 129, 0.45)',
                        bgcolor: 'rgba(16, 185, 129, 0.08)',
                        transform: 'translateY(-3px)',
                      },
                    }}
                  >
                    {item.icon}
                  </IconButton>
                ))}
              </Stack>
            </Grid>

            {/* Column 2: Focused Navigation */}
            <Grid size={{ xs: 12, sm: 5, md: 3 }}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.73rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  mb: 2.25,
                }}
              >
                Navigasi
              </Typography>
              <Grid container spacing={1.25}>
                {quickLinks.map((item) => (
                  <Grid key={item.href} size={{ xs: 6 }}>
                    <Link
                      href={item.href}
                      style={{ textDecoration: 'none', display: 'inline-block' }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          position: 'relative',
                          display: 'inline-block',
                          color: 'var(--text-muted)',
                          fontSize: '0.86rem',
                          fontWeight: 500,
                           pb: 0.25,
                          transition: 'color 0.2s ease',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: '14px',
                            height: '1.5px',
                            borderRadius: '2px',
                            bgcolor: 'var(--emerald-primary)',
                            opacity: 0,
                            transform: 'scaleX(0.5)',
                            transformOrigin: 'left center',
                            transition:
                              'opacity 0.2s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                          },
                          '&:hover': {
                            color: 'var(--text-main)',
                            '&::after': {
                              opacity: 1,
                              transform: 'scaleX(1)',
                            },
                          },
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Column 3: Personal Contact Invitation */}
            <Grid size={{ xs: 12, sm: 7, md: 4 }}>
              <Box
                sx={{
                  p: 2.75,
                  borderRadius: '14px',
                  bgcolor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-card)',
                }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      bgcolor: 'var(--emerald-primary)',
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: 'var(--emerald-primary)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Tersedia untuk kolaborasi
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: '1.08rem',
                    color: 'var(--text-main)',
                    mb: 0.75,
                  }}
                >
                  Punya ide proyek? Mari ngobrol.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'var(--text-muted)',
                    fontSize: '0.83rem',
                    lineHeight: 1.65,
                    mb: 2.25,
                  }}
                >
                  Diskusikan kebutuhan aplikasi web, arsitektur sistem, atau peluang kerja sama
                  langsung bersama saya.
                </Typography>

                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}
                >
                  <Link href="/contact" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<ArrowOutwardIcon sx={{ fontSize: 15 }} />}
                      sx={{
                        borderRadius: '9px',
                        px: 2,
                        py: 0.75,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      Hubungi Saya
                    </Button>
                  </Link>

                  <Typography
                    component="a"
                    href="mailto:dzullfkar.t@gmail.com"
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: 'var(--emerald-primary)',
                      },
                    }}
                  >
                    dzullfkar.t@gmail.com
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'var(--border-card)', mb: 3 }} />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
              © 2026 Dzulfikar Tadah (@NelsFikar). Dirancang & dibangun dengan Next.js & Prisma.
            </Typography>

            <Button
              onClick={scrollToTop}
              size="small"
              variant="outlined"
              startIcon={
                <KeyboardArrowUpIcon
                  sx={{
                    fontSize: 17,
                    transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              }
              sx={{
                borderRadius: '8px',
                fontSize: '0.75rem',
                py: 0.5,
                px: 1.5,
                borderColor: 'var(--border-card)',
                color: 'var(--text-muted)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'var(--text-main)',
                  borderColor: 'rgba(16, 185, 129, 0.4)',
                  bgcolor: 'var(--surface-elevated)',
                  '& .MuiButton-startIcon svg': {
                    transform: 'translateY(-2px)',
                  },
                },
              }}
            >
              Ke Atas
            </Button>
          </Stack>
        </MotionFadeUp>
      </Container>
    </Box>
  );
}

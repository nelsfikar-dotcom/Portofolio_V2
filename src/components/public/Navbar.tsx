'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Container,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useColorMode } from '@/theme/theme';

const navLinks = [
  { title: 'Home', path: '/' },
  { title: 'About', path: '/about' },
  { title: 'Projects', path: '/projects' },
  { title: 'Skills', path: '/skills' },
  { title: 'Experience', path: '/experience' },
  { title: 'Journal', path: '/journal' },
  { title: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleColorMode } = useColorMode();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: 1100,
          bgcolor: 'var(--navbar-bg)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-card)',
          color: 'var(--text-main)',
        }}
      >
        {/* Thin Scroll Progress Indicator */}
        <Box
          component={motion.div}
          style={{ scaleX, transformOrigin: '0% 50%' }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)',
            zIndex: 1200,
            pointerEvents: 'none',
          }}
        />
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 74 } }}>
            {/* Left Brand Emblem with Profile Photo */}
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: 'center',
                  '&:hover .navbar-avatar-img': {
                    transform: 'scale(1.08)',
                  },
                  '&:hover .navbar-avatar-box': {
                    borderColor: '#10B981',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
                  },
                }}
              >
                <Box
                  className="navbar-avatar-box"
                  sx={{
                    position: 'relative',
                    width: 40,
                    height: 40,
                    borderRadius: '11px',
                    overflow: 'hidden',
                    border: '1.5px solid rgba(16, 185, 129, 0.55)',
                    bgcolor: '#0B111E',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.22)',
                    transition: 'border-color 0.22s ease, box-shadow 0.22s ease',
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src="/me1.png"
                    alt="Dzulfikar Tadah"
                    fill
                    sizes="40px"
                    className="navbar-avatar-img"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center 25%',
                      transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.98rem',
                      color: 'var(--text-main)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.15,
                    }}
                  >
                    Dzulfikar Tadah
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: 'primary.main',
                      fontWeight: 600,
                    }}
                  >
                    @NelsFikar // ENGINEER
                  </Typography>
                </Box>
              </Stack>
            </Link>

            {/* Center Navigation Links (Desktop) */}
            {!isMobile && (
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                {navLinks.map((link) => {
                  const isActive =
                    link.path === '/' ? pathname === '/' : pathname.startsWith(link.path);
                  return (
                    <Link key={link.path} href={link.path} style={{ textDecoration: 'none' }}>
                      <Box
                        sx={{
                          px: 1.75,
                          py: 0.85,
                          borderRadius: '8px',
                          position: 'relative',
                          color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                          bgcolor: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.85rem',
                          transition: 'all 0.18s ease',
                          '&:hover': {
                            color: 'var(--text-main)',
                            bgcolor: isActive
                              ? 'rgba(16, 185, 129, 0.16)'
                              : 'var(--surface-subtle)',
                          },
                        }}
                      >
                        {link.title}
                        {isActive && (
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 3,
                              left: '25%',
                              right: '25%',
                              height: 2,
                              borderRadius: 2,
                              bgcolor: '#10B981',
                            }}
                          />
                        )}
                      </Box>
                    </Link>
                  );
                })}
              </Stack>
            )}

            {/* Right Actions: Theme Mode Toggle + Hire Me (GitHub) */}
            <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
              <IconButton
                onClick={toggleColorMode}
                aria-label="Toggle Light/Dark Mode"
                title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  border: '1px solid var(--border-card)',
                  bgcolor: 'var(--surface-subtle)',
                  color: mode === 'dark' ? '#FBBF24' : '#0284C7',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#10B981',
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    transform: 'rotate(15deg)',
                  },
                }}
              >
                {mode === 'dark' ? (
                  <LightModeOutlinedIcon sx={{ fontSize: 19 }} />
                ) : (
                  <DarkModeOutlinedIcon sx={{ fontSize: 19 }} />
                )}
              </IconButton>

              <Button
                component="a"
                href="https://github.com/nelsfikar-dotcom"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                variant="contained"
                startIcon={<GitHubIcon sx={{ fontSize: 16 }} />}
                sx={{
                  borderRadius: '10px',
                  px: 2,
                  py: 0.8,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                Hire Me
              </Button>

              {isMobile && (
                <IconButton
                  onClick={handleDrawerToggle}
                  aria-label="Open navigation"
                  sx={{
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-card)',
                    borderRadius: '9px',
                  }}
                >
                  <MenuIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: 'var(--bg-obsidian)',
            borderLeft: '1px solid var(--border-card)',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
          >
            <Typography sx={{ fontWeight: 800, color: 'var(--text-main)' }}>Navigation</Typography>
            <IconButton onClick={handleDrawerToggle} size="small" sx={{ color: 'var(--text-muted)' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
          <List disablePadding>
            {navLinks.map((item) => {
              const isActive =
                item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
              return (
                <ListItem key={item.path} disablePadding sx={{ mb: 0.75 }}>
                  <ListItemButton
                    component={Link}
                    href={item.path}
                    onClick={handleDrawerToggle}
                    sx={{
                      borderRadius: '10px',
                      bgcolor: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                      color: isActive ? 'primary.main' : 'var(--text-muted)',
                      border: isActive
                        ? '1px solid rgba(16, 185, 129, 0.3)'
                        : '1px solid transparent',
                    }}
                  >
                    <ListItemText
                      primary={item.title}
                      slotProps={{
                        primary: { sx: { fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' } },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

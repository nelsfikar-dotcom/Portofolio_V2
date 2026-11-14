'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Stack,
  Dialog,
  TextField,
  InputAdornment,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';
import BoltIcon from '@mui/icons-material/Bolt';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import PublicIcon from '@mui/icons-material/Public';
import { handleLogout } from '@/lib/admin-actions';

const drawerWidth = 268;

interface NavItem {
  text: string;
  code: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
  group: 'WORKSPACE' | 'CONTENT ENGINE' | 'IDENTITY & INBOX';
}

const menuItems: NavItem[] = [
  {
    text: 'Overview & Telemetry',
    code: '01',
    subtitle: 'Metrics, pipeline & system health',
    icon: <DashboardOutlinedIcon sx={{ fontSize: 19 }} />,
    href: '/admin',
    group: 'WORKSPACE',
  },
  {
    text: 'Projects Registry',
    code: '02',
    subtitle: 'Case studies & deployments',
    icon: <FolderCopyOutlinedIcon sx={{ fontSize: 19 }} />,
    href: '/admin/projects',
    group: 'CONTENT ENGINE',
  },
  {
    text: 'Technical Stack',
    code: '03',
    subtitle: 'Skills, tools & architecture',
    icon: <TerminalOutlinedIcon sx={{ fontSize: 19 }} />,
    href: '/admin/skills',
    group: 'CONTENT ENGINE',
  },
  {
    text: 'Career Timeline',
    code: '04',
    subtitle: 'Roles & organizations',
    icon: <BusinessCenterOutlinedIcon sx={{ fontSize: 19 }} />,
    href: '/admin/experience',
    group: 'CONTENT ENGINE',
  },
  {
    text: 'Engineering Journal',
    code: '05',
    subtitle: 'Articles & technical notes',
    icon: <ArticleOutlinedIcon sx={{ fontSize: 19 }} />,
    href: '/admin/journal',
    group: 'CONTENT ENGINE',
  },
  {
    text: 'Inbound Dispatch',
    code: '06',
    subtitle: 'Direct inquiries & messages',
    icon: <MarkEmailUnreadOutlinedIcon sx={{ fontSize: 19 }} />,
    href: '/admin/messages',
    group: 'IDENTITY & INBOX',
  },
  {
    text: 'Operator Identity',
    code: '07',
    subtitle: 'Bio, social links & resume',
    icon: <BadgeOutlinedIcon sx={{ fontSize: 19 }} />,
    href: '/admin/profile',
    group: 'IDENTITY & INBOX',
  },
];

const commandLinks = [
  ...menuItems.map((m) => ({
    label: m.text,
    desc: m.subtitle,
    href: m.href,
    category: 'Admin Module',
    icon: m.icon,
  })),
  {
    label: 'Public Home / Overview',
    desc: 'Open live portfolio landing page',
    href: '/',
    category: 'Public Route',
    icon: <PublicIcon sx={{ fontSize: 19 }} />,
  },
  {
    label: 'Public Projects Catalog',
    desc: 'Inspect published case studies',
    href: '/projects',
    category: 'Public Route',
    icon: <LaunchIcon sx={{ fontSize: 19 }} />,
  },
  {
    label: 'Public Engineering Journal',
    desc: 'View published articles',
    href: '/journal',
    category: 'Public Route',
    icon: <LaunchIcon sx={{ fontSize: 19 }} />,
  },
];

export default function AdminShell({
  children,
  adminEmail,
}: {
  children: React.ReactNode;
  adminEmail: string;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentModule = useMemo(() => {
    const found = menuItems.find((item) =>
      item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
    );
    return found || menuItems[0];
  }, [pathname]);

  const filteredCommands = useMemo(() => {
    if (!cmdQuery.trim()) return commandLinks;
    const q = cmdQuery.toLowerCase();
    return commandLinks.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [cmdQuery]);

  const onLogout = async () => {
    await handleLogout();
    router.push('/admin/login');
    router.refresh();
  };

  const groups: Array<NavItem['group']> = ['WORKSPACE', 'CONTENT ENGINE', 'IDENTITY & INBOX'];

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#07090F',
        backgroundImage:
          'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.04) 0%, transparent 45%)',
      }}
    >
      {/* Brand / Console Identity Header */}
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                bgcolor: '#6366F1',
                color: '#06080D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono), monospace',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)',
              }}
            >
              DT
            </Box>
            <Box>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#F8FAFC', lineHeight: 1.15 }}
                >
                  DZULFIKAR.OS
                </Typography>
                <Box
                  sx={{
                    px: 0.6,
                    py: 0.1,
                    borderRadius: '4px',
                    bgcolor: 'rgba(99, 102, 241, 0.12)',
                    border: '1px solid rgba(99, 102, 241, 0.28)',
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: 'primary.main',
                  }}
                >
                  v2.4
                </Box>
              </Stack>
              <Typography
                variant="caption"
                sx={{
                  color: '#64748B',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.68rem',
                  display: 'block',
                  mt: 0.2,
                }}
              >
                CONTENT CONTROL PLANE
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Quick Command Trigger inside Sidebar */}
        <Box
          onClick={() => setCmdOpen(true)}
          sx={{
            mt: 2.25,
            px: 1.5,
            py: 0.9,
            borderRadius: '8px',
            bgcolor: 'rgba(255, 255, 255, 0.025)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': {
              borderColor: 'rgba(99, 102, 241, 0.35)',
              bgcolor: 'rgba(255, 255, 255, 0.04)',
            },
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: '#94A3B8' }}>
            <SearchIcon sx={{ fontSize: 15 }} />
            <Typography variant="caption" sx={{ fontSize: '0.76rem', fontWeight: 500 }}>
              Quick jump...
            </Typography>
          </Stack>
          <Box
            sx={{
              px: 0.75,
              py: 0.15,
              borderRadius: '4px',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.65rem',
              color: '#64748B',
            }}
          >
            ⌘K
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)' }} />

      {/* Grouped Navigation */}
      <Box sx={{ px: 1.75, py: 2, flexGrow: 1, overflowY: 'auto' }}>
        {groups.map((groupName) => {
          const items = menuItems.filter((m) => m.group === groupName);
          return (
            <Box key={groupName} sx={{ mb: 2.5 }}>
              <Typography
                variant="overline"
                sx={{
                  px: 1.25,
                  mb: 0.75,
                  display: 'block',
                  color: '#475569',
                  fontSize: '0.64rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                }}
              >
                {groupName}
              </Typography>
              <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                {items.map((item) => {
                  const active =
                    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                  return (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton
                        component={Link}
                        href={item.href}
                        onClick={() => isMobile && setMobileOpen(false)}
                        sx={{
                          position: 'relative',
                          borderRadius: '8px',
                          py: 0.95,
                          px: 1.25,
                          bgcolor: active ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                          color: active ? '#F8FAFC' : '#94A3B8',
                          border: active
                            ? '1px solid rgba(99, 102, 241, 0.22)'
                            : '1px solid transparent',
                          transition: 'all 0.15s ease',
                          '&::before': active
                            ? {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: '20%',
                                bottom: '20%',
                                width: '3px',
                                borderRadius: '0 4px 4px 0',
                                bgcolor: '#6366F1',
                              }
                            : {},
                          '&:hover': {
                            bgcolor: active
                              ? 'rgba(99, 102, 241, 0.11)'
                              : 'rgba(255, 255, 255, 0.035)',
                            color: '#F8FAFC',
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: active ? 'primary.main' : 'inherit',
                            minWidth: 32,
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          slotProps={{
                            primary: {
                              sx: {
                                fontSize: '0.83rem',
                                fontWeight: active ? 700 : 500,
                                letterSpacing: '-0.01em',
                              },
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: 'var(--font-mono), monospace',
                            fontSize: '0.66rem',
                            color: active ? 'primary.main' : '#475569',
                            fontWeight: active ? 700 : 500,
                          }}
                        >
                          {item.code}
                        </Typography>
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)' }} />

      {/* Operator Session Footer */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 1.5,
            mb: 1.5,
            borderRadius: '10px',
            bgcolor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '6px',
                bgcolor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.72rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              OP
            </Box>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: '#F8FAFC',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {adminEmail}
              </Typography>
              <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center' }}>
                <Box
                  className="pulse-indicator"
                  sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981' }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#64748B',
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.64rem',
                  }}
                >
                  AUTH_SESSION_ACTIVE
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            component="a"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            fullWidth
            variant="outlined"
            size="small"
            endIcon={<LaunchIcon sx={{ fontSize: 13 }} />}
            sx={{ py: 0.75, fontSize: '0.76rem' }}
          >
            Live Site
          </Button>
          <Button
            onClick={onLogout}
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon sx={{ fontSize: 14 }} />}
            sx={{
              py: 0.75,
              px: 1.5,
              fontSize: '0.76rem',
              borderColor: 'rgba(244, 63, 94, 0.25)',
              color: '#FB7185',
              bgcolor: 'rgba(244, 63, 94, 0.04)',
              '&:hover': {
                bgcolor: 'rgba(244, 63, 94, 0.12)',
                borderColor: 'rgba(244, 63, 94, 0.45)',
              },
            }}
          >
            Exit
          </Button>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#06080D' }}>
      {/* Top Telemetry Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'rgba(6, 8, 13, 0.82)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '60px !important', px: { xs: 2, md: 4 } }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ display: { md: 'none' }, mr: 0.5 }}
            >
              <MenuIcon />
            </IconButton>

            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: '#64748B',
                  fontSize: '0.75rem',
                  display: { xs: 'none', sm: 'inline' },
                }}
              >
                SYS.ADMIN
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#334155',
                  fontFamily: 'var(--font-mono), monospace',
                  display: { xs: 'none', sm: 'inline' },
                }}
              >
                /
              </Typography>
              <Chip
                label={`${currentModule.code} · ${currentModule.text}`}
                size="small"
                sx={{
                  height: 24,
                  bgcolor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#F8FAFC',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                }}
              />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            {/* Runtime Telemetry Badge */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                px: 1.25,
                py: 0.4,
                borderRadius: '6px',
                bgcolor: 'rgba(16, 185, 129, 0.07)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <BoltIcon sx={{ fontSize: 14, color: '#10B981' }} />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.68rem',
                  color: '#34D399',
                  fontWeight: 600,
                }}
              >
                PRISMA.PG // ONLINE
              </Typography>
            </Stack>

            <Button
              size="small"
              variant="outlined"
              onClick={() => setCmdOpen(true)}
              startIcon={<SearchIcon sx={{ fontSize: 15 }} />}
              sx={{
                py: 0.45,
                px: 1.25,
                fontSize: '0.75rem',
                color: '#94A3B8',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              Command (⌘K)
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid rgba(255, 255, 255, 0.07)',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid rgba(255, 255, 255, 0.07)',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Viewport */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, sm: 3.5, md: 4.5 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '60px',
          minHeight: 'calc(100vh - 60px)',
        }}
      >
        <Box sx={{ maxWidth: 1360, mx: 'auto' }}>{children}</Box>
      </Box>

      {/* Raycast / Linear Style Command Palette Modal */}
      <Dialog
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#0B0E17',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              overflow: 'hidden',
              mt: -8,
            },
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.07)' }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder="Type a command or module name (e.g. Projects, Journal, Skills)..."
            value={cmdQuery}
            onChange={(e) => setCmdQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'primary.main', fontSize: 19 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Chip
                      label="ESC"
                      size="small"
                      onClick={() => setCmdOpen(false)}
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono), monospace',
                        bgcolor: 'rgba(255, 255, 255, 0.06)',
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ maxHeight: 360, overflowY: 'auto', p: 1.5 }}>
          {filteredCommands.length === 0 ? (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No matching modules or commands found.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={0.5}>
              {filteredCommands.map((cmd) => (
                <Box
                  key={cmd.href + cmd.label}
                  onClick={() => {
                    setCmdOpen(false);
                    setCmdQuery('');
                    router.push(cmd.href);
                  }}
                  sx={{
                    p: 1.25,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                    '&:hover': {
                      bgcolor: 'rgba(99, 102, 241, 0.08)',
                      '& .cmd-arrow': { color: 'primary.main', opacity: 1 },
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '7px',
                        bgcolor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main',
                      }}
                    >
                      {cmd.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                        {cmd.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cmd.desc}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: '0.68rem',
                        color: '#64748B',
                      }}
                    >
                      {cmd.category}
                    </Typography>
                    <KeyboardReturnIcon
                      className="cmd-arrow"
                      sx={{ fontSize: 15, color: '#64748B', opacity: 0.5 }}
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}

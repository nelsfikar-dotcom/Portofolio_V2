import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import AddIcon from '@mui/icons-material/Add';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TuneIcon from '@mui/icons-material/Tune';
import AdminShell from '@/components/admin/AdminShell';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ContentStatus, SkillCategory } from '@prisma/client';

export const instant = false;

const categoryMeta: Record<SkillCategory, { label: string; color: string }> = {
  FRONTEND: { label: 'Frontend Systems', color: '#6366F1' },
  BACKEND: { label: 'Backend & APIs', color: '#38BDF8' },
  DATABASE: { label: 'Data & Storage', color: '#10B981' },
  TOOLS: { label: 'DevOps & Tooling', color: '#F59E0B' },
  OTHER: { label: 'Architecture & Misc', color: '#A855F7' },
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const [
    totalProjects,
    publishedProjects,
    featuredProjectsCount,
    totalArticles,
    publishedArticles,
    allSkills,
    experiences,
    totalMessages,
    unreadMessages,
    recentMessages,
    recentProjects,
    recentArticles,
    profile,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.project.count({ where: { featured: true } }),
    prisma.article.count(),
    prisma.article.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.skill.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.experience.findMany({ orderBy: { startDate: 'desc' } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.project.findMany({
      take: 4,
      orderBy: { updatedAt: 'desc' },
      include: { technologies: true },
    }),
    prisma.article.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.profile.findFirst(),
  ]);

  const totalSkills = allSkills.length;
  const totalExperiences = experiences.length;
  const activeRoles = experiences.filter((e) => e.isCurrent).length;

  const projectPubRatio = totalProjects > 0 ? Math.round((publishedProjects / totalProjects) * 100) : 0;
  const articlePubRatio = totalArticles > 0 ? Math.round((publishedArticles / totalArticles) * 100) : 0;
  const inboxReadRatio =
    totalMessages > 0 ? Math.round(((totalMessages - unreadMessages) / totalMessages) * 100) : 100;

  // Profile completeness checklist
  const profileChecks = [
    { label: 'Identity & Headline', done: Boolean(profile?.fullName && profile?.headline) },
    { label: 'Executive Biography', done: Boolean(profile?.biography && profile.biography.length > 30) },
    { label: 'GitHub & LinkedIn URLs', done: Boolean(profile?.githubUrl && profile?.linkedinUrl) },
    { label: 'Resume / CV Document Link', done: Boolean(profile?.cvUrl) },
  ];
  const completedProfileCount = profileChecks.filter((c) => c.done).length;
  const profileHealthPct = Math.round((completedProfileCount / profileChecks.length) * 100);

  const statCards = [
    {
      code: '01 // PROJECTS',
      title: 'Portfolio Deployments',
      value: totalProjects,
      badge: `${publishedProjects} Live · ${featuredProjectsCount} Featured`,
      ratioLabel: 'Published Ratio',
      ratioValue: `${projectPubRatio}%`,
      progress: projectPubRatio,
      accent: '#6366F1',
      icon: <FolderCopyOutlinedIcon sx={{ fontSize: 20, color: '#6366F1' }} />,
      href: '/admin/projects',
    },
    {
      code: '02 // JOURNAL',
      title: 'Engineering Articles',
      value: totalArticles,
      badge: `${publishedArticles} Published · ${totalArticles - publishedArticles} Draft`,
      ratioLabel: 'Publication Rate',
      ratioValue: `${articlePubRatio}%`,
      progress: articlePubRatio,
      accent: '#38BDF8',
      icon: <ArticleOutlinedIcon sx={{ fontSize: 20, color: '#38BDF8' }} />,
      href: '/admin/journal',
    },
    {
      code: '03 // STACK & CAREER',
      title: 'Indexed Capabilities',
      value: totalSkills,
      badge: `${totalExperiences} Career Milestones (${activeRoles} Active)`,
      ratioLabel: 'Identity Readiness',
      ratioValue: `${profileHealthPct}%`,
      progress: profileHealthPct,
      accent: '#10B981',
      icon: <TerminalOutlinedIcon sx={{ fontSize: 20, color: '#10B981' }} />,
      href: '/admin/skills',
    },
    {
      code: '04 // DISPATCH INBOX',
      title: 'Inbound Inquiries',
      value: totalMessages,
      badge: unreadMessages > 0 ? `${unreadMessages} Unread Requires Action` : 'All dispatches reviewed',
      ratioLabel: 'Response Hygiene',
      ratioValue: `${inboxReadRatio}%`,
      progress: inboxReadRatio,
      accent: unreadMessages > 0 ? '#F59E0B' : '#A855F7',
      icon: (
        <MarkEmailUnreadOutlinedIcon
          sx={{ fontSize: 20, color: unreadMessages > 0 ? '#F59E0B' : '#A855F7' }}
        />
      ),
      href: '/admin/messages',
    },
  ];

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);

  return (
    <AdminShell adminEmail={session.email}>
      {/* Top Executive Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: '14px',
          bgcolor: '#0B0E17',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundImage:
            'radial-gradient(ellipse 60% 90% at 95% 0%, rgba(99, 102, 241, 0.07) 0%, transparent 65%), radial-gradient(ellipse 40% 70% at 10% 100%, rgba(56, 189, 248, 0.05) 0%, transparent 60%)',
        }}
      >
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={3}
          sx={{ justifyContent: 'space-between', alignItems: { lg: 'center' } }}
        >
          <Box>
            <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', mb: 1.25 }}>
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: '5px',
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'primary.main',
                }}
              >
                SYS.CONSOLE // TELEMETRY
              </Box>
              <Typography
                variant="caption"
                sx={{ fontFamily: 'var(--font-mono), monospace', color: '#64748B' }}
              >
                OPERATOR: {profile?.fullName?.toUpperCase() || 'DZULFIKAR TADAH'}
              </Typography>
            </Stack>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.65rem', md: '2.15rem' },
                fontWeight: 800,
                letterSpacing: '-0.03em',
                mb: 0.75,
              }}
            >
              Engineering & Content Control Center
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
              Real-time operational overview of published case studies, technical skill taxonomy,
              journal dispatches, and inbound client communications.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ flexShrink: 0 }}>
            <Link href="/admin/projects" style={{ textDecoration: 'none' }}>
              <Button variant="contained" startIcon={<AddIcon />} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                Manage Projects
              </Button>
            </Link>
            <Link href="/admin/journal" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" startIcon={<AddIcon />} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                Write Article
              </Button>
            </Link>
            <Link href="/admin/profile" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                startIcon={<TuneIcon sx={{ fontSize: 16 }} />}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Identity
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Paper>

      {/* Primary KPI Bento Grid */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid key={card.code} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Link href={card.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  bgcolor: '#0B0E17',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    borderColor: `${card.accent}66`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 14px 32px rgba(0, 0, 0, 0.45), 0 0 0 1px ${card.accent}22`,
                    '& .metric-arrow': {
                      transform: 'translate(2px, -2px)',
                      color: card.accent,
                    },
                  },
                }}
              >
                {/* Top Row: Code + Icon */}
                <Box>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2.25 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: '#64748B',
                      }}
                    >
                      {card.code}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: '8px',
                          bgcolor: `${card.accent}14`,
                          border: `1px solid ${card.accent}33`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {card.icon}
                      </Box>
                      <ArrowOutwardIcon
                        className="metric-arrow"
                        sx={{
                          fontSize: 16,
                          color: '#475569',
                          transition: 'all 0.2s ease',
                        }}
                      />
                    </Stack>
                  </Stack>

                  {/* Value & Title */}
                  <Typography
                    sx={{
                      fontSize: '2.35rem',
                      fontWeight: 800,
                      lineHeight: 1,
                      letterSpacing: '-0.04em',
                      fontFamily: 'var(--font-mono), monospace',
                      color: '#F8FAFC',
                      mb: 0.75,
                    }}
                  >
                    {String(card.value).padStart(2, '0')}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, color: '#E2E8F0', fontSize: '0.9rem', mb: 0.25 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2.5 }}>
                    {card.badge}
                  </Typography>
                </Box>

                {/* Bottom Progress Telemetry */}
                <Box>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ fontSize: '0.68rem', color: '#64748B', fontFamily: 'var(--font-mono), monospace' }}
                    >
                      {card.ratioLabel}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: card.accent,
                        fontFamily: 'var(--font-mono), monospace',
                      }}
                    >
                      {card.ratioValue}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      width: '100%',
                      height: 4,
                      borderRadius: 99,
                      bgcolor: 'rgba(255, 255, 255, 0.06)',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${card.progress}%`,
                        height: '100%',
                        bgcolor: card.accent,
                        borderRadius: 99,
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* Middle Bento Row: Content Pipeline Ledger + Technical Stack Distribution */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Left: Content Pipeline & Deployment Ledger */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 3.5 },
              bgcolor: '#0B0E17',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'var(--font-mono), monospace',
                      color: 'primary.main',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                    }}
                  >
                    PIPELINE // RECENT DEPLOYMENTS
                  </Typography>
                  <Typography variant="h3" sx={{ fontSize: '1.15rem', fontWeight: 700, mt: 0.25 }}>
                    Projects & Case Study Registry
                  </Typography>
                </Box>
                <Link href="/admin/projects" style={{ textDecoration: 'none' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    endIcon={<ArrowOutwardIcon sx={{ fontSize: 14 }} />}
                  >
                    Open Registry
                  </Button>
                </Link>
              </Stack>

              {recentProjects.length === 0 ? (
                <Box
                  sx={{
                    py: 6,
                    textAlign: 'center',
                    border: '1px dashed rgba(255, 255, 255, 0.08)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No projects registered yet. Create your first project to populate the pipeline.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.25}>
                  {recentProjects.map((proj, idx) => (
                    <Box
                      key={proj.id}
                      sx={{
                        p: 2,
                        borderRadius: '10px',
                        bgcolor: 'rgba(255, 255, 255, 0.018)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 1.5,
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.14)',
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1.75} sx={{ alignItems: 'center', minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: '6px',
                            bgcolor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-mono), monospace',
                            fontSize: '0.7rem',
                            color: '#64748B',
                            flexShrink: 0,
                          }}
                        >
                          0{idx + 1}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 700,
                                color: '#F8FAFC',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {proj.title}
                            </Typography>
                            {proj.featured && (
                              <StarRoundedIcon sx={{ fontSize: 16, color: '#6366F1' }} />
                            )}
                          </Stack>
                          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.25 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                fontFamily: 'var(--font-mono), monospace',
                                color: '#64748B',
                                fontSize: '0.7rem',
                              }}
                            >
                              /{proj.slug}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#334155' }}>
                              •
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem' }}>
                              {proj.category} ({proj.year})
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'center', flexShrink: 0, alignSelf: { xs: 'flex-end', sm: 'center' } }}
                      >
                        <Chip
                          label={`${proj.technologies.length} tech`}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.68rem',
                            fontFamily: 'var(--font-mono), monospace',
                            bgcolor: 'rgba(255, 255, 255, 0.04)',
                            color: '#94A3B8',
                          }}
                        />
                        <Chip
                          label={proj.status}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.68rem',
                            fontFamily: 'var(--font-mono), monospace',
                            fontWeight: 700,
                            bgcolor:
                              proj.status === ContentStatus.PUBLISHED
                                ? 'rgba(16, 185, 129, 0.12)'
                                : 'rgba(245, 158, 11, 0.12)',
                            color:
                              proj.status === ContentStatus.PUBLISHED ? '#34D399' : '#FBBF24',
                            border:
                              proj.status === ContentStatus.PUBLISHED
                                ? '1px solid rgba(16, 185, 129, 0.28)'
                                : '1px solid rgba(245, 158, 11, 0.28)',
                          }}
                        />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

            {/* Mini Journal Strip inside Left Panel */}
            <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'var(--font-mono), monospace',
                    color: '#94A3B8',
                    fontWeight: 600,
                  }}
                >
                  LATEST JOURNAL DISPATCHES ({totalArticles})
                </Typography>
                <Link href="/admin/journal" style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="caption"
                    sx={{ color: 'primary.main', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                  >
                    Manage Journal →
                  </Typography>
                </Link>
              </Stack>

              {recentArticles.length === 0 ? (
                <Typography variant="caption" color="text.secondary">
                  No journal articles written yet.
                </Typography>
              ) : (
                <Grid container spacing={1.5}>
                  {recentArticles.map((art) => (
                    <Grid key={art.id} size={{ xs: 12, sm: 4 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: '8px',
                          bgcolor: 'rgba(255, 255, 255, 0.015)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          height: '100%',
                        }}
                      >
                        <Stack
                          direction="row"
                          sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor:
                                art.status === ContentStatus.PUBLISHED ? '#10B981' : '#F59E0B',
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: 'var(--font-mono), monospace',
                              fontSize: '0.62rem',
                              color: '#64748B',
                            }}
                          >
                            {art.status}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: '#E2E8F0',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {art.title}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Right: Technical Stack Distribution & Identity Readiness */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 3.5 },
              bgcolor: '#0B0E17',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'var(--font-mono), monospace',
                      color: '#38BDF8',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                    }}
                  >
                    TAXONOMY // SKILL MATRIX
                  </Typography>
                  <Typography variant="h3" sx={{ fontSize: '1.15rem', fontWeight: 700, mt: 0.25 }}>
                    Stack Domain Distribution
                  </Typography>
                </Box>
                <Link href="/admin/skills" style={{ textDecoration: 'none' }}>
                  <Button size="small" variant="outlined">
                    Configure ({totalSkills})
                  </Button>
                </Link>
              </Stack>

              <Stack spacing={2}>
                {(Object.keys(categoryMeta) as SkillCategory[]).map((cat) => {
                  const meta = categoryMeta[cat];
                  const items = allSkills.filter((s) => s.category === cat);
                  const count = items.length;
                  const pct = totalSkills > 0 ? Math.round((count / totalSkills) * 100) : 0;

                  return (
                    <Box key={cat}>
                      <Stack
                        direction="row"
                        sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.6 }}
                      >
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '2px',
                              bgcolor: meta.color,
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem' }}>
                            {meta.label}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: 'var(--font-mono), monospace',
                            color: '#94A3B8',
                            fontSize: '0.72rem',
                          }}
                        >
                          {count} nodes ({pct}%)
                        </Typography>
                      </Stack>

                      <Box
                        sx={{
                          width: '100%',
                          height: 6,
                          borderRadius: 99,
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${Math.max(pct, count > 0 ? 8 : 0)}%`,
                            height: '100%',
                            bgcolor: meta.color,
                            borderRadius: 99,
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)', my: 2.5 }} />

            {/* Profile Readiness Audit */}
            <Box>
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'var(--font-mono), monospace',
                    color: '#94A3B8',
                    fontWeight: 700,
                  }}
                >
                  OPERATOR PROFILE INTEGRITY ({profileHealthPct}%)
                </Typography>
                <Link href="/admin/profile" style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="caption"
                    sx={{ color: 'primary.main', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                  >
                    Edit Profile →
                  </Typography>
                </Link>
              </Stack>

              <Grid container spacing={1}>
                {profileChecks.map((check) => (
                  <Grid key={check.label} size={{ xs: 12, sm: 6 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        alignItems: 'center',
                        p: 1,
                        borderRadius: '7px',
                        bgcolor: 'rgba(255, 255, 255, 0.015)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      {check.done ? (
                        <CheckCircleOutlinedIcon sx={{ fontSize: 15, color: '#10B981' }} />
                      ) : (
                        <RadioButtonUncheckedIcon sx={{ fontSize: 15, color: '#F59E0B' }} />
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          color: check.done ? '#E2E8F0' : '#94A3B8',
                          fontSize: '0.73rem',
                          fontWeight: 500,
                        }}
                      >
                        {check.label}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Bento Row: Inbound Communications + Career & Quick Matrix */}
      <Grid container spacing={3}>
        {/* Inbound Communications */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 3.5 },
              bgcolor: '#0B0E17',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
              height: '100%',
            }}
          >
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'var(--font-mono), monospace',
                    color: unreadMessages > 0 ? '#F59E0B' : '#10B981',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                  }}
                >
                  DISPATCH // INBOUND TRANSMISSION LOG
                </Typography>
                <Typography variant="h3" sx={{ fontSize: '1.15rem', fontWeight: 700, mt: 0.25 }}>
                  Recent Contact Inquiries
                </Typography>
              </Box>
              <Link href="/admin/messages" style={{ textDecoration: 'none' }}>
                <Button size="small" variant="outlined">
                  Open Inbox ({totalMessages})
                </Button>
              </Link>
            </Stack>

            {recentMessages.length === 0 ? (
              <Box
                sx={{
                  py: 6,
                  textAlign: 'center',
                  border: '1px dashed rgba(255, 255, 255, 0.08)',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No inbound messages recorded yet. Messages sent via /contact will appear here.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1.25}>
                {recentMessages.map((msg) => (
                  <Link
                    key={msg.id}
                    href="/admin/messages"
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '10px',
                        bgcolor: msg.isRead
                          ? 'rgba(255, 255, 255, 0.015)'
                          : 'rgba(99, 102, 241, 0.04)',
                        border: msg.isRead
                          ? '1px solid rgba(255, 255, 255, 0.06)'
                          : '1px solid rgba(99, 102, 241, 0.25)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 2,
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.035)',
                          borderColor: 'rgba(99, 102, 241, 0.35)',
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1.75} sx={{ alignItems: 'flex-start', minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: '8px',
                            bgcolor: msg.isRead
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(99, 102, 241, 0.15)',
                            color: msg.isRead ? '#94A3B8' : 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            fontFamily: 'var(--font-mono), monospace',
                            flexShrink: 0,
                            mt: 0.25,
                          }}
                        >
                          {msg.name.slice(0, 2).toUpperCase()}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: msg.isRead ? 600 : 800, color: '#F8FAFC' }}
                            >
                              {msg.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#64748B',
                                fontFamily: 'var(--font-mono), monospace',
                                fontSize: '0.7rem',
                              }}
                            >
                              &lt;{msg.email}&gt;
                            </Typography>
                          </Stack>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: msg.isRead ? 500 : 700,
                              color: '#E2E8F0',
                              fontSize: '0.82rem',
                              mt: 0.25,
                            }}
                          >
                            {msg.subject || '(No Subject Provided)'}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              mt: 0.25,
                            }}
                          >
                            {msg.message}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack sx={{ alignItems: 'flex-end', flexShrink: 0 }} spacing={0.75}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: 'var(--font-mono), monospace',
                            fontSize: '0.68rem',
                            color: '#64748B',
                          }}
                        >
                          {formatDate(msg.createdAt)}
                        </Typography>
                        <Chip
                          label={msg.isRead ? 'READ' : 'NEW'}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.64rem',
                            fontFamily: 'var(--font-mono), monospace',
                            fontWeight: 700,
                            bgcolor: msg.isRead
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(99, 102, 241, 0.16)',
                            color: msg.isRead ? '#64748B' : 'primary.main',
                          }}
                        />
                      </Stack>
                    </Box>
                  </Link>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Career Timeline & Quick Operations Matrix */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 3.5 },
              bgcolor: '#0B0E17',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'var(--font-mono), monospace',
                      color: '#10B981',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                    }}
                  >
                    CHRONOLOGY // CAREER TRACK
                  </Typography>
                  <Typography variant="h3" sx={{ fontSize: '1.15rem', fontWeight: 700, mt: 0.25 }}>
                    Experience & Tenure Log
                  </Typography>
                </Box>
                <Link href="/admin/experience" style={{ textDecoration: 'none' }}>
                  <Button size="small" variant="outlined">
                    Manage ({totalExperiences})
                  </Button>
                </Link>
              </Stack>

              {experiences.length === 0 ? (
                <Box
                  sx={{
                    py: 4,
                    textAlign: 'center',
                    border: '1px dashed rgba(255, 255, 255, 0.08)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    No experience entries logged yet.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.25}>
                  {experiences.slice(0, 3).map((exp) => (
                    <Box
                      key={exp.id}
                      sx={{
                        p: 1.75,
                        borderRadius: '9px',
                        bgcolor: 'rgba(255, 255, 255, 0.018)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
                        <BusinessCenterOutlinedIcon sx={{ fontSize: 18, color: '#10B981', flexShrink: 0 }} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.84rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {exp.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                            {exp.organization}
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip
                        label={exp.isCurrent ? 'ACTIVE' : 'PAST'}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.64rem',
                          fontFamily: 'var(--font-mono), monospace',
                          fontWeight: 700,
                          bgcolor: exp.isCurrent
                            ? 'rgba(16, 185, 129, 0.14)'
                            : 'rgba(255, 255, 255, 0.05)',
                          color: exp.isCurrent ? '#34D399' : '#64748B',
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

            <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: '#64748B',
                  display: 'block',
                  mb: 1.25,
                }}
              >
                SYSTEM RUNTIME SPECIFICATION
              </Typography>
              <Grid container spacing={1}>
                {[
                  { k: 'ENGINE', v: 'Next.js 16.4 (Turbopack)' },
                  { k: 'RENDER', v: 'Cache Components / PPR' },
                  { k: 'DATA LAYER', v: 'Prisma 6 + PostgreSQL' },
                  { k: 'SECURITY', v: 'HTTP-Only Session Auth' },
                ].map((spec) => (
                  <Grid key={spec.k} size={{ xs: 6 }}>
                    <Box
                      sx={{
                        p: 1.1,
                        borderRadius: '7px',
                        bgcolor: 'rgba(255, 255, 255, 0.015)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'var(--font-mono), monospace',
                          fontSize: '0.6rem',
                          color: '#64748B',
                          display: 'block',
                        }}
                      >
                        {spec.k}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: '#E2E8F0',
                          fontSize: '0.72rem',
                        }}
                      >
                        {spec.v}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </AdminShell>
  );
}

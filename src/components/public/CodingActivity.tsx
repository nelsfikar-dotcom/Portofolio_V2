'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Typography, Paper, Stack, Button, Tooltip, Skeleton, Chip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SyncIcon from '@mui/icons-material/Sync';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubStatsResponse {
  username: string;
  totalContributions: number;
  weeks: ContributionDay[][];
  publicRepos: number | null;
  followers: number | null;
  avatarUrl: string | null;
  profileUrl: string;
  isLive: boolean;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const LEVEL_COLORS: Record<number, string> = {
  0: 'rgba(30, 41, 59, 0.55)',
  1: '#064E3B',
  2: '#047857',
  3: '#10B981',
  4: '#34D399',
};

export default function CodingActivity({
  showLearnMoreButton = true,
  title = 'GitHub Activity & Contributions',
  username,
}: {
  showLearnMoreButton?: boolean;
  title?: string;
  username?: string;
}) {
  const [data, setData] = useState<GitHubStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const url = username
      ? `/api/github?username=${encodeURIComponent(username)}`
      : '/api/github';

    fetch(url)
      .then((res) => res.json())
      .then((json: GitHubStatsResponse) => {
        if (active) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [username]);

  const weeks = data?.weeks || [];
  const ghUser = data?.username || username || 'NelsFikar';
  const ghUrl = data?.profileUrl || `https://github.com/nelsfikar-dotcom`;

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: '18px',
          bgcolor: 'var(--surface-card)',
          border: '1px solid var(--border-card)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Header Bar */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 3,
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                bgcolor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10B981',
              }}
            >
              <GitHubIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  {title}
                </Typography>
                <Chip
                  icon={<SyncIcon sx={{ fontSize: '13px !important', color: '#10B981 !important' }} />}
                  label={`@${ghUser}`}
                  size="small"
                  component="a"
                  href={ghUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  clickable
                  sx={{
                    height: 22,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    color: '#34D399',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}
                />
              </Stack>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Data kontribusi asli yang disinkronkan langsung dari repositori publik GitHub
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            {typeof data?.publicRepos === 'number' && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '8px',
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: '#CBD5E1',
                    fontWeight: 600,
                  }}
                >
                  <Box component="span" sx={{ color: '#06B6D4', fontWeight: 800 }}>
                    {data.publicRepos}
                  </Box>{' '}
                  Public Repos
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                px: 1.75,
                py: 0.5,
                borderRadius: '8px',
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.28)',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#34D399',
                }}
              >
                {loading
                  ? 'Memuat data GitHub...'
                  : `${(data?.totalContributions || 0).toLocaleString()} contributions in the last year`}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Contribution Matrix */}
        {loading ? (
          <Skeleton
            variant="rectangular"
            height={135}
            sx={{ borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.04)' }}
          />
        ) : weeks.length === 0 ? (
          <Box
            sx={{
              py: 4,
              textAlign: 'center',
              borderRadius: '12px',
              bgcolor: 'rgba(8, 11, 17, 0.5)',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Tidak dapat memuat kalender kontribusi saat ini.
            </Typography>
            <Button
              component="a"
              href={ghUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="outlined"
              endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
            >
              Buka GitHub @{ghUser}
            </Button>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto', pb: 1 }}>
            <Box sx={{ minWidth: 740 }}>
              {/* Month Labels */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '32px repeat(12, 1fr)',
                  mb: 1,
                }}
              >
                <Box />
                {MONTHS.map((m) => (
                  <Typography
                    key={m}
                    variant="caption"
                    sx={{
                      color: '#64748B',
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {m}
                  </Typography>
                ))}
              </Box>

              {/* Days + Grid */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Stack
                   sx={{
                    justifyContent: 'space-between',
                    height: 98,
                    pr: 0.5,
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.64rem' }}>
                    Mon
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.64rem' }}>
                    Wed
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.64rem' }}>
                    Fri
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    display: 'flex',
                    gap: '4px',
                    flexGrow: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  {weeks.map((week, wIdx) => (
                    <Stack key={wIdx} spacing="4px">
                      {week.map((day, dIdx) => (
                        <Tooltip
                          key={day.date || dIdx}
                          title={`${day.count} contributions on ${day.date}`}
                          arrow
                          placement="top"
                        >
                          <Box
                            sx={{
                              width: 11,
                              height: 11,
                              borderRadius: '3px',
                              bgcolor: LEVEL_COLORS[day.level] ?? LEVEL_COLORS[0],
                              transition: 'transform 0.12s ease',
                              '&:hover': {
                                transform: 'scale(1.35)',
                                outline: '1px solid #34D399',
                              },
                            }}
                          />
                        </Tooltip>
                      ))}
                    </Stack>
                  ))}
                </Box>
              </Box>

              {/* Footer Legend + Direct GitHub Link */}
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 2,
                  pt: 1.5,
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <Typography
                  component="a"
                  href={ghUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="caption"
                  sx={{
                    color: '#94A3B8',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': { color: '#10B981' },
                  }}
                >
                  Lihat profil GitHub lengkap (@{ghUser})
                  <OpenInNewIcon sx={{ fontSize: 12 }} />
                </Typography>

                <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.68rem', mr: 0.5 }}>
                    Less
                  </Typography>
                  {[0, 1, 2, 3, 4].map((lvl) => (
                    <Box
                      key={lvl}
                      sx={{
                        width: 11,
                        height: 11,
                        borderRadius: '3px',
                        bgcolor: LEVEL_COLORS[lvl],
                      }}
                    />
                  ))}
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.68rem', ml: 0.5 }}>
                    More
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
        )}
      </Paper>

      {showLearnMoreButton && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Link href="/about" style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderRadius: '10px',
                px: 3,
                py: 1,
                borderColor: 'rgba(255, 255, 255, 0.12)',
                color: '#E2E8F0',
                '&:hover': {
                  borderColor: '#10B981',
                  bgcolor: 'rgba(16, 185, 129, 0.08)',
                },
              }}
            >
              Selengkapnya Tentang Saya
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
}

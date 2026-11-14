import React, { Suspense } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Skeleton,
} from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { prisma } from '@/lib/prisma';
import { ContentStatus } from '@prisma/client';

async function JournalList() {
  const articles = await prisma.article.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (articles.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          border: '1px dashed var(--border-card)',
          borderRadius: 3,
        }}
      >
        <Typography color="text.secondary">Belum ada artikel atau tulisan yang dipublikasikan.</Typography>
      </Box>
    );
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);

  return (
    <Grid container spacing={4}>
      {articles.map((article) => (
        <Grid key={article.id} size={{ xs: 12, md: 6 }}>
          <Link href={`/journal/${article.slug}`} style={{ textDecoration: 'none' }}>
            <Card
              sx={{
                bgcolor: 'var(--surface-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease',
                '&:hover': {
                  borderColor: 'rgba(16, 185, 129, 0.45)',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 3.5, md: 4 } }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
                  <Chip
                    label="Tech Journal"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(16, 185, 129, 0.1)',
                      color: 'primary.main',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      fontWeight: 600,
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'var(--font-mono)' }}>
                    {article.publishedAt ? formatDate(article.publishedAt) : formatDate(article.createdAt)}
                  </Typography>
                </Stack>

                <Typography variant="h3" sx={{ mb: 1.5, fontWeight: 700, color: 'text.primary' }}>
                  {article.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.75, mb: 3 }}
                >
                  {article.excerpt}
                </Typography>

                <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', color: 'primary.main' }}>
                  <Typography variant="button" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    Baca Tulisan Lengkap
                  </Typography>
                  <ArrowOutwardIcon sx={{ fontSize: 16 }} />
                </Stack>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}

export default function JournalPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Box sx={{ mb: 8, maxWidth: 680 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
          <MenuBookIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
            CATATAN & ARTIKEL
          </Typography>
        </Stack>
        <Typography variant="h1" sx={{ mt: 1, mb: 2 }}>
          Journal & Pembelajaran
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: '1.125rem', lineHeight: 1.75 }}
        >
          Kumpulan dokumentasi teknis, analisis arsitektur sistem, dan catatan refleksi dalam
          mengembangkan perangkat lunak skala produksi.
        </Typography>
      </Box>

      <Suspense
        fallback={
          <Grid container spacing={4}>
            {[1, 2].map((i) => (
              <Grid key={i} size={{ xs: 12, md: 6 }}>
                <Skeleton
                  variant="rectangular"
                  height={240}
                  sx={{ borderRadius: 3, bgcolor: 'background.paper' }}
                />
              </Grid>
            ))}
          </Grid>
        }
      >
        <JournalList />
      </Suspense>
    </Container>
  );
}

import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Button,
  Divider,
  Paper,
  Skeleton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { prisma } from '@/lib/prisma';
import { ContentStatus } from '@prisma/client';

interface ArticleDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function ArticleDetailContent({ slugPromise }: { slugPromise: Promise<{ slug: string }> }) {
  const { slug } = await slugPromise;

  const article = await prisma.article.findFirst({
    where: {
      slug,
      status: ContentStatus.PUBLISHED,
    },
  });

  if (!article) {
    notFound();
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);

  return (
    <>
      <Box sx={{ mb: 5 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
          <Chip
            label="Journal"
            sx={{
              bgcolor: 'rgba(212, 255, 0, 0.1)',
              color: 'primary.main',
              border: '1px solid rgba(212, 255, 0, 0.25)',
              fontWeight: 600,
            }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'var(--font-mono)' }}>
            {article.publishedAt ? formatDate(article.publishedAt) : formatDate(article.createdAt)}
          </Typography>
        </Stack>

        <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3.5rem' }, mb: 3 }}>
          {article.title}
        </Typography>

        <Typography variant="h3" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.6, fontSize: '1.25rem' }}>
          {article.excerpt}
        </Typography>
      </Box>

      <Divider sx={{ mb: 6, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3.5, md: 5 },
          bgcolor: 'background.paper',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 3,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            lineHeight: 1.9,
            fontSize: '1.05rem',
            whiteSpace: 'pre-line',
          }}
        >
          {article.content}
        </Typography>
      </Paper>
    </>
  );
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
      <Link href="/journal" style={{ textDecoration: 'none' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 4, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
        >
          Kembali ke Daftar Journal
        </Button>
      </Link>

      <Suspense fallback={<Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />}>
        <ArticleDetailContent slugPromise={params} />
      </Suspense>
    </Container>
  );
}

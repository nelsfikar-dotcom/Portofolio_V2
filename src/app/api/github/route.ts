import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0..4
}

function extractUsernameFromUrl(url?: string | null): string | null {
  if (!url) return null;
  const cleaned = url.trim().replace(/\/+$/, '');
  const parts = cleaned.split('/');
  const last = parts[parts.length - 1];
  if (last && !last.includes('.') && last.length > 0) {
    return last.replace(/^@/, '');
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryUsername = searchParams.get('username');

  let username = queryUsername || process.env.NEXT_PUBLIC_GITHUB_USERNAME || '';

  if (!username) {
    try {
      const profile = await prisma.profile.findFirst();
      username = extractUsernameFromUrl(profile?.githubUrl) || 'nelsfikar-dotcom';
    } catch {
      username = 'nelsfikar-dotcom';
    }
  }

  try {
    // Fetch public contribution calendar + GitHub profile stats in parallel
    const headers: HeadersInit = {
      Accept: 'application/vnd.github+json',
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [contribRes, userRes] = await Promise.all([
      fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`, {
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!contribRes.ok) {
      throw new Error(`Failed to fetch contributions for ${username}`);
    }

    const contribData = (await contribRes.json()) as {
      total?: { lastYear?: number };
      contributions?: ContributionDay[];
    };

    const userData = userRes.ok
      ? ((await userRes.json()) as {
          login?: string;
          public_repos?: number;
          followers?: number;
          avatar_url?: string;
          html_url?: string;
        })
      : null;

    const contributions: ContributionDay[] = Array.isArray(contribData.contributions)
      ? contribData.contributions
      : [];

    const totalLastYear =
      typeof contribData.total?.lastYear === 'number'
        ? contribData.total.lastYear
        : contributions.reduce((sum, day) => sum + (day.count || 0), 0);

    // Group flat days into weeks of 7 days (Sunday..Saturday)
    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    contributions.forEach((day, idx) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || idx === contributions.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return NextResponse.json({
      username: userData?.login || username,
      totalContributions: totalLastYear,
      weeks: weeks.slice(-52),
      publicRepos: userData?.public_repos ?? null,
      followers: userData?.followers ?? null,
      avatarUrl: userData?.avatar_url ?? null,
      profileUrl: userData?.html_url || `https://github.com/${username}`,
      isLive: true,
    });
  } catch {
    return NextResponse.json(
      {
        username,
        totalContributions: 0,
        weeks: [],
        publicRepos: null,
        followers: null,
        avatarUrl: null,
        profileUrl: `https://github.com/${username}`,
        isLive: false,
      },
      { status: 200 }
    );
  }
}

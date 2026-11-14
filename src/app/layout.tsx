import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { AppThemeProvider } from '@/theme/theme';
import './global.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dzulfikar.dev'),
  title: {
    default: 'Dzulfikar Tadah — Fullstack Software Developer',
    template: '%s | Dzulfikar Tadah',
  },
  description:
    'Portofolio resmi Dzulfikar Tadah, Fullstack Developer yang berfokus pada rekayasa aplikasi web end-to-end modern, performa komputasi tinggi, dan antarmuka berkarakter presisi.',
  keywords: [
    'Dzulfikar Tadah',
    'Fullstack Developer',
    'Software Engineer',
    'Next.js',
    'TypeScript',
    'React',
    'PostgreSQL',
    'Node.js',
    'Portfolio',
  ],
  authors: [{ name: 'Dzulfikar Tadah' }],
  creator: 'Dzulfikar Tadah',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://dzulfikar.dev',
    title: 'Dzulfikar Tadah — Fullstack Software Developer',
    description:
      'Merancang solusi web modern, skalabel, dan terukur dengan arsitektur bersih dan performa optimal.',
    siteName: 'Dzulfikar Tadah Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dzulfikar Tadah — Fullstack Software Developer',
    description:
      'Fullstack Developer berfokus pada arsitektur modern, Next.js, TypeScript, dan performa tinggi.',
    creator: '@dzulfikar',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <AppThemeProvider>{children}</AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

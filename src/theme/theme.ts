'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ColorMode = 'dark' | 'light';

interface ColorModeContextType {
  mode: ColorMode;
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextType>({
  mode: 'dark',
  toggleColorMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

export function createAppTheme(mode: ColorMode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#10B981' : '#059669',
        light: '#34D399',
        dark: '#047857',
        contrastText: isDark ? '#04130D' : '#FFFFFF',
      },
      secondary: {
        main: isDark ? '#06B6D4' : '#0284C7',
        light: '#22D3EE',
        dark: '#0369A1',
        contrastText: isDark ? '#041318' : '#FFFFFF',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
      },
      warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        dark: '#D97706',
      },
      error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
      },
      background: {
        default: isDark ? '#080B11' : '#F8FAFC',
        paper: isDark ? '#0F141F' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F8FAFC' : '#0F172A',
        secondary: isDark ? '#94A3B8' : '#475569',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.09)',
    },
    typography: {
      fontFamily:
        'var(--font-sans), "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      h1: {
        fontSize: 'clamp(2.35rem, 4.5vw, 3.85rem)',
        fontWeight: 800,
        lineHeight: 1.08,
        letterSpacing: '-0.035em',
      },
      h2: {
        fontSize: 'clamp(1.65rem, 3vw, 2.35rem)',
        fontWeight: 800,
        lineHeight: 1.15,
        letterSpacing: '-0.025em',
      },
      h3: {
        fontSize: '1.25rem',
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.015em',
      },
      h4: {
        fontSize: '1.05rem',
        fontWeight: 700,
        lineHeight: 1.35,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.75,
        letterSpacing: '-0.005em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.65,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      caption: {
        fontSize: '0.775rem',
        lineHeight: 1.5,
      },
      overline: {
        fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      },
    },
    shape: {
      borderRadius: 14,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#080B11' : '#F8FAFC',
            color: isDark ? '#F8FAFC' : '#0F172A',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 20px',
            fontSize: '0.875rem',
            fontWeight: 700,
            transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          },
          sizeSmall: {
            padding: '6px 14px',
            fontSize: '0.8rem',
            borderRadius: 8,
          },
          sizeLarge: {
            padding: '12px 26px',
            fontSize: '0.925rem',
            borderRadius: 12,
          },
          contained: {
            background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
            color: '#04130D',
            boxShadow: '0 6px 20px -4px rgba(16, 185, 129, 0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #34D399 0%, #22D3EE 100%)',
              boxShadow: '0 10px 26px -4px rgba(16, 185, 129, 0.5)',
              transform: 'translateY(-1px)',
            },
          },
          outlined: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(15, 23, 42, 0.2)',
            color: isDark ? '#F8FAFC' : '#0F172A',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(15, 23, 42, 0.03)',
            '&:hover': {
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: isDark ? '#34D399' : '#047857',
            },
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? 'rgba(15, 20, 31, 0.82)' : '#FFFFFF',
            backdropFilter: 'blur(14px)',
            border: isDark
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(15, 23, 42, 0.09)',
            boxShadow: isDark ? 'none' : '0 8px 28px rgba(15, 23, 42, 0.05)',
          },
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? 'rgba(15, 20, 31, 0.82)' : '#FFFFFF',
            backdropFilter: 'blur(14px)',
            border: isDark
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(15, 23, 42, 0.09)',
            borderRadius: 16,
            boxShadow: isDark ? 'none' : '0 8px 28px rgba(15, 23, 42, 0.05)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: isDark ? 'rgba(8, 11, 17, 0.65)' : '#F8FAFC',
            color: isDark ? '#F8FAFC' : '#0F172A',
            transition: 'all 0.18s ease',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.16)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.24)' : 'rgba(15, 23, 42, 0.3)',
            },
            '&.Mui-focused': {
              backgroundColor: isDark ? 'rgba(8, 11, 17, 0.9)' : '#FFFFFF',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#10B981',
              borderWidth: '1.5px',
            },
          },
          input: {
            color: isDark ? '#F8FAFC' : '#0F172A',
            '&::placeholder': {
              color: isDark ? '#64748B' : '#94A3B8',
              opacity: 1,
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: isDark ? '#94A3B8' : '#475569',
            fontSize: '0.875rem',
            '&.Mui-focused': {
              color: '#10B981',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: isDark
              ? '1px solid rgba(255, 255, 255, 0.06)'
              : '1px solid rgba(15, 23, 42, 0.08)',
            padding: '14px 18px',
          },
          head: {
            fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: isDark ? '#94A3B8' : '#475569',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(15, 23, 42, 0.03)',
          },
        },
      },
    },
  });
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ColorMode>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('porto-theme-mode', next);
      return next;
    });
  };

  const activeTheme = useMemo(() => createAppTheme(mode), [mode]);

  return React.createElement(
    ColorModeContext.Provider,
    { value: { mode, toggleColorMode } },
    React.createElement(
      ThemeProvider,
      { theme: activeTheme },
      React.createElement(CssBaseline, null),
      children
    )
  );
}

const defaultTheme = createAppTheme('dark');
export default defaultTheme;

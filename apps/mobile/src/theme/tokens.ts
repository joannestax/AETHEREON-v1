/**
 * AETHERON — Finance God visual language
 * Matched to founder mockups: deep navy, metallic gold, electric cyan.
 * Edit THIS file to change the whole app’s look.
 */

export const colors = {
  space: {
    void: '#020617',
    deep: '#050A18',
    abyss: '#0A0E1A',
    navy: '#0B1220',
    nebula: '#12182A',
  },
  gold: {
    primary: '#C5A059',
    bright: '#D4AF37',
    soft: '#E8C872',
    muted: 'rgba(197, 160, 89, 0.55)',
    ghost: 'rgba(197, 160, 89, 0.16)',
  },
  cyan: {
    primary: '#00D2FF',
    electric: '#00E5FF',
    soft: '#7EEBFF',
    muted: 'rgba(0, 210, 255, 0.45)',
    ghost: 'rgba(0, 210, 255, 0.14)',
    border: 'rgba(0, 210, 255, 0.28)',
  },
  signal: {
    bullish: '#22C55E',
    bullishSoft: 'rgba(34, 197, 94, 0.18)',
    bearish: '#EF4444',
    bearishSoft: 'rgba(239, 68, 68, 0.18)',
    neutral: '#94A3B8',
    neutralSoft: 'rgba(148, 163, 184, 0.16)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B8C0CC',
    tertiary: '#7A8494',
    gold: '#C5A059',
    cyan: '#00D2FF',
  },
  glass: {
    fill: 'rgba(8, 14, 28, 0.72)',
    fillStrong: 'rgba(5, 10, 22, 0.88)',
    stroke: 'rgba(0, 210, 255, 0.28)',
    strokeGold: 'rgba(197, 160, 89, 0.4)',
  },
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const typography = {
  brand: {
    fontFamily: 'Cinzel_700Bold',
    letterSpacing: 2,
  },
  display: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    letterSpacing: 0.5,
  },
  ui: {
    fontFamily: 'DMSans_400Regular',
  },
  uiMedium: {
    fontFamily: 'DMSans_500Medium',
  },
  uiBold: {
    fontFamily: 'DMSans_700Bold',
  },
} as const;

export const shadows = {
  goldGlow: {
    shadowColor: '#C5A059',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  cyanGlow: {
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
} as const;

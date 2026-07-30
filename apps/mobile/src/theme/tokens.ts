/**
 * AETHERON — Finance God visual language
 * Gold = authority · Cyan = intelligence / live data · Deep space = realm
 */

export const colors = {
  space: {
    void: '#000000',
    deep: '#050508',
    abyss: '#0A0A0F',
    navy: '#0B1220',
    nebula: '#12182A',
  },
  gold: {
    primary: '#D4AF37',
    bright: '#FFD700',
    soft: '#E8C872',
    muted: 'rgba(212, 175, 55, 0.55)',
    ghost: 'rgba(212, 175, 55, 0.18)',
  },
  cyan: {
    primary: '#00E5FF',
    electric: '#00FFFF',
    soft: '#7EEBFF',
    muted: 'rgba(0, 229, 255, 0.45)',
    ghost: 'rgba(0, 229, 255, 0.14)',
    border: 'rgba(0, 229, 255, 0.22)',
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
    primary: '#F5F7FA',
    secondary: '#B8C0CC',
    tertiary: '#7A8494',
    gold: '#D4AF37',
    cyan: '#00E5FF',
  },
  glass: {
    fill: 'rgba(12, 18, 32, 0.72)',
    fillStrong: 'rgba(8, 12, 22, 0.88)',
    stroke: 'rgba(0, 229, 255, 0.2)',
    strokeGold: 'rgba(212, 175, 55, 0.35)',
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
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  cyanGlow: {
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
} as const;

// Maqra Design System Theme Tokens
// Inspired by Moroccan visual identity (Majorelle Blue, Terracotta, Mint, Zellige patterns)

export const COLORS = {
  background: '#0F0E1A', // Deep navy-black background
  surface: '#1A1826',    // Surface container background
  card: '#221F33',       // Card background
  
  primary: '#1B4FE4',    // Majorelle Blue (active states, progress, CTA buttons)
  secondary: '#C1440E',  // Terracotta (warnings, goals, streaks, warning badges)
  tertiary: '#1D9E75',   // Mint green (success, finished, positive highlights)
  
  textPrimary: '#FFFFFF',
  textSecondary: '#A09EC0', // Muted text
  
  border: '#2E2B45',     // Subtle zellige-color border
  borderLight: '#3E3B59',
  
  shadowColor: '#000000',
};

export const TYPOGRAPHY = {
  // Font scale (Inter is the target font, falls back to system)
  displayLarge: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  displayMedium: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  titleLarge: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  titleMedium: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.textPrimary,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
  }
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  containerMargin: 20,
  gutter: 12,
};

export const SHAPES = {
  cardRadius: 12,
  buttonRadius: 8,
  pillRadius: 999,
};

// Zellige Geometric Border SVGs or Canvas Drawing Patterns can be represented here if needed,
// but for standard React Native styling we can use styles like:
export const ZELLIGE_STYLES = {
  borderMotif: {
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    borderStyle: 'dashed', // Dashed border gives a nice cultural texture vibe
  },
  leftAccent: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  leftAccentTerracotta: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  leftAccentMint: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.tertiary,
  }
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  SHAPES,
  ZELLIGE_STYLES,
};

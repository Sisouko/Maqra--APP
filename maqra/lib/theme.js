// Maqra Design System Theme Tokens
// Inspired by Moroccan visual identity (Majorelle Blue, Terracotta, Mint, Zellige patterns)

export const COLORS = {
  background: '#000000', // Deep black background
  surface: '#121212',    // Dark surface container background
  card: '#1A1A1A',       // Dark Charcoal card background
  
  primary: '#FF0055',    // Hot Pink/Magenta (Primary CTA / active states)
  secondary: '#FF00AE',  // Vibrant Neon Pink (Secondary / Highlight)
  tertiary: '#D500F9',   // Neon Purple/Magenta (Special status / completed states)
  
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0', // Light Gray text
  
  border: '#2A2A2A',     // Subtle dark border
  borderLight: '#3A3A3A',
  
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
  cardRadius: 16,
  buttonRadius: 999, // Fully rounded capsule buttons
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

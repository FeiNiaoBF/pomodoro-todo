import { Platform } from 'react-native';

const headingFamily = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

const bodyFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'sans-serif',
});

export const tokens = {
  colors: {
    primary: '#E85D4F',
    primaryHover: '#D94F42',
    primarySoft: '#FFE0DC',
    background: '#F8F6F2',
    surface: '#FFFDF9',
    surfaceSoft: '#FFF0ED',
    text: '#2D2422',
    muted: '#8C7A77',
    outline: '#E0BFBB',
    accent: '#F4A261',
    accentSoft: '#FFE7CF',
    success: '#7BAE7F',
    error: '#BA1A1A',
    navActive: '#5A3934',
    navInactive: '#B29A95',
  },
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 48,
  },
  radius: {
    control: 8,
    card: 16,
    modal: 24,
    hero: 32,
    pill: 999,
  },
  typography: {
    headingFamily,
    bodyFamily,
    title: 32,
    section: 24,
    body: 15,
    caption: 12,
    button: 16,
  },
  shadow: {
    shadowColor: '#E85D4F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

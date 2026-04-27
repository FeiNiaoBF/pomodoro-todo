import { ColorSchemeName } from 'react-native';
import { OneTomatoTheme } from '../storage/settingsStorage';
import { tokens } from './tokens';

export const lightThemeColors = {
  ...tokens.colors,
} as const;

export const darkThemeColors = {
  primary: '#FF7A6E',
  primaryHover: '#FF8F84',
  primarySoft: '#4A2420',
  background: '#171211',
  surface: '#241B19',
  surfaceSoft: '#302321',
  text: '#F8F0ED',
  muted: '#BBA5A0',
  outline: '#5A403C',
  accent: '#F4A261',
  accentSoft: '#4A3325',
  success: '#9BC79E',
  error: '#FFB4AB',
  navActive: '#F8F0ED',
  navInactive: '#8F7771',
  cardTranslucent: 'rgba(36, 27, 25, 0.9)',
  cardStrong: '#2B201E',
  bloomTop: '#4A2420',
  bloomBottom: '#3A271F',
  onPrimary: '#2D1714',
  onAccent: '#2D1D12',
  overlay: 'rgba(9, 6, 5, 0.55)',
  input: '#211817',
  disabled: '#2A201E',
  disabledText: '#7F6964',
} as const;

export type AppThemeColors = typeof lightThemeColors;

export function resolveThemeMode(
  preference: OneTomatoTheme,
  systemScheme: ColorSchemeName
) {
  if (preference === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }

  return preference;
}

export function getAppTheme(
  preference: OneTomatoTheme,
  systemScheme: ColorSchemeName
) {
  const mode = resolveThemeMode(preference, systemScheme);

  return {
    ...tokens,
    colors: mode === 'dark' ? darkThemeColors : lightThemeColors,
    mode,
    isDark: mode === 'dark',
  } as const;
}

export type AppTheme = ReturnType<typeof getAppTheme>;

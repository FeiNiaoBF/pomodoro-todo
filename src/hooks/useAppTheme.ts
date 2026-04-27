import { useColorScheme } from 'react-native';
import { useSettings } from './useSettings';
import { getAppTheme } from '../theme/appTheme';

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const { settings } = useSettings();

  return getAppTheme(settings.theme, systemScheme);
}

import { useSettingsContext } from '../state/SettingsProvider';

export function useSettings() {
  return useSettingsContext();
}

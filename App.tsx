import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppTheme } from './src/hooks/useAppTheme';
import { RootNavigator } from './src/navigation/RootNavigator';
import { PomodoroProvider } from './src/state/PomodoroProvider';
import { SettingsProvider } from './src/state/SettingsProvider';
import { TasksProvider } from './src/state/TasksProvider';
import { appFonts } from './src/theme/fonts';
import { tokens } from './src/theme/tokens';

export default function App() {
  const [fontsLoaded, fontError] = useFonts(appFonts);

  if (!fontsLoaded && !fontError) {
    return <View style={{ flex: 1, backgroundColor: tokens.colors.background }} />;
  }

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <TasksProvider>
          <PomodoroProvider>
            <AppContent />
          </PomodoroProvider>
        </TasksProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const theme = useAppTheme();

  return (
    <NavigationContainer>
      <RootNavigator />
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

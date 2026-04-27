import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { PomodoroProvider } from './src/state/PomodoroProvider';
import { initializeStorage } from './src/utils/StorageService';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  // 初始化存储
  useEffect(() => {
    const init = async () => {
      try {
        await initializeStorage();
        setIsReady(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsReady(true); // 无论如何继续
      }
    };
    init();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <PomodoroProvider>
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style="dark" />
      </NavigationContainer>
    </PomodoroProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

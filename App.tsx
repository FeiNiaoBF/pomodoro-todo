import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { PomodoroProvider } from './src/state/PomodoroProvider';
import { TasksProvider } from './src/state/TasksProvider';

export default function App() {
  return (
    <TasksProvider>
      <PomodoroProvider>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
      </PomodoroProvider>
    </TasksProvider>
  );
}

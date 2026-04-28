import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList, RootTabParamList } from './types';
import { TodayScreen } from '../screens/TodayScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { FocusScreen } from '../screens/FocusScreen';
import { BreakScreen } from '../screens/BreakScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useAppTheme } from '../hooks/useAppTheme';
import { tokens } from '../theme/tokens';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabGlyph({
  focused,
  variant,
}: {
  focused: boolean;
  variant: 'today' | 'tasks' | 'insights';
}) {
  const theme = useAppTheme();
  const activeColor = focused ? theme.colors.navActive : theme.colors.navInactive;

  if (variant === 'today') {
    return (
      <View style={[styles.todayIcon, { borderColor: activeColor }]}>
        <View style={[styles.todayIconCore, { backgroundColor: activeColor }]} />
      </View>
    );
  }

  if (variant === 'tasks') {
    return (
      <View style={styles.tasksIcon}>
        {[0, 1, 2].map(line => (
          <View
            key={line}
            style={[styles.tasksLine, { backgroundColor: activeColor }]}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.insightsIcon}>
      {[10, 15, 8].map((height, index) => (
        <View
          key={index}
          style={[
            styles.insightsBar,
            { height, backgroundColor: activeColor },
          ]}
        />
      ))}
    </View>
  );
}

function MainTabs() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 12);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.outline,
            height: 78 + bottomInset,
            paddingBottom: bottomInset + 8,
          },
        ],
        tabBarActiveTintColor: theme.colors.navActive,
        tabBarInactiveTintColor: theme.colors.navInactive,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarLabel: 'Today',
          tabBarIcon: ({ focused }) => <TabGlyph focused={focused} variant="today" />,
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ focused }) => <TabGlyph focused={focused} variant="tasks" />,
        }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          tabBarLabel: 'Insights',
          tabBarIcon: ({ focused }) => <TabGlyph focused={focused} variant="insights" />,
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Focus"
        component={FocusScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Break"
        component={BreakScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabBarItem: {
    minHeight: 58,
    paddingTop: 4,
    paddingBottom: 4,
  },
  tabBarIcon: {
    marginTop: 2,
  },
  tabBarLabel: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3,
    fontFamily: tokens.typography.bodyFamily,
    fontWeight: '600',
  },
  todayIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayIconCore: {
    width: 10,
    height: 10,
    borderRadius: 10,
  },
  tasksIcon: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    gap: 3,
  },
  tasksLine: {
    height: 2,
    borderRadius: 2,
  },
  insightsIcon: {
    width: 22,
    height: 22,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  insightsBar: {
    width: 4,
    borderRadius: 4,
  },
});

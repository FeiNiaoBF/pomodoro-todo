import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { RootTabParamList } from './types';
import { TimerScreen } from '../screens/TimerScreen';
import { TodoScreen } from '../screens/TodoScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

/**
 * 根导航器 - 底部 Tab 导航
 * 四个主要屏幕常驻底部
 */
export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#E53935',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Timer"
        component={TimerScreen}
        options={{
          tabBarLabel: '计时',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⏱️</Text>,
        }}
      />
      <Tab.Screen
        name="Todos"
        component={TodoScreen}
        options={{
          tabBarLabel: '任务',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text>,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarLabel: '统计',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: '设置',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFF8F0',
    borderTopColor: '#E0E0E0',
    borderTopWidth: 1,
    paddingBottom: 5,
    paddingTop: 5,
    height: 65,
  },
  tabBarLabel: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  },
});

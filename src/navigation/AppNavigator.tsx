import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { TimerScreen } from '../screens/TimerScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1a1a2e',
            borderTopColor: 'rgba(255,255,255,0.1)',
            borderTopWidth: 0.5,
            paddingBottom: 8,
            height: 60,
          },
          tabBarActiveTintColor: '#E53935',
          tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
          tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        }}
      >
        <Tab.Screen
          name="Timer"
          component={TimerScreen}
          options={{
            tabBarLabel: '番茄钟',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🍅</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

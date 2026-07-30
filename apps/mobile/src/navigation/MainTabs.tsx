import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, typography } from '../theme/tokens';
import { ChatScreen } from '../screens/ChatScreen';
import { ObservatoryScreen } from '../screens/ObservatoryScreen';
import {
  InsightsScreen,
  ProfileScreen,
  WatchlistsScreen,
} from '../screens/SecondaryScreens';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Observatory: '✦',
    Chat: '◎',
    Watchlists: '☆',
    Insights: '☰',
    Profile: '◉',
  };
  return (
    <Text style={{ color: focused ? colors.gold.bright : colors.text.tertiary, fontSize: 16 }}>
      {icons[label] ?? '•'}
    </Text>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.gold.bright,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Observatory" component={ObservatoryScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'Aetheron' }} />
      <Tab.Screen name="Watchlists" component={WatchlistsScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#070A12',
    borderTopColor: 'rgba(212,175,55,0.28)',
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
  label: {
    ...typography.uiMedium,
    fontSize: 10,
    letterSpacing: 0.4,
  },
});

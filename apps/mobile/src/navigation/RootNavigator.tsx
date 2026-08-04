import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/tokens';
import { SignatureAnalysisScreen } from '../screens/SignatureAnalysisScreen';
import { QuotesCommandCenterScreen } from '../screens/QuotesCommandCenterScreen';
import { BearfallRunScreen } from '../screens/BearfallRunScreen';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.space.void,
    card: colors.space.abyss,
    primary: colors.gold.primary,
    text: colors.text.primary,
    border: colors.cyan.border,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="SignatureAnalysis" component={SignatureAnalysisScreen} />
        <Stack.Screen name="QuotesCommandCenter" component={QuotesCommandCenterScreen} />
        <Stack.Screen name="BearfallRun" component={BearfallRunScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

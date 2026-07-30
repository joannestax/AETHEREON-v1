import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Cinzel_700Bold,
} from '@expo-google-fonts/cinzel';
import {
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { DEMO_SIGNATURE_ANALYSIS } from './src/data/demoSignatureAnalysis';
import { SignatureAnalysisScreen } from './src/screens/SignatureAnalysisScreen';
import { colors, typography } from './src/theme/tokens';

export default function App() {
  const [fontsLoaded] = useFonts({
    Cinzel_700Bold,
    CormorantGaramond_600SemiBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.gold.primary} size="large" />
        <Text style={styles.bootText}>Summoning Aetheron…</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <>
      <SignatureAnalysisScreen analysis={DEMO_SIGNATURE_ANALYSIS} />
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.space.void,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  bootText: {
    ...typography.uiMedium,
    color: colors.gold.primary,
    letterSpacing: 1.2,
  },
});

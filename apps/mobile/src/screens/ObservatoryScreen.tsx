import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AetheronOrb } from '../components/avatar/AetheronOrb';
import { MarketDataCard } from '../components/observatory/MarketDataCard';
import { WatchlistCard } from '../components/observatory/WatchlistCard';
import { CosmicBackground } from '../components/ui/CosmicBackground';
import { GlassCard } from '../components/ui/GlassCard';
import { DEMO_OBSERVATORY } from '../data/demoObservatory';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme/tokens';

export function ObservatoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const data = DEMO_OBSERVATORY;

  return (
    <CosmicBackground>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.top}>
          <Text style={styles.compass}>✦</Text>
          <View style={styles.titles}>
            <Text style={styles.brand}>ORIGO</Text>
            <Text style={styles.sub}>NEXUS OBSERVATORY</Text>
          </View>
          <Text style={styles.bell}>◉</Text>
        </View>
        <Text style={styles.tag}>Market intelligence. Beyond the horizon.</Text>

        <View style={styles.hero}>
          <AetheronOrb size={132} form="sphere" />
          <Text style={styles.aetheron}>AETHERON</Text>
          <Text style={styles.copilot}>AI CO-PILOT</Text>
        </View>

        {data.quoteOfTheDay ? (
          <GlassCard accent="gold" style={styles.quoteCard}>
            <Text style={styles.quoteLabel}>DAILY TRANSMISSION</Text>
            <Text style={styles.quote}>“{data.quoteOfTheDay}”</Text>
          </GlassCard>
        ) : null}

        <GlassCard>
          <Text style={styles.cardTitle}>AI MARKET SUMMARY</Text>
          <Text style={styles.summary}>{data.marketSummary}</Text>
          <Text style={styles.generated}>Generated for UI — awaiting live macro tools</Text>
        </GlassCard>

        <WatchlistCard
          items={data.watchlist}
          onPressTicker={(ticker) =>
            navigation.navigate('SignatureAnalysis', { ticker })
          }
        />

        <MarketDataCard items={data.marketStrip} />

        <Text style={styles.footer}>ORIGO NEXUS — PROJECT GENESIS</Text>
      </ScrollView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 52,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compass: {
    color: colors.gold.primary,
    fontSize: 18,
    width: 28,
  },
  bell: {
    color: colors.gold.primary,
    fontSize: 16,
    width: 28,
    textAlign: 'right',
  },
  titles: { alignItems: 'center' },
  brand: {
    ...typography.brand,
    color: colors.gold.bright,
    fontSize: 28,
  },
  sub: {
    ...typography.uiMedium,
    color: colors.gold.soft,
    fontSize: 10,
    letterSpacing: 2,
  },
  tag: {
    ...typography.ui,
    color: colors.cyan.soft,
    textAlign: 'center',
    fontSize: 12,
    marginTop: -8,
  },
  hero: {
    alignItems: 'center',
    gap: 4,
  },
  aetheron: {
    ...typography.uiBold,
    color: colors.gold.bright,
    fontSize: 16,
    letterSpacing: 3,
    marginTop: spacing.sm,
  },
  copilot: {
    ...typography.uiMedium,
    color: colors.cyan.primary,
    fontSize: 10,
    letterSpacing: 2,
  },
  quoteCard: { gap: spacing.sm },
  quoteLabel: {
    ...typography.uiBold,
    color: colors.gold.primary,
    fontSize: 10,
    letterSpacing: 1.8,
  },
  quote: {
    ...typography.display,
    color: colors.text.primary,
    fontSize: 22,
    lineHeight: 28,
  },
  cardTitle: {
    ...typography.uiBold,
    color: colors.gold.primary,
    fontSize: 12,
    letterSpacing: 1.8,
    marginBottom: spacing.md,
  },
  summary: {
    ...typography.ui,
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 21,
  },
  generated: {
    ...typography.ui,
    color: colors.text.tertiary,
    fontSize: 11,
    marginTop: spacing.md,
  },
  footer: {
    ...typography.uiMedium,
    color: colors.text.tertiary,
    textAlign: 'center',
    fontSize: 10,
    letterSpacing: 1.6,
    marginTop: spacing.md,
  },
});

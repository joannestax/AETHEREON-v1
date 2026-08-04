import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AetheronOrb } from '../components/avatar/AetheronOrb';
import { MarketDataCard } from '../components/observatory/MarketDataCard';
import { WatchlistCard } from '../components/observatory/WatchlistCard';
import { CosmicBackground } from '../components/ui/CosmicBackground';
import { CosmicButton, StatusChip } from '../components/ui/CosmicButton';
import { GlassCard } from '../components/ui/GlassCard';
import { fetchObservatoryLive } from '../api/marketClient';
import { DEMO_OBSERVATORY } from '../data/demoObservatory';
import type { RootStackParamList } from '../navigation/types';
import type { ObservatoryData } from '../types/observatory';
import { colors, spacing, typography } from '../theme/tokens';

export function ObservatoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [data, setData] = useState<ObservatoryData>(DEMO_OBSERVATORY);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const loadSeq = useRef(0);

  const load = useCallback(async () => {
    const seq = ++loadSeq.current;
    const next = await fetchObservatoryLive();
    if (seq !== loadSeq.current) return;
    setData(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), 60000);
    return () => clearInterval(id);
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <CosmicBackground>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gold.primary}
          />
        }
      >
        <View style={styles.top}>
          <Text style={styles.compass}>✦</Text>
          <View style={styles.titles}>
            <Text style={styles.brand}>ORIGO</Text>
            <Text style={styles.sub}>NEXUS OBSERVATORY</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('QuotesCommandCenter')}>
            <Text style={styles.bell}>◉</Text>
          </Pressable>
        </View>
        <Text style={styles.tag}>Market intelligence. Beyond the horizon.</Text>

        <View style={styles.hero}>
          <AetheronOrb size={140} form="sphere" />
          <Text style={styles.aetheron}>AETHERON</Text>
          <Text style={styles.copilot}>AI CO-PILOT</Text>
          <View style={styles.statusRow}>
            <StatusChip
              label={data.live ? 'LIVE FEEDS' : 'OFFLINE SHELL'}
              tone={data.live ? 'green' : 'gold'}
            />
            <StatusChip label="ORBITAL SYNC NOMINAL" tone="cyan" />
          </View>
        </View>

        <View style={styles.actions}>
          <CosmicButton
            label="ASK AETHERON"
            variant="gold"
            compact
            onPress={() => navigation.navigate('MainTabs', { screen: 'Chat' })}
          />
          <CosmicButton
            label="SIGNATURE ANALYSIS"
            variant="cyan"
            compact
            onPress={() => navigation.navigate('SignatureAnalysis', { ticker: 'NVDA' })}
          />
          <CosmicButton
            label="BEARFALL RUN"
            variant="ghost"
            compact
            onPress={() => navigation.navigate('BearfallRun')}
          />
        </View>

        {data.quoteOfTheDay ? (
          <GlassCard accent="gold" glow="gold" style={styles.quoteCard}>
            <Text style={styles.quoteLabel}>DAILY TRANSMISSION</Text>
            <Text style={styles.quote}>“{data.quoteOfTheDay}”</Text>
          </GlassCard>
        ) : null}

        <GlassCard glow="cyan">
          <Text style={styles.cardTitle}>✦ AI MARKET SUMMARY</Text>
          {loading ? (
            <ActivityIndicator color={colors.cyan.primary} />
          ) : (
            <>
              <Text style={styles.summary}>{data.marketSummary}</Text>
              <Text style={styles.generated}>
                {data.live
                  ? `Live · updated ${new Date(data.summaryGeneratedAt).toLocaleTimeString()}`
                  : 'Generated offline — connect backend for live macro'}
              </Text>
            </>
          )}
        </GlassCard>

        <WatchlistCard
          items={data.watchlist}
          live={data.live}
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
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
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

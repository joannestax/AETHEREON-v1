import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AETHERON } from '../constants/aetheron';
import { DEMO_SIGNATURE_ANALYSIS } from '../data/demoSignatureAnalysis';
import { fetchQuote } from '../api/marketClient';
import { colors, spacing, typography } from '../theme/tokens';
import type { SignatureAnalysis } from '../types/signatureAnalysis';
import { AetheronOrb } from '../components/avatar/AetheronOrb';
import { FundamentalSection } from '../components/analysis/FundamentalSection';
import { LiquiditySection } from '../components/analysis/LiquiditySection';
import { LongTermTargetSection } from '../components/analysis/LongTermTargetSection';
import { SignalSection } from '../components/analysis/SignalSection';
import { SwingTradeSection } from '../components/analysis/SwingTradeSection';
import { TechnicalSection } from '../components/analysis/TechnicalSection';
import { CosmicBackground } from '../components/ui/CosmicBackground';
import { SignalBadge } from '../components/ui/SignalBadge';
import { StatusChip } from '../components/ui/CosmicButton';
import type { RootStackParamList } from '../navigation/types';

type NavProps = NativeStackScreenProps<RootStackParamList, 'SignatureAnalysis'>;

type Props = Partial<NavProps> & {
  analysis?: SignatureAnalysis;
};

export function SignatureAnalysisScreen({ analysis: analysisProp, route, navigation }: Props) {
  const tickerParam = route?.params?.ticker?.toUpperCase();
  const [liveQuote, setLiveQuote] = useState<{
    price: number | null;
    changePercent: number | null;
    name?: string;
    isLive?: boolean;
  } | null>(null);

  useEffect(() => {
    if (!tickerParam) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetchQuote(tickerParam);
        if (!cancelled && res.quote) {
          setLiveQuote({
            price: res.quote.price,
            changePercent: res.quote.changePercent,
            name: res.quote.name,
            isLive: res.quote.isLive,
          });
        }
      } catch {
        if (!cancelled) setLiveQuote(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tickerParam]);

  const analysis = useMemo(() => {
    const base = analysisProp ?? DEMO_SIGNATURE_ANALYSIS;
    if (!tickerParam) return base;

    const hasLivePrice = liveQuote?.price != null;
    return {
      ...base,
      ticker: tickerParam,
      companyName: liveQuote?.name ?? `${tickerParam} — resolve via live data`,
      // Keep structural sections illustrative until full tool-built thesis exists;
      // header price uses live mark when available.
      price: hasLivePrice ? (liveQuote!.price as number) : base.price,
      change: hasLivePrice
        ? ((liveQuote!.changePercent ?? 0) / 100) * (liveQuote!.price as number)
        : base.change,
      changePercent: hasLivePrice
        ? (liveQuote!.changePercent ?? 0)
        : base.changePercent,
      isIllustrative: !hasLivePrice,
      liquidity: {
        ...base.liquidity,
        current: hasLivePrice ? (liveQuote!.price as number) : base.liquidity.current,
      },
    };
  }, [analysisProp, tickerParam, liveQuote]);

  const { width } = useWindowDimensions();
  const changePositive = analysis.change >= 0;
  const headerLive = Boolean(liveQuote?.isLive && liveQuote.price != null);

  return (
    <CosmicBackground>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: spacing.xxxl + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          {navigation ? (
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backText}>← BACK</Text>
            </Pressable>
          ) : (
            <View style={styles.backBtn} />
          )}
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.brandMark}>ORIGO NEXUS</Text>
            <Text style={styles.brandSub}>AI MENTOR · SIGNATURE ANALYSIS</Text>
          </View>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.avatarBlock}>
          <AetheronOrb size={Math.min(148, width * 0.38)} form="titan" />
          <Text style={styles.aetheronName}>{AETHERON.name.toUpperCase()}</Text>
          <Text style={styles.tagline}>{AETHERON.tagline}</Text>
          <StatusChip
            label={headerLive ? 'LIVE MARK' : 'SAMPLE STRUCTURE'}
            tone={headerLive ? 'green' : 'gold'}
          />
        </View>

        {analysis.isIllustrative && (
          <View style={styles.demoBanner}>
            <Text style={styles.demoText}>
              ILLUSTRATIVE STRUCTURE — Levels/targets are sample format until tools
              fill them. Header mark stays blank or live — never invented.
            </Text>
          </View>
        )}
        {headerLive && (
          <View style={styles.liveBanner}>
            <Text style={styles.liveText}>
              Live price from market feed. Thesis sections still require Grok tool
              loop + verified inputs before conviction levels are published.
            </Text>
          </View>
        )}

        <View style={styles.thesisHeader}>
          <Text style={styles.ticker}>${analysis.ticker}</Text>
          <Text style={styles.company}>{analysis.companyName.toUpperCase()}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {headerLive || !analysis.isIllustrative
                ? `$${analysis.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : '—'}
            </Text>
            {(headerLive || !analysis.isIllustrative) && (
              <Text
                style={[
                  styles.change,
                  { color: changePositive ? colors.signal.bullish : colors.signal.bearish },
                ]}
              >
                {changePositive ? '+' : ''}
                {analysis.changePercent.toFixed(2)}%
              </Text>
            )}
          </View>
          <View style={styles.signalRow}>
            <SignalBadge signal={analysis.signal} size="lg" />
            <Text style={styles.confidenceInline}>
              {analysis.swing.confidence}/100
            </Text>
          </View>
          <Text style={styles.asOf}>
            As of {new Date(analysis.asOf).toUTCString()}
          </Text>
        </View>

        <View style={styles.sections}>
          <TechnicalSection analysis={analysis} />
          <FundamentalSection analysis={analysis} />
          <LiquiditySection analysis={analysis} />
          <LongTermTargetSection analysis={analysis} />
          <SwingTradeSection analysis={analysis} />
          <SignalSection analysis={analysis} />
        </View>

        <Text style={styles.footer}>
          {AETHERON.product} — {AETHERON.name.toUpperCase()} · {AETHERON.project}
        </Text>
      </ScrollView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 56,
    paddingHorizontal: spacing.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backBtn: {
    width: 64,
  },
  backText: {
    ...typography.uiMedium,
    color: colors.cyan.primary,
    fontSize: 11,
    letterSpacing: 1,
  },
  brandMark: {
    ...typography.brand,
    color: colors.gold.primary,
    fontSize: 16,
  },
  brandSub: {
    ...typography.uiMedium,
    color: colors.cyan.primary,
    fontSize: 9,
    letterSpacing: 1.4,
    marginTop: 4,
  },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  aetheronName: {
    ...typography.brand,
    color: colors.gold.bright,
    fontSize: 22,
    marginTop: spacing.sm,
  },
  tagline: {
    ...typography.ui,
    color: colors.cyan.soft,
    fontSize: 12,
    letterSpacing: 0.6,
  },
  demoBanner: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.45)',
    backgroundColor: 'rgba(239,68,68,0.12)',
  },
  demoText: {
    ...typography.uiMedium,
    color: '#FCA5A5',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  liveBanner: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cyan.border,
    backgroundColor: colors.cyan.ghost,
  },
  liveText: {
    ...typography.uiMedium,
    color: colors.cyan.soft,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  thesisHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: 6,
  },
  ticker: {
    ...typography.brand,
    color: colors.gold.bright,
    fontSize: 36,
  },
  company: {
    ...typography.uiMedium,
    color: colors.text.secondary,
    fontSize: 12,
    letterSpacing: 1.4,
  },
  priceRow: {
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 4,
  },
  price: {
    ...typography.display,
    color: colors.text.primary,
    fontSize: 40,
  },
  change: {
    ...typography.uiBold,
    fontSize: 14,
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  confidenceInline: {
    ...typography.uiBold,
    color: colors.gold.primary,
    fontSize: 16,
    letterSpacing: 1,
  },
  asOf: {
    ...typography.ui,
    color: colors.text.tertiary,
    fontSize: 11,
    marginTop: spacing.sm,
  },
  sections: {
    gap: spacing.lg,
  },
  footer: {
    ...typography.uiMedium,
    color: colors.text.tertiary,
    fontSize: 10,
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});

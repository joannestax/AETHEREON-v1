import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import type { SignatureAnalysis } from '../../types/signatureAnalysis';
import { ConvictionMeter } from '../ui/ConvictionMeter';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeader } from '../ui/SectionHeader';
import { SignalBadge } from '../ui/SignalBadge';

type Props = { analysis: SignatureAnalysis };

export function SwingTradeSection({ analysis }: Props) {
  const { swing } = analysis;

  return (
    <GlassCard>
      <SectionHeader title="Swing Trade Setup" index={5}>
        <View style={styles.biasRow}>
          <Text style={styles.fieldLabel}>BIAS</Text>
          <SignalBadge signal={swing.bias} />
        </View>

        <View style={styles.grid}>
          <Metric
            label="ENTRY ZONE"
            value={`${money(swing.entryZone.low)} – ${money(swing.entryZone.high)}`}
            tone="cyan"
          />
          <Metric label="STOP / INVALIDATION" value={money(swing.stop)} tone="red" />
          <Metric label="TP1" value={money(swing.targets.tp1)} tone="green" />
          <Metric label="TP2" value={money(swing.targets.tp2)} tone="green" />
          <Metric label="TP3" value={money(swing.targets.tp3)} tone="green" />
        </View>

        <Text style={styles.fieldLabel}>INVALIDATION</Text>
        <Text style={styles.body}>{swing.invalidation}</Text>

        <Text style={styles.fieldLabel}>OPTIONS GUIDANCE</Text>
        <Text style={styles.body}>{swing.optionsGuidance}</Text>

        <ConvictionMeter value={swing.confidence} />
      </SectionHeader>
    </GlassCard>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'cyan' | 'green' | 'red';
}) {
  const color =
    tone === 'green'
      ? colors.signal.bullish
      : tone === 'red'
        ? colors.signal.bearish
        : colors.cyan.primary;

  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
    </View>
  );
}

function money(n: number) {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

const styles = StyleSheet.create({
  biasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    ...typography.uiBold,
    color: colors.gold.primary,
    fontSize: 10,
    letterSpacing: 1.6,
    marginTop: spacing.xs,
  },
  body: {
    ...typography.ui,
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 19,
  },
  grid: {
    gap: spacing.sm,
  },
  metric: {
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1,
    borderColor: colors.cyan.ghost,
  },
  metricLabel: {
    ...typography.uiMedium,
    color: colors.text.tertiary,
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  metricValue: {
    ...typography.uiBold,
    fontSize: 16,
  },
});

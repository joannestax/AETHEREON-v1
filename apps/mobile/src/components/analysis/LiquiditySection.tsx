import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import type { SignatureAnalysis } from '../../types/signatureAnalysis';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeader } from '../ui/SectionHeader';

type Props = { analysis: SignatureAnalysis };

export function LiquiditySection({ analysis }: Props) {
  const { liquidity } = analysis;

  return (
    <GlassCard>
      <SectionHeader title="Liquidity Levels" index={3}>
        <View style={styles.currentWrap}>
          <Text style={styles.currentLabel}>CURRENT</Text>
          <Text style={styles.currentPrice}>{money(liquidity.current)}</Text>
        </View>
        <View style={styles.columns}>
          <View style={styles.col}>
            <Text style={styles.colTitle}>SUPPORT</Text>
            {liquidity.support.map((s) => (
              <View key={s.label} style={[styles.level, styles.support]}>
                <Text style={styles.levelLabel}>{s.label}</Text>
                <Text style={[styles.levelPrice, { color: colors.signal.bullish }]}>
                  {money(s.price)}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.col}>
            <Text style={styles.colTitle}>RESISTANCE</Text>
            {liquidity.resistance.map((r) => (
              <View key={r.label} style={[styles.level, styles.resist]}>
                <Text style={styles.levelLabel}>{r.label}</Text>
                <Text style={[styles.levelPrice, { color: colors.signal.bearish }]}>
                  {money(r.price)}
                </Text>
              </View>
            ))}
          </View>
        </View>
        {liquidity.notes ? <Text style={styles.notes}>{liquidity.notes}</Text> : null}
      </SectionHeader>
    </GlassCard>
  );
}

function money(n: number) {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

const styles = StyleSheet.create({
  currentWrap: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.gold.muted,
    backgroundColor: colors.gold.ghost,
  },
  currentLabel: {
    ...typography.uiMedium,
    color: colors.gold.primary,
    fontSize: 10,
    letterSpacing: 2,
  },
  currentPrice: {
    ...typography.display,
    color: colors.gold.bright,
    fontSize: 36,
    marginTop: 2,
  },
  columns: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  col: {
    flex: 1,
    gap: spacing.sm,
  },
  colTitle: {
    ...typography.uiBold,
    color: colors.cyan.primary,
    fontSize: 10,
    letterSpacing: 1.6,
  },
  level: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
  support: {
    borderColor: 'rgba(34,197,94,0.35)',
    backgroundColor: colors.signal.bullishSoft,
  },
  resist: {
    borderColor: 'rgba(239,68,68,0.35)',
    backgroundColor: colors.signal.bearishSoft,
  },
  levelLabel: {
    ...typography.uiMedium,
    color: colors.text.secondary,
    fontSize: 12,
  },
  levelPrice: {
    ...typography.uiBold,
    fontSize: 13,
  },
  notes: {
    ...typography.ui,
    color: colors.text.tertiary,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import type { SignatureAnalysis } from '../../types/signatureAnalysis';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeader } from '../ui/SectionHeader';
import { SignalBadge } from '../ui/SignalBadge';

type Props = { analysis: SignatureAnalysis };

export function SignalSection({ analysis }: Props) {
  const bullish = analysis.signal === 'BULLISH';

  return (
    <GlassCard
      style={{
        borderColor: bullish ? 'rgba(34,197,94,0.55)' : 'rgba(239,68,68,0.55)',
        backgroundColor: bullish ? colors.signal.bullishSoft : colors.signal.bearishSoft,
      }}
    >
      <SectionHeader title="Signal" index={6}>
        <View style={styles.center}>
          <SignalBadge signal={analysis.signal} size="lg" />
          <Text style={styles.declaration}>
            {bullish
              ? 'Aetheron declares a BULLISH bias on this realm.'
              : 'Aetheron declares a BEARISH bias on this realm.'}
          </Text>
          <View style={styles.insight}>
            <Text style={styles.insightLabel}>KEY INSIGHT</Text>
            <Text style={styles.insightBody}>{analysis.keyInsight}</Text>
          </View>
        </View>
      </SectionHeader>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    gap: spacing.md,
  },
  declaration: {
    ...typography.uiMedium,
    color: colors.text.primary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  insight: {
    width: '100%',
    marginTop: spacing.sm,
    padding: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cyan.border,
    backgroundColor: colors.glass.fillStrong,
  },
  insightLabel: {
    ...typography.uiBold,
    color: colors.cyan.primary,
    fontSize: 10,
    letterSpacing: 1.8,
    marginBottom: spacing.sm,
  },
  insightBody: {
    ...typography.ui,
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 21,
  },
});

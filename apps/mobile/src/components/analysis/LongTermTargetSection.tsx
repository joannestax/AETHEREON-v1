import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';
import type { SignatureAnalysis } from '../../types/signatureAnalysis';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeader } from '../ui/SectionHeader';

type Props = { analysis: SignatureAnalysis };

export function LongTermTargetSection({ analysis }: Props) {
  const { longTermTarget } = analysis;

  return (
    <GlassCard accent="gold">
      <SectionHeader title="Long-Term Price Target" index={4}>
        <View style={styles.row}>
          <Text style={styles.target}>
            ${longTermTarget.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </Text>
          <Text style={styles.emoji}>🎯</Text>
        </View>
        <Text style={styles.horizon}>{longTermTarget.horizon.toUpperCase()}</Text>
        <Text style={styles.body}>{longTermTarget.thesis}</Text>
      </SectionHeader>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  target: {
    ...typography.display,
    color: colors.gold.bright,
    fontSize: 42,
  },
  emoji: {
    fontSize: 28,
  },
  horizon: {
    ...typography.uiMedium,
    color: colors.cyan.primary,
    fontSize: 11,
    letterSpacing: 1.8,
  },
  body: {
    ...typography.ui,
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 21,
  },
});

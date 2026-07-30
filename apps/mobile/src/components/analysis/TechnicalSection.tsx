import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';
import type { SignatureAnalysis } from '../../types/signatureAnalysis';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeader } from '../ui/SectionHeader';
import { Sparkline } from './Sparkline';

type Props = { analysis: SignatureAnalysis };

export function TechnicalSection({ analysis }: Props) {
  const { technical } = analysis;

  return (
    <GlassCard>
      <SectionHeader title="Technical Analysis" index={1}>
        <Text style={styles.trend}>{technical.trend}</Text>
        <Text style={styles.body}>{technical.summary}</Text>
        {technical.chartPoints && technical.chartPoints.length > 1 && (
          <View style={styles.chartWrap}>
            <Sparkline points={technical.chartPoints} width={300} height={96} />
          </View>
        )}
        {technical.movingAverages && (
          <View style={styles.maRow}>
            {technical.movingAverages.map((ma) => (
              <View key={ma.label} style={styles.maChip}>
                <View style={[styles.dot, { backgroundColor: ma.color ?? colors.cyan.primary }]} />
                <Text style={styles.maLabel}>{ma.label}</Text>
                <Text style={styles.maValue}>{formatMoney(ma.value)}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.bullets}>
          {technical.structure.map((item) => (
            <Text key={item} style={styles.bullet}>
              ▸ {item}
            </Text>
          ))}
        </View>
      </SectionHeader>
    </GlassCard>
  );
}

function formatMoney(n: number) {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

const styles = StyleSheet.create({
  trend: {
    ...typography.uiMedium,
    color: colors.cyan.primary,
    fontSize: 13,
    letterSpacing: 0.4,
  },
  body: {
    ...typography.ui,
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 21,
  },
  chartWrap: {
    marginTop: spacing.sm,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 12,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cyan.ghost,
  },
  maRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  maChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  maLabel: {
    ...typography.uiMedium,
    color: colors.text.tertiary,
    fontSize: 10,
  },
  maValue: {
    ...typography.uiBold,
    color: colors.text.primary,
    fontSize: 11,
  },
  bullets: {
    gap: 6,
  },
  bullet: {
    ...typography.ui,
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 19,
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import type { SignatureAnalysis } from '../../types/signatureAnalysis';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeader } from '../ui/SectionHeader';

type Props = { analysis: SignatureAnalysis };

export function FundamentalSection({ analysis }: Props) {
  const { fundamental } = analysis;

  return (
    <GlassCard>
      <SectionHeader title="Fundamental Analysis" index={2}>
        <Text style={styles.body}>{fundamental.summary}</Text>
        <View style={styles.grid}>
          {fundamental.metrics.map((m) => (
            <View key={m.label} style={styles.metric}>
              <Text style={styles.metricLabel}>{m.label.toUpperCase()}</Text>
              <Text style={styles.metricValue}>{m.value}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.subhead}>CATALYSTS</Text>
        {fundamental.catalysts.map((c) => (
          <Text key={c} style={styles.bullet}>
            ▸ {c}
          </Text>
        ))}
        <View style={styles.themes}>
          {fundamental.themes.map((t) => (
            <View key={t} style={styles.theme}>
              <Text style={styles.themeText}>{t}</Text>
            </View>
          ))}
        </View>
      </SectionHeader>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.ui,
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 21,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metric: {
    width: '47%',
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1,
    borderColor: colors.cyan.ghost,
  },
  metricLabel: {
    ...typography.uiMedium,
    color: colors.gold.primary,
    fontSize: 9,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  metricValue: {
    ...typography.uiBold,
    color: colors.text.primary,
    fontSize: 14,
  },
  subhead: {
    ...typography.uiBold,
    color: colors.cyan.primary,
    fontSize: 10,
    letterSpacing: 1.6,
    marginTop: spacing.xs,
  },
  bullet: {
    ...typography.ui,
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 19,
  },
  themes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  theme: {
    borderWidth: 1,
    borderColor: colors.gold.muted,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    backgroundColor: colors.gold.ghost,
  },
  themeText: {
    ...typography.uiMedium,
    color: colors.gold.soft,
    fontSize: 11,
    letterSpacing: 0.4,
  },
});

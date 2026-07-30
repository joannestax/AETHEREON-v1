import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import type { MarketStripItem } from '../../types/observatory';
import { GlassCard } from '../ui/GlassCard';

type Props = { items: MarketStripItem[] };

export function MarketDataCard({ items }: Props) {
  return (
    <GlassCard>
      <Text style={styles.title}>MARKET DATA</Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.label} style={styles.cell}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
            {item.change ? (
              <Text style={styles.change}>{item.change}</Text>
            ) : (
              <Text style={styles.awaiting}>Live feed pending</Text>
            )}
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.uiBold,
    color: colors.gold.primary,
    fontSize: 12,
    letterSpacing: 1.8,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  cell: {
    width: '48%',
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1,
    borderColor: colors.cyan.ghost,
  },
  label: {
    ...typography.uiMedium,
    color: colors.text.tertiary,
    fontSize: 9,
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  value: {
    ...typography.uiBold,
    color: colors.text.primary,
    fontSize: 18,
  },
  change: {
    ...typography.uiMedium,
    color: colors.gold.primary,
    fontSize: 11,
    marginTop: 4,
  },
  awaiting: {
    ...typography.ui,
    color: colors.cyan.muted,
    fontSize: 10,
    marginTop: 4,
  },
});

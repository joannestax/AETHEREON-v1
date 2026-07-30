import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';
import type { MarketStripItem } from '../../types/observatory';
import { GlassCard } from '../ui/GlassCard';

type Props = { items: MarketStripItem[] };

export function MarketDataCard({ items }: Props) {
  return (
    <GlassCard glow="cyan">
      <Text style={styles.title}>MARKET DATA</Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.label} style={styles.cell}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
            {item.change ? (
              <Text
                style={[
                  styles.change,
                  {
                    color:
                      item.change.startsWith('-')
                        ? colors.cyan.primary
                        : colors.gold.bright,
                  },
                ]}
              >
                {item.change}
              </Text>
            ) : (
              <Text style={styles.awaiting}>
                {item.isLive ? 'Live' : item.note ?? 'Feed pending'}
              </Text>
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
  },
  cell: {
    width: '50%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderColor: 'rgba(255,255,255,0.08)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
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

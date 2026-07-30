import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import type { WatchlistItem } from '../../types/observatory';
import { Sparkline } from '../analysis/Sparkline';
import { GlassCard } from '../ui/GlassCard';

type Props = {
  items: WatchlistItem[];
  onPressTicker?: (ticker: string) => void;
};

export function WatchlistCard({ items, onPressTicker }: Props) {
  return (
    <GlassCard>
      <View style={styles.header}>
        <Text style={styles.title}>WATCHLISTS</Text>
        <Text style={styles.add}>+</Text>
      </View>
      <Text style={styles.note}>Prices appear when live market data is connected.</Text>
      {items.map((item) => (
        <Pressable
          key={item.ticker}
          style={styles.row}
          onPress={() => onPressTicker?.(item.ticker)}
        >
          <View style={styles.icon}>
            <Text style={styles.iconText}>{item.ticker.slice(0, 1)}</Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.ticker}>{item.ticker}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </View>
          <Sparkline points={item.sparkline} width={56} height={28} />
          <View style={styles.prices}>
            <Text style={styles.price}>
              {item.price != null
                ? `$${item.price.toLocaleString()}`
                : '—'}
            </Text>
            <Text style={styles.change}>
              {item.changePercent != null
                ? `${item.changePercent >= 0 ? '+' : ''}${item.changePercent.toFixed(2)}%`
                : 'Awaiting feed'}
            </Text>
          </View>
        </Pressable>
      ))}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.uiBold,
    color: colors.gold.primary,
    fontSize: 12,
    letterSpacing: 1.8,
  },
  add: {
    ...typography.uiBold,
    color: colors.gold.bright,
    fontSize: 22,
  },
  note: {
    ...typography.ui,
    color: colors.text.tertiary,
    fontSize: 11,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.gold.muted,
    backgroundColor: colors.gold.ghost,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    ...typography.uiBold,
    color: colors.gold.bright,
    fontSize: 12,
  },
  meta: { flex: 1 },
  ticker: {
    ...typography.uiBold,
    color: colors.text.primary,
    fontSize: 14,
  },
  name: {
    ...typography.ui,
    color: colors.text.tertiary,
    fontSize: 11,
  },
  prices: { alignItems: 'flex-end', minWidth: 72 },
  price: {
    ...typography.uiBold,
    color: colors.text.primary,
    fontSize: 13,
  },
  change: {
    ...typography.uiMedium,
    color: colors.cyan.muted,
    fontSize: 10,
  },
});

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import type { WatchlistItem } from '../../types/observatory';
import { Sparkline } from '../analysis/Sparkline';
import { GlassCard } from '../ui/GlassCard';

type Props = {
  items: WatchlistItem[];
  onPressTicker?: (ticker: string) => void;
  live?: boolean;
};

export function WatchlistCard({ items, onPressTicker, live }: Props) {
  return (
    <GlassCard glow="gold">
      <View style={styles.header}>
        <Text style={styles.title}>WATCHLISTS</Text>
        <Text style={styles.add}>+</Text>
      </View>
      <Text style={styles.note}>
        {live
          ? 'Live marks from CoinGecko + Yahoo. Unlisted ORIGO tickers stay blank.'
          : 'Backend offline — start API for live prices. No invented marks.'}
      </Text>
      {items.map((item) => {
        const up = (item.changePercent ?? 0) >= 0;
        const hasPrice = item.price != null;
        return (
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
            {item.sparkline.length > 1 ? (
              <Sparkline points={item.sparkline} width={56} height={28} />
            ) : (
              <View style={{ width: 56 }} />
            )}
            <View style={styles.prices}>
              <Text style={styles.price}>
                {hasPrice
                  ? `$${item.price!.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`
                  : '—'}
              </Text>
              <Text
                style={[
                  styles.change,
                  hasPrice && item.changePercent != null
                    ? { color: up ? colors.gold.bright : colors.cyan.primary }
                    : null,
                ]}
              >
                {hasPrice && item.changePercent != null
                  ? `${item.changePercent >= 0 ? '+' : ''}${item.changePercent.toFixed(2)}%`
                  : hasPrice
                    ? '—'
                    : item.status === 'unlisted'
                      ? 'Unlisted'
                      : 'No feed'}
              </Text>
            </View>
          </Pressable>
        );
      })}
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
    lineHeight: 16,
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
  prices: { alignItems: 'flex-end', minWidth: 78 },
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

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import type { MarketBias, Signal } from '../../types/signatureAnalysis';

type Props = {
  signal: Signal | MarketBias;
  size?: 'sm' | 'lg';
};

export function SignalBadge({ signal, size = 'sm' }: Props) {
  const tone =
    signal === 'BULLISH'
      ? colors.signal.bullish
      : signal === 'BEARISH'
        ? colors.signal.bearish
        : colors.signal.neutral;
  const bg =
    signal === 'BULLISH'
      ? colors.signal.bullishSoft
      : signal === 'BEARISH'
        ? colors.signal.bearishSoft
        : colors.signal.neutralSoft;

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: tone }, size === 'lg' && styles.lg]}>
      <Text style={[styles.text, { color: tone }, size === 'lg' && styles.textLg]}>{signal}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    alignSelf: 'flex-start',
  },
  lg: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  text: {
    ...typography.uiBold,
    fontSize: 11,
    letterSpacing: 1.6,
  },
  textLg: {
    fontSize: 16,
    letterSpacing: 2.4,
  },
});

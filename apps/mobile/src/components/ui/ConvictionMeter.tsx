import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';

type Props = {
  value: number;
  label?: string;
};

export function ConvictionMeter({ value, label = 'CONFIDENCE' }: Props) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.box}>
        <Text style={styles.value}>{clamped}</Text>
        <Text style={styles.denom}>/100</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  label: {
    ...typography.uiMedium,
    color: colors.gold.primary,
    fontSize: 10,
    letterSpacing: 1.8,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'baseline',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.gold.muted,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gold.ghost,
  },
  value: {
    ...typography.uiBold,
    color: colors.gold.bright,
    fontSize: 22,
  },
  denom: {
    ...typography.ui,
    color: colors.text.secondary,
    fontSize: 13,
    marginLeft: 2,
  },
  track: {
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.gold.primary,
  },
});

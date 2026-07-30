import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';

type Variant = 'gold' | 'cyan' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
};

/**
 * Primary UI button — edit variants here to restyle CTAs across the app.
 */
export function CosmicButton({
  label,
  onPress,
  variant = 'gold',
  disabled,
  style,
  compact,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        variantStyles[variant],
        (pressed || disabled) && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.4 },
  label: {
    ...typography.uiBold,
    fontSize: 12,
    letterSpacing: 1.6,
  },
});

const variantStyles = StyleSheet.create({
  gold: {
    backgroundColor: colors.gold.ghost,
    borderColor: colors.gold.muted,
  },
  cyan: {
    backgroundColor: colors.cyan.ghost,
    borderColor: colors.cyan.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.18)',
  },
  danger: {
    backgroundColor: colors.signal.bearishSoft,
    borderColor: 'rgba(239,68,68,0.45)',
  },
});

const labelStyles = StyleSheet.create({
  gold: { color: colors.gold.bright },
  cyan: { color: colors.cyan.primary },
  ghost: { color: colors.text.secondary },
  danger: { color: colors.signal.bearish },
});

/** Tiny status pill used in mockups (LIVE / NOMINAL / etc.) */
export function StatusChip({
  label,
  tone = 'cyan',
}: {
  label: string;
  tone?: 'cyan' | 'gold' | 'green';
}) {
  const color =
    tone === 'gold'
      ? colors.gold.primary
      : tone === 'green'
        ? colors.signal.bullish
        : colors.cyan.primary;
  return (
    <View style={[chipStyles.chip, { borderColor: color }]}>
      <View style={[chipStyles.dot, { backgroundColor: color }]} />
      <Text style={[chipStyles.text, { color }]}>{label}</Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: {
    ...typography.uiBold,
    fontSize: 9,
    letterSpacing: 1.4,
  },
});

import React from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../../theme/tokens';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  accent?: 'cyan' | 'gold';
  glow?: 'cyan' | 'gold' | 'none';
};

export function GlassCard({ children, style, accent = 'cyan', glow = 'none' }: Props) {
  return (
    <View
      style={[
        styles.card,
        accent === 'gold' ? styles.goldBorder : styles.cyanBorder,
        glow === 'gold' && styles.glowGold,
        glow === 'cyan' && styles.glowCyan,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass.fill,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.lg,
    ...(Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } as object)
      : null),
  },
  cyanBorder: {
    borderColor: colors.glass.stroke,
  },
  goldBorder: {
    borderColor: colors.glass.strokeGold,
  },
  glowGold: {
    shadowColor: colors.gold.primary,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  glowCyan: {
    shadowColor: colors.cyan.primary,
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
});

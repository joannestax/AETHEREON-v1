import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../../theme/tokens';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  accent?: 'cyan' | 'gold';
};

export function GlassCard({ children, style, accent = 'cyan' }: Props) {
  return (
    <View
      style={[
        styles.card,
        accent === 'gold' ? styles.goldBorder : styles.cyanBorder,
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
  },
  cyanBorder: {
    borderColor: colors.glass.stroke,
  },
  goldBorder: {
    borderColor: colors.glass.strokeGold,
  },
});

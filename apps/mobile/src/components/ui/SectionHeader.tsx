import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';

type Props = {
  title: string;
  index: number;
  children: React.ReactNode;
};

export function SectionHeader({ title, index, children }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.index}>{String(index).padStart(2, '0')}</Text>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
      </View>
      <View style={styles.rule} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  index: {
    ...typography.uiBold,
    color: colors.cyan.primary,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  title: {
    ...typography.uiBold,
    color: colors.gold.primary,
    fontSize: 12,
    letterSpacing: 1.8,
  },
  rule: {
    height: 1,
    backgroundColor: 'rgba(212,175,55,0.25)',
  },
});

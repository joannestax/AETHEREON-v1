import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ABILITIES } from '../../data/bearfallQuest';
import type { AbilityId } from '../../types/bearfall';
import { colors, radii, spacing, typography } from '../../theme/tokens';

type Props = {
  energy: number;
  rockets: number;
  disabled?: boolean;
  highlight?: AbilityId[];
  onCast: (id: AbilityId) => void;
};

export function AbilityBar({ energy, rockets, disabled, highlight, onCast }: Props) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>SHIP DEFENSES</Text>
      <View style={styles.grid}>
        {ABILITIES.map((ability) => {
          const afford =
            energy >= ability.energyCost &&
            (!ability.limited || rockets > 0);
          const lit = highlight?.includes(ability.id);
          return (
            <Pressable
              key={ability.id}
              disabled={disabled || !afford}
              onPress={() => onCast(ability.id)}
              style={({ pressed }) => [
                styles.btn,
                lit && styles.lit,
                (!afford || disabled) && styles.disabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.short, lit && styles.litText]}>{ability.short}</Text>
              <Text style={styles.name} numberOfLines={1}>
                {ability.name}
              </Text>
              <Text style={styles.cost}>
                {ability.energyCost}E{ability.limited ? ` · ${rockets} RKT` : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.sm },
  title: {
    ...typography.uiBold,
    color: colors.gold.primary,
    fontSize: 10,
    letterSpacing: 1.8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  btn: {
    width: '48%',
    flexGrow: 1,
    minWidth: 140,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cyan.border,
    backgroundColor: 'rgba(8,14,28,0.75)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 2,
  },
  lit: {
    borderColor: colors.gold.bright,
    backgroundColor: colors.gold.ghost,
  },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.8 },
  short: {
    ...typography.uiBold,
    color: colors.cyan.primary,
    fontSize: 11,
    letterSpacing: 1.4,
  },
  litText: { color: colors.gold.bright },
  name: {
    ...typography.uiMedium,
    color: colors.text.primary,
    fontSize: 11,
  },
  cost: {
    ...typography.ui,
    color: colors.text.tertiary,
    fontSize: 10,
  },
});

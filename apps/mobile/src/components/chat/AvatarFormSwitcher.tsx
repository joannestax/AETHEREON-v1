import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import { AVATAR_FORM_LABELS, type AvatarForm } from '../../types/chat';

type Props = {
  value: AvatarForm;
  onChange: (form: AvatarForm) => void;
};

const FORMS: AvatarForm[] = ['sphere', 'titan', 'realm_guide'];

export function AvatarFormSwitcher({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {FORMS.map((form) => {
        const active = form === value;
        return (
          <Pressable
            key={form}
            onPress={() => onChange(form)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>
              {AVATAR_FORM_LABELS[form].toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  chipActive: {
    borderColor: colors.gold.muted,
    backgroundColor: colors.gold.ghost,
  },
  text: {
    ...typography.uiMedium,
    color: colors.text.tertiary,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  textActive: {
    color: colors.gold.bright,
  },
});

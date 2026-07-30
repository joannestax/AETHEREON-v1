import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CosmicBackground } from '../components/ui/CosmicBackground';
import type { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing, typography } from '../theme/tokens';

type Props = {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: (nav: NativeStackNavigationProp<RootStackParamList>) => void;
};

export function PlaceholderScreen({ title, subtitle, actionLabel, onAction }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <CosmicBackground>
      <View style={styles.center}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
        <Text style={styles.sub}>{subtitle}</Text>
        {actionLabel && onAction ? (
          <Pressable style={styles.btn} onPress={() => onAction(navigation)}>
            <Text style={styles.btnText}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    ...typography.brand,
    color: colors.gold.primary,
    fontSize: 22,
    letterSpacing: 3,
  },
  sub: {
    ...typography.ui,
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
  },
  btn: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold.muted,
    backgroundColor: colors.gold.ghost,
  },
  btnText: {
    ...typography.uiBold,
    color: colors.gold.bright,
    fontSize: 10,
    letterSpacing: 1.4,
  },
});

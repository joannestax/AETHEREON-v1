import React from 'react';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { colors, typography } from '../../theme/tokens';

type Props = { children: React.ReactNode };

/**
 * On wide web viewports, frame the app like a phone so the Finance God UI
 * matches the mobile mockups. Native / narrow web = full bleed.
 */
export function WebPhoneShell({ children }: Props) {
  const { width } = useWindowDimensions();
  const useShell = Platform.OS === 'web' && width >= 520;

  if (!useShell) {
    return <View style={styles.fill}>{children}</View>;
  }

  return (
    <View style={styles.stage}>
      <Text style={styles.banner}>AETHERON · PROJECT GENESIS · WEB PREVIEW</Text>
      <View style={styles.phone}>
        <View style={styles.notch} />
        <View style={styles.screen}>{children}</View>
      </View>
      <Text style={styles.hint}>Open on mobile or shrink the window for full-bleed.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  stage: {
    flex: 1,
    backgroundColor: '#02030A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 14,
  },
  banner: {
    ...typography.uiBold,
    color: colors.gold.primary,
    fontSize: 11,
    letterSpacing: 2.4,
  },
  phone: {
    width: 390,
    height: 780,
    maxHeight: '92%',
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(212,175,55,0.45)',
    backgroundColor: colors.space.void,
    overflow: 'hidden',
  },
  notch: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -48,
    width: 96,
    height: 22,
    borderRadius: 12,
    backgroundColor: '#000',
    zIndex: 10,
  },
  screen: {
    flex: 1,
  },
  hint: {
    ...typography.ui,
    color: colors.text.tertiary,
    fontSize: 12,
  },
});

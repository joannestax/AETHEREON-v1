import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';
import type { ShipZone } from '../../types/bearfall';
import { ZONE_LABELS } from '../../data/bearfallQuest';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import { NATIVE_DRIVER } from '../../utils/animation';

const ZONE_POS: Record<ShipZone, { x: number; y: number }> = {
  cockpit: { x: 50, y: 18 },
  left_wing: { x: 18, y: 42 },
  right_wing: { x: 82, y: 42 },
  engine: { x: 50, y: 72 },
  cargo_vault: { x: 50, y: 48 },
};

type Props = {
  activeZone: ShipZone | null;
  revealed: boolean;
  shaking?: boolean;
};

export function ShipRadar({ activeZone, revealed, shaking }: Props) {
  const pulse = useRef(new Animated.Value(0.4)).current;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: NATIVE_DRIVER }),
        Animated.timing(pulse, { toValue: 0.35, duration: 700, useNativeDriver: NATIVE_DRIVER }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  useEffect(() => {
    if (!shaking) return;
    const anim = Animated.sequence([
      Animated.timing(shake, { toValue: 6, duration: 40, useNativeDriver: NATIVE_DRIVER }),
      Animated.timing(shake, { toValue: -6, duration: 40, useNativeDriver: NATIVE_DRIVER }),
      Animated.timing(shake, { toValue: 4, duration: 40, useNativeDriver: NATIVE_DRIVER }),
      Animated.timing(shake, { toValue: 0, duration: 40, useNativeDriver: NATIVE_DRIVER }),
    ]);
    anim.start();
  }, [shaking, shake]);

  const blip = activeZone ? ZONE_POS[activeZone] : null;

  return (
    <Animated.View style={[styles.wrap, { transform: [{ translateX: shake }] }]}>
      <Text style={styles.label}>MARKET RADAR</Text>
      <View style={styles.radar}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100">
          <Circle cx="50" cy="50" r="46" stroke={colors.cyan.border} strokeWidth="0.6" fill="rgba(0,210,255,0.04)" />
          <Circle cx="50" cy="50" r="30" stroke="rgba(0,210,255,0.18)" strokeWidth="0.4" fill="none" />
          <Circle cx="50" cy="50" r="14" stroke="rgba(197,160,89,0.25)" strokeWidth="0.4" fill="none" />
          <Line x1="50" y1="4" x2="50" y2="96" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
          <Line x1="4" y1="50" x2="96" y2="50" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
          {/* Ship silhouette */}
          <Polygon
            points="50,22 62,48 58,78 42,78 38,48"
            fill="rgba(197,160,89,0.18)"
            stroke={colors.gold.muted}
            strokeWidth="0.8"
          />
          <Polygon
            points="38,48 18,52 38,58"
            fill="rgba(0,210,255,0.12)"
            stroke={colors.cyan.border}
            strokeWidth="0.5"
          />
          <Polygon
            points="62,48 82,52 62,58"
            fill="rgba(0,210,255,0.12)"
            stroke={colors.cyan.border}
            strokeWidth="0.5"
          />
          {blip ? (
            <>
              <Circle
                cx={blip.x}
                cy={blip.y}
                r="7"
                fill={revealed ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.12)'}
                stroke={colors.signal.bearish}
                strokeWidth="0.8"
              />
              <Circle cx={blip.x} cy={blip.y} r="2.2" fill={colors.signal.bearish} />
            </>
          ) : null}
        </Svg>
        {blip ? (
          <Animated.View
            style={[
              styles.blipLabel,
              {
                left: `${blip.x}%`,
                top: `${Math.max(4, blip.y - 14)}%`,
                opacity: pulse,
              },
            ]}
          >
            <Text style={styles.blipText}>
              {revealed ? 'CONFIRMED' : 'SIGNAL'} · {ZONE_LABELS[activeZone!]}
            </Text>
          </Animated.View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  label: {
    ...typography.uiBold,
    color: colors.cyan.primary,
    fontSize: 10,
    letterSpacing: 1.8,
    textAlign: 'center',
  },
  radar: {
    height: 220,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cyan.border,
    backgroundColor: 'rgba(2,6,23,0.65)',
    overflow: 'hidden',
  },
  blipLabel: {
    position: 'absolute',
    transform: [{ translateX: -54 }],
    minWidth: 108,
    alignItems: 'center',
  },
  blipText: {
    ...typography.uiBold,
    color: colors.signal.bearish,
    fontSize: 9,
    letterSpacing: 0.8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
    borderRadius: radii.sm,
  },
});

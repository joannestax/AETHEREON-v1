import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient as SvgGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { colors } from '../../theme/tokens';

type Props = {
  size?: number;
  /** sphere | titan — titan is primary high-authority form silhouette */
  form?: 'sphere' | 'titan';
};

export function AetheronOrb({ size = 140, form = 'titan' }: Props) {
  const spin = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const rotate = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 14000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.45, duration: 2200, useNativeDriver: true }),
      ]),
    );
    rotate.start();
    pulse.start();
    return () => {
      rotate.stop();
      pulse.stop();
    };
  }, [spin, glow]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View style={[styles.glow, { opacity: glow, width: size * 1.15, height: size * 1.15 }]} />
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            <RadialGradient id="core" cx="50%" cy="45%" r="50%">
              <Stop offset="0%" stopColor="#E8FFFF" stopOpacity={0.95} />
              <Stop offset="35%" stopColor={colors.cyan.primary} stopOpacity={0.75} />
              <Stop offset="70%" stopColor="#0A3A55" stopOpacity={0.55} />
              <Stop offset="100%" stopColor="#02040A" stopOpacity={0.9} />
            </RadialGradient>
            <SvgGradient id="goldRing" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={colors.gold.bright} />
              <Stop offset="50%" stopColor={colors.gold.primary} />
              <Stop offset="100%" stopColor="#8A6A12" />
            </SvgGradient>
          </Defs>

          <Ellipse cx="100" cy="100" rx="78" ry="78" fill="url(#core)" opacity={0.95} />
          <Circle cx="100" cy="100" r="82" stroke="url(#goldRing)" strokeWidth={1.5} fill="none" opacity={0.85} />
          <Ellipse cx="100" cy="100" rx="92" ry="58" stroke="url(#goldRing)" strokeWidth={1.2} fill="none" opacity={0.7} />
          <Ellipse cx="100" cy="100" rx="58" ry="92" stroke={colors.cyan.muted} strokeWidth={1} fill="none" opacity={0.55} />

          {/* Orbital nodes */}
          <Circle cx="100" cy="18" r="3.5" fill={colors.gold.bright} />
          <Circle cx="182" cy="100" r="3" fill={colors.cyan.primary} />
          <Circle cx="100" cy="182" r="3" fill={colors.gold.primary} />
          <Circle cx="18" cy="100" r="3" fill={colors.cyan.soft} />

          {form === 'titan' && (
            <G opacity={0.92}>
              {/* Silhouette head + beard suggestion inside sphere */}
              <Ellipse cx="100" cy="78" rx="22" ry="26" fill="#1A1F2A" />
              <Ellipse cx="100" cy="72" rx="18" ry="16" fill="#2A303C" />
              {/* Eyes */}
              <Circle cx="92" cy="74" r="3.2" fill={colors.cyan.electric} />
              <Circle cx="108" cy="74" r="3.2" fill={colors.cyan.electric} />
              {/* Beard */}
              <Path
                d="M78 88 Q100 130 122 88 Q112 118 100 128 Q88 118 78 88 Z"
                fill="#E8ECF0"
                opacity={0.9}
              />
              {/* Hair */}
              <Path
                d="M78 68 Q80 48 100 46 Q120 48 122 68 Q118 56 100 54 Q82 56 78 68 Z"
                fill="#F2F4F7"
                opacity={0.85}
              />
              {/* Chest gem */}
              <Path d="M100 128 L108 138 L100 148 L92 138 Z" fill={colors.cyan.primary} opacity={0.95} />
              {/* Shoulders / armor hint */}
              <Path
                d="M70 118 Q100 132 130 118 L138 148 Q100 158 62 148 Z"
                fill="#141820"
                stroke={colors.gold.muted}
                strokeWidth={1}
              />
            </G>
          )}
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(0,229,255,0.12)',
  },
});

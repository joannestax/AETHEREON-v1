import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line } from 'react-native-svg';
import { colors } from '../../theme/tokens';
import { NATIVE_DRIVER } from '../../utils/animation';

const STARS = [
  [12, 8], [28, 22], [45, 12], [62, 30], [78, 8], [88, 40],
  [18, 48], [35, 62], [55, 55], [72, 70], [90, 58], [8, 75],
  [42, 85], [65, 90], [82, 78], [22, 35], [50, 40], [95, 20],
];

const CONSTELLATIONS: [number, number, number, number][] = [
  [12, 8, 28, 22],
  [28, 22, 45, 12],
  [45, 12, 62, 30],
  [18, 48, 35, 62],
  [35, 62, 55, 55],
  [72, 70, 90, 58],
  [50, 40, 65, 90],
];

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function CosmicBackground({ children, style }: Props) {
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.7, duration: 3200, useNativeDriver: NATIVE_DRIVER }),
        Animated.timing(pulse, { toValue: 0.35, duration: 3200, useNativeDriver: NATIVE_DRIVER }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={[styles.root, style]}>
      <LinearGradient
        colors={[colors.space.void, colors.space.navy, colors.space.deep]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.nebula, { opacity: pulse }]}>
        <LinearGradient
          colors={['transparent', 'rgba(0,229,255,0.08)', 'rgba(212,175,55,0.06)', 'transparent']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {CONSTELLATIONS.map(([x1, y1, x2, y2], i) => (
          <Line
            key={`c-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(212,175,55,0.18)"
            strokeWidth={0.15}
          />
        ))}
        {STARS.map(([cx, cy], i) => (
          <Circle
            key={`s-${i}`}
            cx={cx}
            cy={cy}
            r={i % 4 === 0 ? 0.45 : 0.28}
            fill={i % 3 === 0 ? colors.gold.soft : colors.cyan.soft}
            opacity={i % 2 === 0 ? 0.9 : 0.55}
          />
        ))}
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.space.void,
  },
  nebula: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});

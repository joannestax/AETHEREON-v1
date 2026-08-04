import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';

type Props = {
  shields: number;
  maxShields: number;
  energy: number;
  maxEnergy: number;
  gems: number;
  bears: number;
  bearsGoal: number;
  streak: number;
  rockets: number;
  timerMs: number;
  timeLimitMs: number;
};

function Meter({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <View style={styles.meterBlock}>
      <View style={styles.meterTop}>
        <Text style={styles.meterLabel}>{label}</Text>
        <Text style={[styles.meterValue, { color }]}>
          {Math.round(value)}/{max}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export function CombatHud({
  shields,
  maxShields,
  energy,
  maxEnergy,
  gems,
  bears,
  bearsGoal,
  streak,
  rockets,
  timerMs,
  timeLimitMs,
}: Props) {
  const urgent = timerMs < 2500;
  return (
    <View style={styles.root}>
      <View style={styles.stats}>
        <Text style={styles.stat}>
          BEARS <Text style={styles.statNum}>{bears}/{bearsGoal}</Text>
        </Text>
        <Text style={styles.stat}>
          GEMS <Text style={[styles.statNum, { color: colors.gold.bright }]}>{gems}</Text>
        </Text>
        <Text style={styles.stat}>
          STREAK <Text style={[styles.statNum, { color: colors.cyan.soft }]}>{streak}</Text>
        </Text>
        <Text style={styles.stat}>
          RKT <Text style={styles.statNum}>{rockets}</Text>
        </Text>
      </View>
      <Meter label="SHIELDS" value={shields} max={maxShields} color={colors.cyan.primary} />
      <Meter label="ENERGY" value={energy} max={maxEnergy} color={colors.gold.bright} />
      <View style={styles.timerRow}>
        <Text style={[styles.timerLabel, urgent && styles.urgent]}>VECTOR WINDOW</Text>
        <View style={styles.timerTrack}>
          <View
            style={[
              styles.timerFill,
              {
                width: `${Math.max(0, (timerMs / Math.max(1, timeLimitMs)) * 100)}%`,
                backgroundColor: urgent ? colors.signal.bearish : colors.gold.primary,
              },
            ]}
          />
        </View>
        <Text style={[styles.timerValue, urgent && styles.urgent]}>
          {(timerMs / 1000).toFixed(1)}s
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.sm },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  stat: {
    ...typography.uiMedium,
    color: colors.text.tertiary,
    fontSize: 10,
    letterSpacing: 1,
  },
  statNum: {
    ...typography.uiBold,
    color: colors.text.primary,
    fontSize: 12,
  },
  meterBlock: { gap: 4 },
  meterTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meterLabel: {
    ...typography.uiBold,
    color: colors.text.secondary,
    fontSize: 9,
    letterSpacing: 1.4,
  },
  meterValue: {
    ...typography.uiBold,
    fontSize: 10,
  },
  track: {
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timerLabel: {
    ...typography.uiBold,
    color: colors.text.tertiary,
    fontSize: 8,
    letterSpacing: 1,
    width: 72,
  },
  timerTrack: {
    flex: 1,
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  timerFill: { height: '100%' },
  timerValue: {
    ...typography.uiBold,
    color: colors.gold.soft,
    fontSize: 11,
    width: 36,
    textAlign: 'right',
  },
  urgent: { color: colors.signal.bearish },
});

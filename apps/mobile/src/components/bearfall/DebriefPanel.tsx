import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BEARFALL_META, TREASURE_REWARDS } from '../../data/bearfallQuest';
import type { BattleReport } from '../../types/bearfall';
import { GlassCard } from '../ui/GlassCard';
import { CosmicButton } from '../ui/CosmicButton';
import { colors, spacing, typography } from '../../theme/tokens';

type Props = {
  report: BattleReport;
  gems: number;
  onReplay: () => void;
  onExit: () => void;
};

const ROWS: Array<{ key: keyof BattleReport; label: string }> = [
  { key: 'bearsDefeated', label: 'Bears Defeated' },
  { key: 'auraGemsCollected', label: 'Aura Gems Collected' },
  { key: 'shieldDamageTaken', label: 'Shield Damage Taken' },
  { key: 'missedAttacks', label: 'Missed Attacks' },
  { key: 'energyWasted', label: 'Energy Wasted' },
  { key: 'successfulRetreats', label: 'Successful Retreats' },
  { key: 'longestAuraStreak', label: 'Longest Aura Streak' },
  { key: 'disciplineScore', label: 'Discipline Score' },
];

export function DebriefPanel({ report, gems, onReplay, onExit }: Props) {
  return (
    <View style={styles.root}>
      <Text style={styles.kicker}>AETHERON DEBRIEF</Text>
      <Text style={styles.quote}>“{BEARFALL_META.aethereonClose}”</Text>

      <GlassCard accent="gold" glow="gold">
        <Text style={styles.cardTitle}>BATTLE REPORT</Text>
        {ROWS.map((row) => (
          <View key={row.key} style={styles.row}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text
              style={[
                styles.rowValue,
                row.key === 'disciplineScore' && styles.score,
              ]}
            >
              {report[row.key]}
              {row.key === 'disciplineScore' ? '/100' : ''}
            </Text>
          </View>
        ))}
        <Text style={styles.gemNote}>Vault haul recorded · {gems} total Aura Gems</Text>
      </GlassCard>

      <GlassCard accent="cyan">
        <Text style={styles.cardTitle}>TREASURE CLAIMED</Text>
        {TREASURE_REWARDS.map((reward) => (
          <View key={reward.id} style={styles.reward}>
            <Text style={styles.rewardLabel}>{reward.label}</Text>
            <Text style={styles.rewardDetail}>{reward.detail}</Text>
          </View>
        ))}
      </GlassCard>

      <GlassCard>
        <Text style={styles.cardTitle}>LESSONS LIVED</Text>
        {BEARFALL_META.lessons.map((lesson) => (
          <Text key={lesson} style={styles.lesson}>
            · {lesson}
          </Text>
        ))}
      </GlassCard>

      <View style={styles.actions}>
        <CosmicButton label="RUN AGAIN" variant="gold" onPress={onReplay} />
        <CosmicButton label="RETURN TO ORIGO" variant="ghost" onPress={onExit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  kicker: {
    ...typography.uiBold,
    color: colors.cyan.primary,
    fontSize: 11,
    letterSpacing: 2,
    textAlign: 'center',
  },
  quote: {
    ...typography.display,
    color: colors.text.primary,
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
  cardTitle: {
    ...typography.uiBold,
    color: colors.gold.primary,
    fontSize: 11,
    letterSpacing: 1.8,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  rowLabel: {
    ...typography.ui,
    color: colors.text.secondary,
    fontSize: 13,
  },
  rowValue: {
    ...typography.uiBold,
    color: colors.text.primary,
    fontSize: 13,
  },
  score: { color: colors.gold.bright },
  gemNote: {
    ...typography.ui,
    color: colors.text.tertiary,
    fontSize: 11,
    marginTop: spacing.md,
  },
  reward: { marginBottom: spacing.sm },
  rewardLabel: {
    ...typography.uiBold,
    color: colors.cyan.soft,
    fontSize: 13,
  },
  rewardDetail: {
    ...typography.ui,
    color: colors.text.tertiary,
    fontSize: 12,
  },
  lesson: {
    ...typography.ui,
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 20,
  },
  actions: { gap: spacing.sm },
});

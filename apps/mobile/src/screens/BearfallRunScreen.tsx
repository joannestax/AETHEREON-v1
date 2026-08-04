import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AbilityBar } from '../components/bearfall/AbilityBar';
import { CombatHud } from '../components/bearfall/CombatHud';
import { DebriefPanel } from '../components/bearfall/DebriefPanel';
import { ShipRadar } from '../components/bearfall/ShipRadar';
import { CosmicBackground } from '../components/ui/CosmicBackground';
import { CosmicButton } from '../components/ui/CosmicButton';
import { GlassCard } from '../components/ui/GlassCard';
import {
  BEARFALL_META,
  VICTORY_THRESHOLDS,
  ZONE_LABELS,
} from '../data/bearfallQuest';
import type { RootStackParamList } from '../navigation/types';
import { useBearfallGame } from '../quest/bearfall/useBearfallGame';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { NATIVE_DRIVER } from '../utils/animation';
import type { AbilityId } from '../types/bearfall';

function suggestedAbilities(
  bearType: string | undefined,
  bossPhase: number | undefined,
  patienceActive: boolean,
  shieldActive: boolean,
  bossCombo: AbilityId[],
): AbilityId[] {
  if (bossPhase === 3) {
    if (bossCombo.length === 0) return ['patience_pulse'];
    if (bossCombo.length === 1) return ['conviction_shield'];
    if (bossCombo.length === 2) return ['aura_cannon'];
    return ['patience_pulse'];
  }
  if (bossPhase === 1 && !patienceActive) return ['patience_pulse'];
  if (bossPhase === 2 && !shieldActive) return ['conviction_shield', 'patience_pulse'];
  if (bearType === 'fakeout' && !patienceActive) return ['patience_pulse'];
  if (bearType === 'leverage_grizzly') return ['position_rockets'];
  if (bearType === 'elite') return ['aura_cannon', 'conviction_shield'];
  if (bearType === 'panic_cub') return ['aura_cannon'];
  return ['aura_cannon'];
}

export function BearfallRunScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const game = useBearfallGame();
  const {
    state,
    currentEncounter,
    displayedZone,
    beginRun,
    resetRun,
    castAbility,
    openChest,
  } = game;

  const flash = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!state.feedback) return;
    flash.setValue(0.55);
    Animated.timing(flash, {
      toValue: 0,
      duration: 650,
      useNativeDriver: NATIVE_DRIVER,
    }).start();
  }, [state.feedback, flash]);

  const highlights = useMemo(
    () =>
      suggestedAbilities(
        currentEncounter?.bearType,
        currentEncounter?.bossPhase,
        state.patienceActive,
        state.shieldActive,
        state.bossCombo,
      ),
    [
      currentEncounter?.bearType,
      currentEncounter?.bossPhase,
      state.patienceActive,
      state.shieldActive,
      state.bossCombo,
    ],
  );

  return (
    <CosmicBackground>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <Text style={styles.back}>← EXIT</Text>
          </Pressable>
          <Text style={styles.missionTag}>CHAMPION ASSIST</Text>
          <Text style={styles.backSpacer} />
        </View>

        {state.phase === 'intro' ? (
          <IntroPanel onLaunch={beginRun} />
        ) : null}

        {state.phase === 'combat' || state.phase === 'boss' ? (
          <View style={styles.combat}>
            <Text style={styles.brand}>BEARFALL RUN</Text>
            <Text style={styles.subBrand}>
              {state.phase === 'boss'
                ? 'TITAN BEAR PROTOCOL'
                : 'OBSIDIAN MARKET BELT'}
            </Text>

            <CombatHud
              shields={state.shields}
              maxShields={game.maxShields}
              energy={state.energy}
              maxEnergy={game.maxEnergy}
              gems={state.gems}
              bears={state.bearsDefeated}
              bearsGoal={VICTORY_THRESHOLDS.bears}
              streak={state.streak}
              rockets={state.rockets}
              timerMs={state.timerMs}
              timeLimitMs={currentEncounter?.timeLimitMs ?? 1}
            />

            <ShipRadar
              activeZone={displayedZone}
              revealed={
                state.patienceActive ||
                currentEncounter?.bearType !== 'fakeout' ||
                !currentEncounter?.decoyZone
              }
              shaking={state.shaking}
            />

            {currentEncounter ? (
              <GlassCard
                accent={state.phase === 'boss' ? 'gold' : 'cyan'}
                glow={state.phase === 'boss' ? 'gold' : 'none'}
              >
                <Text style={styles.encounterLabel}>{currentEncounter.label}</Text>
                <Text style={styles.encounterZone}>
                  Vector · {ZONE_LABELS[displayedZone ?? currentEncounter.zone]}
                  {state.patienceActive ? ' · CONFIRMED' : ''}
                </Text>
                <Text style={styles.encounterThreat}>{currentEncounter.threat}</Text>
                {state.phase === 'boss' && currentEncounter.bossPhase === 3 ? (
                  <Text style={styles.comboHint}>
                    Combo {state.bossCombo.length}/3 · Pulse → Shield → Cannon
                  </Text>
                ) : null}
              </GlassCard>
            ) : null}

            {state.feedback ? (
              <View
                style={[
                  styles.feedback,
                  state.feedback.tone === 'success' && styles.fbSuccess,
                  state.feedback.tone === 'danger' && styles.fbDanger,
                  state.feedback.tone === 'warn' && styles.fbWarn,
                ]}
              >
                <Animated.View
                  pointerEvents="none"
                  style={[
                    StyleSheet.absoluteFill,
                    styles.feedbackFlash,
                    {
                      opacity: flash,
                      backgroundColor:
                        state.feedback.tone === 'danger'
                          ? 'rgba(239,68,68,0.18)'
                          : state.feedback.tone === 'success'
                            ? 'rgba(34,197,94,0.14)'
                            : 'rgba(197,160,89,0.14)',
                    },
                  ]}
                />
                <Text style={styles.feedbackTitle}>{state.feedback.title}</Text>
                <Text style={styles.feedbackDetail}>{state.feedback.detail}</Text>
              </View>
            ) : null}

            {state.celestial && state.phase === 'boss' ? (
              <Text style={styles.bullstrike}>CELESTIAL BULLSTRIKE</Text>
            ) : null}

            <AbilityBar
              energy={state.energy}
              rockets={state.rockets}
              highlight={highlights}
              onCast={castAbility}
            />

            <Text style={styles.auraLine}>
              Aura stands ready — you manage targeting, shields, and energy.
            </Text>
          </View>
        ) : null}

        {state.phase === 'treasure' ? (
          <View style={styles.treasure}>
            <Text style={styles.brand}>ULTIMATE AURA VAULT</Text>
            <Text style={styles.auraQuote}>“{BEARFALL_META.auraVictory}”</Text>
            <GlassCard accent="gold" glow="gold" style={styles.chest}>
              <Text style={styles.chestGlyph}>◆</Text>
              <Text style={styles.chestTitle}>Ultimate Aura Gem Treasure Chest</Text>
              <Text style={styles.chestBody}>
                Collected gems form a glowing celestial key. Space Princess Aura
                inserts the key into the floating vault.
              </Text>
              <Text style={styles.chestStats}>
                {state.bearsDefeated} bears · {state.gems} gems · shields{' '}
                {Math.round(state.shields)}%
              </Text>
              <CosmicButton
                label="OPEN THE CHEST"
                variant="gold"
                onPress={openChest}
              />
            </GlassCard>
          </View>
        ) : null}

        {state.phase === 'debrief' ? (
          <DebriefPanel
            report={state.report}
            gems={state.gems}
            onReplay={resetRun}
            onExit={() => navigation.goBack()}
          />
        ) : null}

        {state.phase === 'defeat' ? (
          <View style={styles.treasure}>
            <Text style={styles.brand}>SHIELDS COLLAPSED</Text>
            <Text style={styles.auraQuote}>
              “{state.feedback?.detail ?? 'Fear boarded the ship.'}”
            </Text>
            <GlassCard accent="cyan">
              <Text style={styles.encounterThreat}>
                Discipline Score preview:{' '}
                {state.report.disciplineScore || '—'} · Damage taken{' '}
                {state.report.shieldDamageTaken}
              </Text>
              <View style={styles.defeatActions}>
                <CosmicButton label="RETRY RUN" variant="gold" onPress={beginRun} />
                <CosmicButton
                  label="RETURN"
                  variant="ghost"
                  onPress={() => navigation.goBack()}
                />
              </View>
            </GlassCard>
          </View>
        ) : null}
      </ScrollView>
    </CosmicBackground>
  );
}

function IntroPanel({ onLaunch }: { onLaunch: () => void }) {
  return (
    <View style={styles.intro}>
      <Text style={styles.heroTitle}>{BEARFALL_META.title}</Text>
      <Text style={styles.heroSub}>{BEARFALL_META.subtitle}</Text>
      <Text style={styles.metaLine}>
        {BEARFALL_META.location} · {BEARFALL_META.length}
      </Text>

      <GlassCard accent="gold" glow="gold">
        <Text style={styles.cardEyebrow}>AETHERON</Text>
        <Text style={styles.quote}>“{BEARFALL_META.aethereonOpen}”</Text>
      </GlassCard>

      <GlassCard accent="cyan">
        <Text style={styles.cardEyebrow}>MISSION OBJECTIVE</Text>
        <Text style={styles.body}>{BEARFALL_META.objective}</Text>
        <View style={styles.needs}>
          {BEARFALL_META.victoryNeeds.map((need) => (
            <Text key={need} style={styles.need}>
              ▸ {need}
            </Text>
          ))}
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={styles.cardEyebrow}>CHAMPION</Text>
        <Text style={styles.champ}>{BEARFALL_META.champion}</Text>
        <Text style={styles.body}>
          Player role: {BEARFALL_META.playerRole}. Detect bear vectors on radar,
          choose the right defense, and collect Aura Gems before shields fail.
        </Text>
      </GlassCard>

      <CosmicButton label="LAUNCH BEARFALL RUN" variant="gold" onPress={onLaunch} />
      <Text style={styles.flavor}>
        Temple Run energy · Star Fox vectors · bear-market fever dream
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 48,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    ...typography.uiBold,
    color: colors.gold.primary,
    fontSize: 11,
    letterSpacing: 1.2,
    width: 64,
  },
  backSpacer: { width: 64 },
  missionTag: {
    ...typography.uiMedium,
    color: colors.cyan.soft,
    fontSize: 10,
    letterSpacing: 1.6,
  },
  intro: { gap: spacing.lg },
  kicker: {
    ...typography.uiBold,
    color: colors.cyan.primary,
    fontSize: 11,
    letterSpacing: 2,
    textAlign: 'center',
  },
  heroTitle: {
    ...typography.brand,
    color: colors.gold.bright,
    fontSize: 30,
    textAlign: 'center',
    letterSpacing: 3,
  },
  heroSub: {
    ...typography.display,
    color: colors.text.primary,
    fontSize: 24,
    textAlign: 'center',
    marginTop: -8,
  },
  metaLine: {
    ...typography.ui,
    color: colors.text.tertiary,
    fontSize: 12,
    textAlign: 'center',
  },
  cardEyebrow: {
    ...typography.uiBold,
    color: colors.gold.primary,
    fontSize: 10,
    letterSpacing: 1.8,
    marginBottom: spacing.sm,
  },
  quote: {
    ...typography.display,
    color: colors.text.primary,
    fontSize: 22,
    lineHeight: 28,
  },
  body: {
    ...typography.ui,
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 21,
  },
  needs: { marginTop: spacing.md, gap: 6 },
  need: {
    ...typography.uiMedium,
    color: colors.cyan.soft,
    fontSize: 13,
  },
  champ: {
    ...typography.uiBold,
    color: colors.gold.soft,
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  flavor: {
    ...typography.ui,
    color: colors.text.tertiary,
    fontSize: 11,
    textAlign: 'center',
  },
  combat: { gap: spacing.md },
  brand: {
    ...typography.brand,
    color: colors.gold.bright,
    fontSize: 22,
    textAlign: 'center',
    letterSpacing: 2,
  },
  subBrand: {
    ...typography.uiMedium,
    color: colors.cyan.primary,
    fontSize: 10,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: -8,
  },
  encounterLabel: {
    ...typography.uiBold,
    color: colors.text.primary,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  encounterZone: {
    ...typography.uiMedium,
    color: colors.signal.bearish,
    fontSize: 12,
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  encounterThreat: {
    ...typography.ui,
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 19,
  },
  comboHint: {
    ...typography.uiBold,
    color: colors.gold.soft,
    fontSize: 11,
    marginTop: spacing.sm,
    letterSpacing: 0.8,
  },
  feedback: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cyan.border,
    backgroundColor: 'rgba(8,14,28,0.8)',
    padding: spacing.md,
    gap: 4,
    overflow: 'hidden',
  },
  feedbackFlash: {
    borderRadius: radii.md,
  },
  fbSuccess: { borderColor: 'rgba(34,197,94,0.45)' },
  fbDanger: { borderColor: 'rgba(239,68,68,0.5)' },
  fbWarn: { borderColor: 'rgba(197,160,89,0.5)' },
  feedbackTitle: {
    ...typography.uiBold,
    color: colors.text.primary,
    fontSize: 13,
  },
  feedbackDetail: {
    ...typography.ui,
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 18,
  },
  bullstrike: {
    ...typography.brand,
    color: colors.gold.bright,
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 2,
  },
  auraLine: {
    ...typography.ui,
    color: colors.text.tertiary,
    fontSize: 11,
    textAlign: 'center',
  },
  treasure: { gap: spacing.lg },
  auraQuote: {
    ...typography.display,
    color: colors.text.primary,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
  },
  chest: { alignItems: 'center', gap: spacing.md },
  chestGlyph: {
    ...typography.brand,
    color: colors.gold.bright,
    fontSize: 42,
  },
  chestTitle: {
    ...typography.uiBold,
    color: colors.gold.bright,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  chestBody: {
    ...typography.ui,
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  chestStats: {
    ...typography.uiMedium,
    color: colors.cyan.soft,
    fontSize: 12,
  },
  defeatActions: { marginTop: spacing.lg, gap: spacing.sm },
});

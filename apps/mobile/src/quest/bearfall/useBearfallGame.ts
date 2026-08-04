import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  buildBossEncounters,
  buildRaiderEncounters,
  VICTORY_THRESHOLDS,
} from '../../data/bearfallQuest';
import type {
  AbilityId,
  BattleReport,
  CombatFeedback,
  Encounter,
  QuestPhase,
} from '../../types/bearfall';
import {
  computeDisciplineScore,
  resolveAction,
  timeoutPenalty,
} from './resolveAction';

const MAX_SHIELDS = 100;
const MAX_ENERGY = 100;
const START_ROCKETS = 3;

type GameState = {
  phase: QuestPhase;
  shields: number;
  energy: number;
  rockets: number;
  gems: number;
  bearsDefeated: number;
  streak: number;
  longestStreak: number;
  patienceActive: boolean;
  shieldActive: boolean;
  raidIndex: number;
  bossIndex: number;
  bossCombo: AbilityId[];
  feedback: CombatFeedback | null;
  timerMs: number;
  shaking: boolean;
  celestial: boolean;
  report: BattleReport;
};

function emptyReport(): BattleReport {
  return {
    bearsDefeated: 0,
    auraGemsCollected: 0,
    shieldDamageTaken: 0,
    missedAttacks: 0,
    energyWasted: 0,
    successfulRetreats: 0,
    longestAuraStreak: 0,
    disciplineScore: 0,
  };
}

function initialState(): GameState {
  return {
    phase: 'intro',
    shields: MAX_SHIELDS,
    energy: MAX_ENERGY,
    rockets: START_ROCKETS,
    gems: 0,
    bearsDefeated: 0,
    streak: 0,
    longestStreak: 0,
    patienceActive: false,
    shieldActive: false,
    raidIndex: 0,
    bossIndex: 0,
    bossCombo: [],
    feedback: null,
    timerMs: 0,
    shaking: false,
    celestial: false,
    report: emptyReport(),
  };
}

export function useBearfallGame() {
  const raids = useMemo(() => buildRaiderEncounters(), []);
  const bosses = useMemo(() => buildBossEncounters(), []);
  const [state, setState] = useState<GameState>(initialState);

  const currentEncounter: Encounter | null = useMemo(() => {
    if (state.phase === 'combat') return raids[state.raidIndex] ?? null;
    if (state.phase === 'boss') return bosses[state.bossIndex] ?? null;
    return null;
  }, [state.phase, state.raidIndex, state.bossIndex, raids, bosses]);

  const displayedZone = useMemo(() => {
    if (!currentEncounter) return null;
    if (
      (currentEncounter.bearType === 'fakeout' || currentEncounter.bossPhase === 1) &&
      !state.patienceActive &&
      currentEncounter.decoyZone
    ) {
      return currentEncounter.decoyZone;
    }
    if (
      currentEncounter.bossPhase === 2 &&
      !state.patienceActive &&
      !state.shieldActive &&
      currentEncounter.decoyZone
    ) {
      return currentEncounter.decoyZone;
    }
    return currentEncounter.zone;
  }, [currentEncounter, state.patienceActive, state.shieldActive]);

  const beginRun = useCallback(() => {
    const first = raids[0];
    setState({
      ...initialState(),
      phase: 'combat',
      timerMs: first.timeLimitMs,
      feedback: {
        tone: 'info',
        title: 'Corridor Hot',
        detail: 'Bear signals on market radar. Identify the vector — then respond.',
      },
    });
  }, [raids]);

  const resetRun = useCallback(() => setState(initialState()), []);

  const finalizeReport = useCallback((partial: BattleReport): BattleReport => {
    return {
      ...partial,
      disciplineScore: computeDisciplineScore(partial),
    };
  }, []);

  const goDefeat = useCallback(
    (prev: GameState, report: BattleReport): GameState => {
      const finalReport = finalizeReport({
        ...report,
        bearsDefeated: prev.bearsDefeated,
        auraGemsCollected: prev.gems,
        longestAuraStreak: Math.max(prev.longestStreak, report.longestAuraStreak),
      });
      return {
        ...prev,
        phase: 'defeat',
        shields: 0,
        feedback: {
          tone: 'danger',
          title: 'Shields Collapsed',
          detail: 'The bears threw Aura into the void. Discipline is the real armor.',
        },
        report: finalReport,
        shaking: true,
      };
    },
    [finalizeReport],
  );

  const advanceAfterClear = useCallback(
    (prev: GameState, defeated: boolean, gemsGained: number): GameState => {
      const bearsDefeated = prev.bearsDefeated + (defeated ? 1 : 0);
      const gems = prev.gems + gemsGained;

      if (prev.phase === 'combat') {
        const nextIndex = prev.raidIndex + 1;
        if (nextIndex >= raids.length) {
          const boss = bosses[0];
          return {
            ...prev,
            phase: 'boss',
            raidIndex: nextIndex,
            bossIndex: 0,
            bearsDefeated,
            gems,
            patienceActive: false,
            shieldActive: false,
            bossCombo: [],
            timerMs: boss.timeLimitMs,
            shaking: true,
            energy: Math.min(MAX_ENERGY, prev.energy + 8),
            feedback: {
              tone: 'warn',
              title: 'Titan Bear Detected',
              detail: 'Fear Roar incoming. Pulse the false warnings.',
            },
          };
        }
        const next = raids[nextIndex];
        return {
          ...prev,
          raidIndex: nextIndex,
          bearsDefeated,
          gems,
          patienceActive: false,
          shieldActive: false,
          bossCombo: [],
          timerMs: next.timeLimitMs,
          energy: Math.min(MAX_ENERGY, prev.energy + 6),
        };
      }

      if (prev.phase === 'boss') {
        const titanSlain = defeated && prev.bossIndex === bosses.length - 1;
        const nextBoss = prev.bossIndex + 1;
        if (titanSlain || nextBoss >= bosses.length) {
          const report = finalizeReport({
            ...prev.report,
            bearsDefeated,
            auraGemsCollected: gems,
            longestAuraStreak: Math.max(prev.longestStreak, prev.streak),
          });
          if (gems < VICTORY_THRESHOLDS.gems) {
            return {
              ...prev,
              phase: 'defeat',
              bearsDefeated,
              gems,
              patienceActive: false,
              shieldActive: false,
              bossCombo: [],
              timerMs: 0,
              report,
              feedback: {
                tone: 'danger',
                title: 'Key Incomplete',
                detail: `The vault needs ${VICTORY_THRESHOLDS.gems} Aura Gems. Only ${gems} collected — the chest stays sealed.`,
              },
            };
          }
          return {
            ...prev,
            phase: 'treasure',
            bearsDefeated,
            gems,
            celestial: true,
            patienceActive: false,
            shieldActive: false,
            bossCombo: [],
            timerMs: 0,
            report,
            feedback: {
              tone: 'success',
              title: 'Ultimate Aura Vault',
              detail: 'Gems form a celestial key. Aura approaches the floating vault.',
            },
          };
        }
        const boss = bosses[nextBoss];
        return {
          ...prev,
          bossIndex: nextBoss,
          bearsDefeated,
          gems,
          patienceActive: false,
          shieldActive: false,
          bossCombo: [],
          timerMs: boss.timeLimitMs,
          energy: Math.min(MAX_ENERGY, prev.energy + 10),
          shaking: true,
        };
      }

      return prev;
    },
    [raids, bosses, finalizeReport],
  );

  const castAbility = useCallback(
    (ability: AbilityId) => {
      setState((prev) => {
        if (prev.phase !== 'combat' && prev.phase !== 'boss') return prev;
        const encounter =
          prev.phase === 'combat' ? raids[prev.raidIndex] : bosses[prev.bossIndex];
        if (!encounter) return prev;

        const result = resolveAction({
          encounter,
          ability,
          patienceActive: prev.patienceActive,
          shieldActive: prev.shieldActive,
          energy: prev.energy,
          rockets: prev.rockets,
          streak: prev.streak,
          bossCombo: prev.bossCombo,
        });

        const shields = Math.max(0, prev.shields - result.damageTaken);
        const energy = Math.max(0, Math.min(MAX_ENERGY, prev.energy + result.energyDelta));
        const rockets = Math.max(0, prev.rockets + result.rocketsDelta);
        const streak = result.streakNext;
        const longestStreak = Math.max(prev.longestStreak, streak);

        const report: BattleReport = {
          ...prev.report,
          shieldDamageTaken: prev.report.shieldDamageTaken + result.damageTaken,
          missedAttacks: prev.report.missedAttacks + (result.miss ? 1 : 0),
          energyWasted: prev.report.energyWasted + result.energyWasted,
          successfulRetreats:
            prev.report.successfulRetreats + (result.retreated && result.ok ? 1 : 0),
          longestAuraStreak: longestStreak,
          bearsDefeated: prev.bearsDefeated,
          auraGemsCollected: prev.gems,
          disciplineScore: prev.report.disciplineScore,
        };

        if (shields <= 0) {
          return goDefeat(
            {
              ...prev,
              shields: 0,
              energy,
              rockets,
              streak: 0,
              longestStreak,
              report,
            },
            report,
          );
        }

        const nextBase: GameState = {
          ...prev,
          shields,
          energy,
          rockets,
          streak,
          longestStreak,
          patienceActive: result.patienceNext,
          shieldActive: result.shieldNext,
          bossCombo: result.bossComboNext,
          feedback: result.feedback,
          report,
          celestial: Boolean(result.celestialBullstrike),
          shaking: result.damageTaken > 0 || Boolean(result.celestialBullstrike),
        };

        if (!result.advance) {
          return nextBase;
        }

        if (result.retreated && prev.phase === 'boss' && encounter.bossPhase === 3) {
          return {
            ...nextBase,
            timerMs: Math.max(4000, Math.floor(prev.timerMs * 0.7)),
          };
        }

        if (result.retreated && prev.phase === 'combat') {
          return {
            ...advanceAfterClear(nextBase, false, 0),
            feedback: result.feedback,
          };
        }

        const advanced = advanceAfterClear(nextBase, result.defeated, result.gemsGained);
        return {
          ...advanced,
          feedback: result.feedback,
          celestial: Boolean(result.celestialBullstrike) || advanced.celestial,
        };
      });
    },
    [raids, bosses, goDefeat, advanceAfterClear],
  );

  const openChest = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'treasure') return prev;
      const gems = prev.gems + 500;
      const report = finalizeReport({
        ...prev.report,
        bearsDefeated: prev.bearsDefeated,
        auraGemsCollected: gems,
        longestAuraStreak: prev.longestStreak,
      });
      return {
        ...prev,
        phase: 'debrief',
        gems,
        report,
        feedback: {
          tone: 'success',
          title: 'Vault Unlocked',
          detail: 'The bears were never the real enemy. Fear was.',
        },
      };
    });
  }, [finalizeReport]);

  useEffect(() => {
    if (state.phase !== 'combat' && state.phase !== 'boss') return;

    const id = setInterval(() => {
      setState((prev) => {
        if (prev.phase !== 'combat' && prev.phase !== 'boss') return prev;
        if (prev.timerMs <= 0) return prev;

        const nextTimer = prev.timerMs - 100;
        if (nextTimer > 0) {
          const energy =
            nextTimer % 1000 === 0
              ? Math.min(MAX_ENERGY, prev.energy + 1)
              : prev.energy;
          return { ...prev, timerMs: nextTimer, energy, shaking: false };
        }

        const encounter =
          prev.phase === 'combat' ? raids[prev.raidIndex] : bosses[prev.bossIndex];
        if (!encounter) return prev;

        const { damage, feedback } = timeoutPenalty(encounter, prev.shieldActive);
        const shields = Math.max(0, prev.shields - damage);
        const report = {
          ...prev.report,
          shieldDamageTaken: prev.report.shieldDamageTaken + damage,
          missedAttacks: prev.report.missedAttacks + 1,
        };

        if (shields <= 0) {
          return goDefeat({ ...prev, shields: 0, report, streak: 0 }, report);
        }

        // Boss phases must be resolved with abilities — timeouts punish but never skip.
        if (prev.phase === 'boss') {
          return {
            ...prev,
            shields,
            streak: 0,
            patienceActive: false,
            shieldActive: false,
            bossCombo: [],
            timerMs: encounter.timeLimitMs,
            feedback,
            report,
            shaking: true,
          };
        }

        return {
          ...advanceAfterClear(
            {
              ...prev,
              shields,
              streak: 0,
              patienceActive: false,
              shieldActive: false,
              bossCombo: [],
              report,
            },
            false,
            0,
          ),
          feedback,
          shaking: true,
        };
      });
    }, 100);

    return () => clearInterval(id);
  }, [state.phase, raids, bosses, goDefeat, advanceAfterClear]);

  return {
    state,
    currentEncounter,
    displayedZone,
    raidsTotal: raids.length,
    beginRun,
    resetRun,
    castAbility,
    openChest,
    maxShields: MAX_SHIELDS,
    maxEnergy: MAX_ENERGY,
  };
}

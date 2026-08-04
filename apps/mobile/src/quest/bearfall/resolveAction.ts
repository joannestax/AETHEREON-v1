import type {
  AbilityId,
  BattleReport,
  CombatFeedback,
  Encounter,
} from '../../types/bearfall';

export type ResolveContext = {
  encounter: Encounter;
  ability: AbilityId;
  patienceActive: boolean;
  shieldActive: boolean;
  energy: number;
  rockets: number;
  streak: number;
  bossCombo: AbilityId[];
};

export type ResolveResult = {
  ok: boolean;
  defeated: boolean;
  retreated: boolean;
  gemsGained: number;
  damageTaken: number;
  energyDelta: number;
  rocketsDelta: number;
  streakNext: number;
  patienceNext: boolean;
  shieldNext: boolean;
  bossComboNext: AbilityId[];
  advance: boolean;
  miss: boolean;
  energyWasted: number;
  feedback: CombatFeedback;
  celestialBullstrike?: boolean;
};

function energyCost(ability: AbilityId): number {
  switch (ability) {
    case 'aura_cannon':
      return 8;
    case 'conviction_shield':
      return 12;
    case 'stop_loss_warp':
      return 10;
    case 'patience_pulse':
      return 6;
    case 'position_rockets':
      return 14;
  }
}

function streakMultiplier(streak: number): number {
  if (streak >= 8) return 2;
  if (streak >= 5) return 1.5;
  if (streak >= 3) return 1.25;
  return 1;
}

export function resolveAction(ctx: ResolveContext): ResolveResult {
  const { encounter, ability } = ctx;
  const cost = energyCost(ability);

  if (ctx.energy < cost) {
    return {
      ok: false,
      defeated: false,
      retreated: false,
      gemsGained: 0,
      damageTaken: Math.round(encounter.damage * 0.5),
      energyDelta: 0,
      rocketsDelta: 0,
      streakNext: 0,
      patienceNext: false,
      shieldNext: false,
      bossComboNext: [],
      advance: false,
      miss: true,
      energyWasted: 0,
      feedback: {
        tone: 'danger',
        title: 'Energy Depleted',
        detail: 'The ship cannot fire dry. Protect capital — wait for recharge.',
      },
    };
  }

  if (ability === 'position_rockets' && ctx.rockets <= 0) {
    return {
      ok: false,
      defeated: false,
      retreated: false,
      gemsGained: 0,
      damageTaken: Math.round(encounter.damage * 0.35),
      energyDelta: 0,
      rocketsDelta: 0,
      streakNext: 0,
      patienceNext: ctx.patienceActive,
      shieldNext: ctx.shieldActive,
      bossComboNext: ctx.bossCombo,
      advance: false,
      miss: true,
      energyWasted: 0,
      feedback: {
        tone: 'warn',
        title: 'Magazine Empty',
        detail: 'No rockets left. Size positions before the corridor runs dry.',
      },
    };
  }

  // Boss phase 3 requires the full combo sequence.
  if (encounter.bossPhase === 3) {
    return resolveBossFinale(ctx, cost);
  }

  if (ability === 'patience_pulse') {
    return {
      ok: true,
      defeated: false,
      retreated: false,
      gemsGained: 0,
      damageTaken: 0,
      energyDelta: -cost,
      rocketsDelta: 0,
      streakNext: ctx.streak,
      patienceNext: true,
      shieldNext: ctx.shieldActive,
      bossComboNext: encounter.bossPhase ? [...ctx.bossCombo, ability] : [],
      advance: false,
      miss: false,
      energyWasted: 0,
      feedback: {
        tone: 'info',
        title: 'Patience Pulse Active',
        detail:
          encounter.bearType === 'fakeout' || encounter.bossPhase === 1
            ? 'False signal cleared. True vector confirmed on radar.'
            : 'Time slows. The attack path is clear — now strike.',
      },
    };
  }

  if (ability === 'conviction_shield') {
    return {
      ok: true,
      defeated: false,
      retreated: false,
      gemsGained: 0,
      damageTaken: 0,
      energyDelta: -cost,
      rocketsDelta: 0,
      streakNext: ctx.streak,
      patienceNext: ctx.patienceActive,
      shieldNext: true,
      bossComboNext: encounter.bossPhase ? [...ctx.bossCombo, ability] : [],
      advance: false,
      miss: false,
      energyWasted: 0,
      feedback: {
        tone: 'info',
        title: 'Conviction Shield Online',
        detail: 'Heavy damage blocked. Finish the threat while shields hold.',
      },
    };
  }

  if (ability === 'stop_loss_warp') {
    const heavy =
      encounter.bearType === 'leverage_grizzly' ||
      encounter.bearType === 'elite' ||
      encounter.bearType === 'titan';
    return {
      ok: true,
      defeated: false,
      retreated: true,
      gemsGained: 0,
      damageTaken: heavy ? 0 : 4,
      energyDelta: -cost,
      rocketsDelta: 0,
      streakNext: 0,
      patienceNext: false,
      shieldNext: false,
      bossComboNext: [],
      advance: true,
      miss: false,
      energyWasted: heavy ? 0 : 4,
      feedback: {
        tone: heavy ? 'success' : 'warn',
        title: heavy ? 'Clean Stop-Loss Warp' : 'Premature Warp',
        detail: heavy
          ? 'You survived to strike later. Capital preserved.'
          : 'Retreated from a manageable threat — energy spent, streak broken.',
      },
    };
  }

  if (encounter.bearType === 'fakeout' && !ctx.patienceActive) {
    return {
      ok: false,
      defeated: false,
      retreated: false,
      gemsGained: 0,
      damageTaken: encounter.damage,
      energyDelta: -cost,
      rocketsDelta: ability === 'position_rockets' ? -1 : 0,
      streakNext: 0,
      patienceNext: false,
      shieldNext: false,
      bossComboNext: [],
      advance: true,
      miss: true,
      energyWasted: cost,
      feedback: {
        tone: 'danger',
        title: 'Fakeout',
        detail:
          'Fired at a ghost candle. Wait for confirmation — Patience Pulse first.',
      },
    };
  }

  if (encounter.bossPhase === 1 && !ctx.patienceActive) {
    return {
      ok: false,
      defeated: false,
      retreated: false,
      gemsGained: 0,
      damageTaken: Math.round(encounter.damage * 0.7),
      energyDelta: -cost,
      rocketsDelta: ability === 'position_rockets' ? -1 : 0,
      streakNext: 0,
      patienceNext: false,
      shieldNext: false,
      bossComboNext: [],
      advance: true,
      miss: true,
      energyWasted: cost,
      feedback: {
        tone: 'danger',
        title: 'Fear Roar',
        detail: 'False warnings won. Pulse the noise before you strike.',
      },
    };
  }

  if (encounter.bearType === 'leverage_grizzly') {
    if (ability === 'position_rockets') {
      const gems = Math.round(encounter.gems * streakMultiplier(ctx.streak + 1));
      return {
        ok: true,
        defeated: true,
        retreated: false,
        gemsGained: gems,
        damageTaken: 0,
        energyDelta: -cost,
        rocketsDelta: -1,
        streakNext: ctx.streak + 1,
        patienceNext: false,
        shieldNext: false,
        bossComboNext: [],
        advance: true,
        miss: false,
        energyWasted: 0,
        feedback: {
          tone: 'success',
          title: 'Position Sized',
          detail: `One rocket. Clean detachment. +${gems} Aura Gems.`,
        },
      };
    }
    if (ability === 'aura_cannon') {
      const mitigated = ctx.shieldActive ? 0.25 : 0.55;
      return {
        ok: false,
        defeated: false,
        retreated: false,
        gemsGained: 0,
        damageTaken: Math.round(encounter.damage * mitigated),
        energyDelta: -cost,
        rocketsDelta: 0,
        streakNext: 0,
        patienceNext: false,
        shieldNext: false,
        bossComboNext: [],
        advance: true,
        miss: true,
        energyWasted: cost,
        feedback: {
          tone: 'warn',
          title: 'Undersized Strike',
          detail: ctx.shieldActive
            ? 'Cannon alone cannot clear a grizzly. Shield bought time — use rockets.'
            : 'Overexposure risk: cannon ticks, grizzly drains. Size with rockets.',
        },
      };
    }
  }

  if (ability === 'position_rockets') {
    // Using rockets on light targets wastes limited ammo.
    if (encounter.bearType === 'panic_cub') {
      const gems = Math.round(encounter.gems * streakMultiplier(ctx.streak + 1));
      return {
        ok: true,
        defeated: true,
        retreated: false,
        gemsGained: gems,
        damageTaken: 0,
        energyDelta: -cost,
        rocketsDelta: -1,
        streakNext: ctx.streak + 1,
        patienceNext: false,
        shieldNext: false,
        bossComboNext: [],
        advance: true,
        miss: false,
        energyWasted: 8,
        feedback: {
          tone: 'warn',
          title: 'Overkill',
          detail: `Cub down, but a rocket was wasted. +${gems} gems — discipline score takes a hit.`,
        },
      };
    }
    const gems = Math.round(encounter.gems * streakMultiplier(ctx.streak + 1));
    return {
      ok: true,
      defeated: true,
      retreated: false,
      gemsGained: gems,
      damageTaken: 0,
      energyDelta: -cost,
      rocketsDelta: -1,
      streakNext: ctx.streak + 1,
      patienceNext: false,
      shieldNext: false,
      bossComboNext: [],
      advance: true,
      miss: false,
      energyWasted: 0,
      feedback: {
        tone: 'success',
        title: 'Rocket Impact',
        detail: `Aura finishes the strike. +${gems} Aura Gems.`,
      },
    };
  }

  // Aura Cannon default success path (and boss phase 1/2 after pulse/shield setup).
  if (ability === 'aura_cannon') {
    if (encounter.bossPhase === 2 && !ctx.shieldActive && !ctx.patienceActive) {
      return {
        ok: false,
        defeated: false,
        retreated: false,
        gemsGained: 0,
        damageTaken: encounter.damage,
        energyDelta: -cost,
        rocketsDelta: 0,
        streakNext: 0,
        patienceNext: false,
        shieldNext: false,
        bossComboNext: [],
        advance: true,
        miss: true,
        energyWasted: cost,
        feedback: {
          tone: 'danger',
          title: 'Claw Crash',
          detail: 'Both wings hit. Prioritize — shield the true breach first.',
        },
      };
    }

    const gems = Math.round(encounter.gems * streakMultiplier(ctx.streak + 1));
    const phaseClear =
      encounter.bossPhase === 1 || encounter.bossPhase === 2
        ? {
            title:
              encounter.bossPhase === 1
                ? 'Fear Cleared'
                : 'Wing Priority Locked',
            detail:
              encounter.bossPhase === 1
                ? 'False signals burned away. The Titan reveals its true mass.'
                : 'True breach defended. Aura repositions for the charge.',
          }
        : {
            title: 'Bear Cleared',
            detail: `Aura delivers the finishing strike. +${gems} Aura Gems.`,
          };

    return {
      ok: true,
      defeated: encounter.bossPhase ? false : true,
      retreated: false,
      gemsGained: encounter.bossPhase ? 0 : gems,
      damageTaken: 0,
      energyDelta: -cost,
      rocketsDelta: 0,
      streakNext: ctx.streak + 1,
      patienceNext: false,
      shieldNext: false,
      bossComboNext: [],
      advance: true,
      miss: false,
      energyWasted: 0,
      feedback: {
        tone: 'success',
        title: phaseClear.title,
        detail: phaseClear.detail,
      },
    };
  }

  return {
    ok: false,
    defeated: false,
    retreated: false,
    gemsGained: 0,
    damageTaken: Math.round(encounter.damage * 0.4),
    energyDelta: -cost,
    rocketsDelta: 0,
    streakNext: 0,
    patienceNext: false,
    shieldNext: false,
    bossComboNext: [],
    advance: true,
    miss: true,
    energyWasted: cost,
    feedback: {
      tone: 'warn',
      title: 'No Effect',
      detail: 'Wrong tool for this vector. Read the threat, then act.',
    },
  };
}

function resolveBossFinale(ctx: ResolveContext, cost: number): ResolveResult {
  const { ability, encounter } = ctx;
  const nextCombo = [...ctx.bossCombo, ability];

  if (ability === 'patience_pulse' && ctx.bossCombo.length === 0) {
    return {
      ok: true,
      defeated: false,
      retreated: false,
      gemsGained: 0,
      damageTaken: 0,
      energyDelta: -cost,
      rocketsDelta: 0,
      streakNext: ctx.streak,
      patienceNext: true,
      shieldNext: false,
      bossComboNext: nextCombo,
      advance: false,
      miss: false,
      energyWasted: 0,
      feedback: {
        tone: 'info',
        title: 'Capitulation Slowed',
        detail: 'Pulse locked. Raise Conviction Shield.',
      },
    };
  }

  if (
    ability === 'conviction_shield' &&
    ctx.bossCombo.length === 1 &&
    ctx.bossCombo[0] === 'patience_pulse'
  ) {
    return {
      ok: true,
      defeated: false,
      retreated: false,
      gemsGained: 0,
      damageTaken: 0,
      energyDelta: -cost,
      rocketsDelta: 0,
      streakNext: ctx.streak,
      patienceNext: true,
      shieldNext: true,
      bossComboNext: nextCombo,
      advance: false,
      miss: false,
      energyWasted: 0,
      feedback: {
        tone: 'info',
        title: 'Shield Brace',
        detail: 'Charge absorbed. Fire Aura Cannon — Celestial Bullstrike ready.',
      },
    };
  }

  if (
    ability === 'aura_cannon' &&
    ctx.bossCombo.length === 2 &&
    ctx.bossCombo[0] === 'patience_pulse' &&
    ctx.bossCombo[1] === 'conviction_shield'
  ) {
    const gems = encounter.gems;
    return {
      ok: true,
      defeated: true,
      retreated: false,
      gemsGained: gems,
      damageTaken: 0,
      energyDelta: -cost,
      rocketsDelta: 0,
      streakNext: ctx.streak + 1,
      patienceNext: false,
      shieldNext: false,
      bossComboNext: [],
      advance: true,
      miss: false,
      energyWasted: 0,
      celestialBullstrike: true,
      feedback: {
        tone: 'success',
        title: 'Celestial Bullstrike',
        detail: `The Titan shatters into a storm of Aura Gems. +${gems}.`,
      },
    };
  }

  if (ability === 'stop_loss_warp') {
    return {
      ok: true,
      defeated: false,
      retreated: true,
      gemsGained: 0,
      damageTaken: 8,
      energyDelta: -cost,
      rocketsDelta: 0,
      streakNext: 0,
      patienceNext: false,
      shieldNext: false,
      bossComboNext: [],
      advance: false,
      miss: false,
      energyWasted: 0,
      feedback: {
        tone: 'warn',
        title: 'Warp Slip',
        detail: 'You buy seconds, not victory. Reset the combo: Pulse → Shield → Cannon.',
      },
    };
  }

  return {
    ok: false,
    defeated: false,
    retreated: false,
    gemsGained: 0,
    damageTaken: Math.round(encounter.damage * 0.6),
    energyDelta: -cost,
    rocketsDelta: ability === 'position_rockets' ? -1 : 0,
    streakNext: 0,
    patienceNext: false,
    shieldNext: false,
    bossComboNext: [],
    advance: false,
    miss: true,
    energyWasted: cost,
    feedback: {
      tone: 'danger',
      title: 'Combo Broken',
      detail: 'Capitulation Charge demands Pulse → Shield → Cannon in order.',
    },
  };
}

export function computeDisciplineScore(report: Omit<BattleReport, 'disciplineScore'>): number {
  const survival = Math.max(0, 40 - report.shieldDamageTaken * 0.25);
  const precision = Math.max(0, 25 - report.missedAttacks * 3);
  const efficiency = Math.max(0, 15 - report.energyWasted * 0.35);
  const streak = Math.min(15, report.longestAuraStreak * 1.5);
  const retreats = Math.min(5, report.successfulRetreats * 2);
  return Math.round(
    Math.min(100, Math.max(0, survival + precision + efficiency + streak + retreats)),
  );
}

export function timeoutPenalty(encounter: Encounter, shieldActive: boolean) {
  const raw = Math.round(encounter.damage * 0.65);
  const damage = shieldActive ? Math.round(raw * 0.35) : raw;
  return {
    damage,
    feedback: {
      tone: 'danger' as const,
      title: 'Too Slow',
      detail: shieldActive
        ? 'Shield ate the worst of it — still a hit. Decide faster next vector.'
        : 'Hesitation let the bear aboard. Protect the ship.',
    },
  };
}

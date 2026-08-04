export type ShipZone =
  | 'left_wing'
  | 'right_wing'
  | 'engine'
  | 'cockpit'
  | 'cargo_vault';

export type BearType =
  | 'panic_cub'
  | 'fakeout'
  | 'leverage_grizzly'
  | 'elite'
  | 'titan';

export type AbilityId =
  | 'aura_cannon'
  | 'conviction_shield'
  | 'stop_loss_warp'
  | 'patience_pulse'
  | 'position_rockets';

export type QuestPhase =
  | 'intro'
  | 'combat'
  | 'boss'
  | 'treasure'
  | 'debrief'
  | 'defeat';

export type BossPhase = 1 | 2 | 3 | 'done';

export type AbilityDef = {
  id: AbilityId;
  name: string;
  short: string;
  effect: string;
  energyCost: number;
  limited?: boolean;
};

export type Encounter = {
  id: string;
  bearType: BearType;
  zone: ShipZone;
  decoyZone?: ShipZone;
  label: string;
  threat: string;
  damage: number;
  gems: number;
  timeLimitMs: number;
  bossPhase?: 1 | 2 | 3;
};

export type BattleReport = {
  bearsDefeated: number;
  auraGemsCollected: number;
  shieldDamageTaken: number;
  missedAttacks: number;
  energyWasted: number;
  successfulRetreats: number;
  longestAuraStreak: number;
  disciplineScore: number;
};

export type CombatFeedback = {
  tone: 'success' | 'warn' | 'danger' | 'info';
  title: string;
  detail: string;
};

export type TreasureReward = {
  id: string;
  label: string;
  detail: string;
};

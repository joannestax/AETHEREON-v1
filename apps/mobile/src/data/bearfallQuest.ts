import type {
  AbilityDef,
  Encounter,
  ShipZone,
  TreasureReward,
} from '../types/bearfall';

export const BEARFALL_META = {
  title: 'Bearfall Run',
  subtitle: 'The Ultimate Aura Vault',
  questType: 'Champion Assist Mission',
  length: '4–6 minutes',
  location: 'The Obsidian Market Belt',
  champion: 'Space Princess Aura',
  playerRole: 'Aura’s Navigator and combat co-pilot',
  aethereonOpen:
    'The Aura Vault has awakened. But where treasure rises, the bears follow.',
  aethereonClose:
    'Victory does not belong to the warrior who attacks the most. It belongs to the one who survives long enough to strike correctly.',
  auraVictory: 'The bears were never the real enemy. Fear was.',
  objective:
    'Reach the legendary Ultimate Aura Gem Treasure Chest before the ship’s shields collapse.',
  victoryNeeds: [
    'Defeat 20 Bear Raiders',
    'Collect 100 Aura Gems',
    'Protect Aura’s ship',
    'Defeat the Titan Bear',
    'Unlock the Ultimate Aura Gem Treasure Chest',
  ],
  lessons: [
    'Capital preservation',
    'Position sizing',
    'Patience during volatility',
    'Waiting for confirmation',
    'Avoiding panic decisions',
    'Knowing when to fight and when to retreat',
    'Protecting the portfolio before chasing rewards',
  ],
} as const;

export const ZONE_LABELS: Record<ShipZone, string> = {
  left_wing: 'Left Wing',
  right_wing: 'Right Wing',
  engine: 'Engine',
  cockpit: 'Cockpit',
  cargo_vault: 'Cargo Vault',
};

export const ABILITIES: AbilityDef[] = [
  {
    id: 'aura_cannon',
    name: 'Aura Cannon',
    short: 'CANNON',
    effect: 'Fires directly at an attacking bear',
    energyCost: 8,
  },
  {
    id: 'conviction_shield',
    name: 'Conviction Shield',
    short: 'SHIELD',
    effect: 'Blocks heavy incoming damage',
    energyCost: 12,
  },
  {
    id: 'stop_loss_warp',
    name: 'Stop-Loss Warp',
    short: 'WARP',
    effect: 'Escapes an overwhelming attack',
    energyCost: 10,
  },
  {
    id: 'patience_pulse',
    name: 'Patience Pulse',
    short: 'PULSE',
    effect: 'Slows enemies and reveals fake attacks',
    energyCost: 6,
  },
  {
    id: 'position_rockets',
    name: 'Position-Size Rockets',
    short: 'ROCKET',
    effect: 'Powerful limited-ammo missiles',
    energyCost: 14,
    limited: true,
  },
];

export const TREASURE_REWARDS: TreasureReward[] = [
  { id: 'gems', label: '500 Aura Gems', detail: 'Vault bonus payload' },
  { id: 'badge', label: 'Bearfall Champion Badge', detail: 'Proof of discipline under fire' },
  { id: 'armor', label: 'Celestial Ship Armor', detail: 'Shield integrity restored' },
  { id: 'crown', label: 'Rare Aura Crown Fragment', detail: 'Champion relic' },
  { id: 'scroll', label: 'Aethereon Knowledge Scroll', detail: 'Market wisdom crystallized' },
  { id: 'trail', label: 'Legendary Ship Trail', detail: 'Chance unlock — cosmic wake' },
];

const ZONES: ShipZone[] = [
  'left_wing',
  'right_wing',
  'engine',
  'cockpit',
  'cargo_vault',
];

function zoneAt(i: number): ShipZone {
  return ZONES[i % ZONES.length];
}

function decoyFor(zone: ShipZone, salt: number): ShipZone {
  return ZONES[(ZONES.indexOf(zone) + 1 + (salt % 3)) % ZONES.length];
}

/** Scripted 20-raider corridor before the Titan Bear. */
export function buildRaiderEncounters(): Encounter[] {
  const raids: Array<Omit<Encounter, 'id' | 'zone' | 'decoyZone'>> = [
    {
      bearType: 'panic_cub',
      label: 'Panic Cub',
      threat: 'Swarming fast — do not empty the arsenal.',
      damage: 8,
      gems: 5,
      timeLimitMs: 7000,
    },
    {
      bearType: 'panic_cub',
      label: 'Panic Cub',
      threat: 'Chaotic leap on the wing.',
      damage: 8,
      gems: 5,
      timeLimitMs: 6500,
    },
    {
      bearType: 'panic_cub',
      label: 'Panic Cub Pair',
      threat: 'Sudden drop. Stay precise.',
      damage: 10,
      gems: 5,
      timeLimitMs: 6000,
    },
    {
      bearType: 'fakeout',
      label: 'Fakeout Bear',
      threat: 'Radar flicker. Wait for confirmation.',
      damage: 14,
      gems: 10,
      timeLimitMs: 8000,
    },
    {
      bearType: 'panic_cub',
      label: 'Panic Cub',
      threat: 'Energy-wasting bait if you overfire.',
      damage: 8,
      gems: 5,
      timeLimitMs: 6000,
    },
    {
      bearType: 'fakeout',
      label: 'Fakeout Bear',
      threat: 'Appears, vanishes, strikes elsewhere.',
      damage: 16,
      gems: 10,
      timeLimitMs: 7500,
    },
    {
      bearType: 'leverage_grizzly',
      label: 'Leverage Grizzly',
      threat: 'Clamped to the engine. Size the strike.',
      damage: 22,
      gems: 10,
      timeLimitMs: 9000,
    },
    {
      bearType: 'panic_cub',
      label: 'Panic Cub',
      threat: 'Fast chaos after the grizzly.',
      damage: 9,
      gems: 5,
      timeLimitMs: 5500,
    },
    {
      bearType: 'elite',
      label: 'Elite Bear Raider',
      threat: 'Heavy hit — shield or strike clean.',
      damage: 18,
      gems: 20,
      timeLimitMs: 8000,
    },
    {
      bearType: 'fakeout',
      label: 'Fakeout Bear',
      threat: 'Not every red candle is the apocalypse.',
      damage: 15,
      gems: 10,
      timeLimitMs: 7000,
    },
    {
      bearType: 'leverage_grizzly',
      label: 'Leverage Grizzly',
      threat: 'Overexposure turns manageable damage into disaster.',
      damage: 24,
      gems: 10,
      timeLimitMs: 8500,
    },
    {
      bearType: 'panic_cub',
      label: 'Panic Cub',
      threat: 'Do not panic during sudden drops.',
      damage: 8,
      gems: 5,
      timeLimitMs: 5000,
    },
    {
      bearType: 'elite',
      label: 'Elite Bear Raider',
      threat: 'Guarding the cargo vault approach.',
      damage: 18,
      gems: 20,
      timeLimitMs: 7500,
    },
    {
      bearType: 'fakeout',
      label: 'Fakeout Bear',
      threat: 'Patience Pulse before you fire.',
      damage: 16,
      gems: 10,
      timeLimitMs: 7000,
    },
    {
      bearType: 'leverage_grizzly',
      label: 'Leverage Grizzly',
      threat: 'One controlled rocket. Not the whole magazine.',
      damage: 26,
      gems: 10,
      timeLimitMs: 8000,
    },
    {
      bearType: 'panic_cub',
      label: 'Panic Cub',
      threat: 'Corridor thinning — keep the streak.',
      damage: 10,
      gems: 5,
      timeLimitMs: 5000,
    },
    {
      bearType: 'elite',
      label: 'Elite Bear Raider',
      threat: 'Shield integrity under pressure.',
      damage: 20,
      gems: 20,
      timeLimitMs: 7000,
    },
    {
      bearType: 'fakeout',
      label: 'Fakeout Bear',
      threat: 'Final decoy before the vault.',
      damage: 17,
      gems: 10,
      timeLimitMs: 6500,
    },
    {
      bearType: 'leverage_grizzly',
      label: 'Leverage Grizzly',
      threat: 'Last armored raider on the engine.',
      damage: 24,
      gems: 10,
      timeLimitMs: 7500,
    },
    {
      bearType: 'elite',
      label: 'Elite Bear Raider',
      threat: 'Vault threshold guardian.',
      damage: 20,
      gems: 20,
      timeLimitMs: 7000,
    },
  ];

  return raids.map((raid, i) => {
    const zone =
      raid.bearType === 'leverage_grizzly' ? 'engine' : zoneAt(i + 2);
    return {
      ...raid,
      id: `raid-${i + 1}`,
      zone,
      decoyZone:
        raid.bearType === 'fakeout' ? decoyFor(zone, i) : undefined,
    };
  });
}

export function buildBossEncounters(): Encounter[] {
  return [
    {
      id: 'boss-1',
      bearType: 'titan',
      zone: 'cargo_vault',
      decoyZone: 'left_wing',
      label: 'Titan Bear — Fear Roar',
      threat: 'Screen shakes. False warnings flood the radar.',
      damage: 20,
      gems: 0,
      timeLimitMs: 10000,
      bossPhase: 1,
    },
    {
      id: 'boss-2',
      bearType: 'titan',
      zone: 'left_wing',
      decoyZone: 'right_wing',
      label: 'Titan Bear — Claw Crash',
      threat: 'Both wings struck. Prioritize the true breach.',
      damage: 28,
      gems: 0,
      timeLimitMs: 10000,
      bossPhase: 2,
    },
    {
      id: 'boss-3',
      bearType: 'titan',
      zone: 'cockpit',
      label: 'Titan Bear — Capitulation Charge',
      threat: 'Pulse → Shield → Cannon. Then Celestial Bullstrike.',
      damage: 40,
      gems: 50,
      timeLimitMs: 14000,
      bossPhase: 3,
    },
  ];
}

export const GEM_VALUES = {
  panic_cub: 5,
  fakeout: 10,
  leverage_grizzly: 10,
  elite: 20,
  titan: 50,
} as const;

export const VICTORY_THRESHOLDS = {
  bears: 20,
  gems: 100,
} as const;

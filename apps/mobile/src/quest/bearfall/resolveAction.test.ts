/**
 * Lightweight logic smoke checks for Bearfall resolve rules.
 * Run: npx tsx src/quest/bearfall/resolveAction.test.ts
 */
import { resolveAction } from './resolveAction';
import type { Encounter } from '../../types/bearfall';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const cub: Encounter = {
  id: 't1',
  bearType: 'panic_cub',
  zone: 'left_wing',
  label: 'Panic Cub',
  threat: 'test',
  damage: 8,
  gems: 5,
  timeLimitMs: 5000,
};

const fakeout: Encounter = {
  id: 't2',
  bearType: 'fakeout',
  zone: 'cockpit',
  decoyZone: 'engine',
  label: 'Fakeout',
  threat: 'test',
  damage: 14,
  gems: 10,
  timeLimitMs: 7000,
};

const grizzly: Encounter = {
  id: 't3',
  bearType: 'leverage_grizzly',
  zone: 'engine',
  label: 'Grizzly',
  threat: 'test',
  damage: 22,
  gems: 10,
  timeLimitMs: 8000,
};

const finale: Encounter = {
  id: 't4',
  bearType: 'titan',
  zone: 'cockpit',
  label: 'Finale',
  threat: 'test',
  damage: 40,
  gems: 50,
  timeLimitMs: 14000,
  bossPhase: 3,
};

const base = {
  energy: 100,
  rockets: 3,
  streak: 0,
  patienceActive: false,
  shieldActive: false,
  bossCombo: [] as const,
};

{
  const r = resolveAction({ ...base, bossCombo: [], encounter: cub, ability: 'aura_cannon' });
  assert(r.defeated && r.gemsGained === 5, 'cannon clears cub for 5 gems');
}

{
  const r = resolveAction({ ...base, bossCombo: [], encounter: fakeout, ability: 'aura_cannon' });
  assert(r.miss && r.damageTaken === 14, 'cannon without pulse fails fakeout');
}

{
  const pulse = resolveAction({
    ...base,
    bossCombo: [],
    encounter: fakeout,
    ability: 'patience_pulse',
  });
  assert(pulse.patienceNext && !pulse.advance, 'pulse reveals without advancing');
  const r = resolveAction({
    ...base,
    bossCombo: [],
    encounter: fakeout,
    ability: 'aura_cannon',
    patienceActive: true,
  });
  assert(r.defeated && r.gemsGained === 10, 'pulse then cannon clears fakeout');
}

{
  const r = resolveAction({
    ...base,
    bossCombo: [],
    encounter: grizzly,
    ability: 'position_rockets',
  });
  assert(r.defeated && r.rocketsDelta === -1, 'rocket clears grizzly');
}

{
  const a = resolveAction({
    ...base,
    bossCombo: [],
    encounter: finale,
    ability: 'patience_pulse',
  });
  const b = resolveAction({
    ...base,
    bossCombo: ['patience_pulse'],
    encounter: finale,
    ability: 'conviction_shield',
    patienceActive: true,
  });
  const c = resolveAction({
    ...base,
    bossCombo: ['patience_pulse', 'conviction_shield'],
    encounter: finale,
    ability: 'aura_cannon',
    patienceActive: true,
    shieldActive: true,
  });
  assert(a.bossComboNext.length === 1, 'finale step 1');
  assert(b.bossComboNext.length === 2, 'finale step 2');
  assert(Boolean(c.celestialBullstrike) && c.gemsGained === 50, 'bullstrike awards titan gems');
}

console.log('bearfall resolveAction checks passed');

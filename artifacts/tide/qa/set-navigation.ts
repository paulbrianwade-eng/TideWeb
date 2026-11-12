import assert from 'node:assert/strict';
import type { WorkoutBlock } from '../src/types';
import { nextStrengthSet, parseRestSeconds, restForItem } from '../src/lib/set-navigation';

const block = (orders: string[], rests: (string | undefined)[] = []): WorkoutBlock => ({
  id: 'strength',
  index: 1,
  kind: 'fuerza',
  title: 'Contraste',
  duration: '15 min',
  minutes: 15,
  format: 'sets',
  formatLabel: '3 series',
  rest: '45 s',
  items: orders.map((order, index) => ({
    exerciseId: `exercise-${index}`,
    order,
    sets: 3,
    rest: rests[index],
  })),
});

const contrast = block(['A1', 'A2', 'B'], ['90–120 s', '60–90 s']);
assert.deepEqual(nextStrengthSet(contrast, [0, 1, 2], 0, 0), { nextIndex: 1, nextSet: 0, pause: true });
assert.deepEqual(nextStrengthSet(contrast, [0, 1, 2], 1, 0), { nextIndex: 0, nextSet: 1, pause: true });
assert.deepEqual(nextStrengthSet(contrast, [0, 1, 2], 1, 2), { nextIndex: 2, nextSet: 0, pause: true });
assert.deepEqual(nextStrengthSet(contrast, [0, 1, 2], 2, 0), { nextIndex: 2, nextSet: 1, pause: true });
assert.deepEqual(nextStrengthSet(contrast, [0, 1, 2], 2, 2), { nextSet: 0, pause: false });

const triple = block(['A1', 'A2', 'A3', 'B1', 'B2']);
assert.deepEqual(nextStrengthSet(triple, [0, 1, 2, 3, 4], 0, 0), { nextIndex: 1, nextSet: 0, pause: false });
assert.deepEqual(nextStrengthSet(triple, [0, 1, 2, 3, 4], 1, 0), { nextIndex: 2, nextSet: 0, pause: false });
assert.deepEqual(nextStrengthSet(triple, [0, 1, 2, 3, 4], 2, 0), { nextIndex: 0, nextSet: 1, pause: true });
assert.deepEqual(nextStrengthSet(triple, [0, 1, 2, 3, 4], 2, 2), { nextIndex: 3, nextSet: 0, pause: true });
assert.deepEqual(nextStrengthSet(triple, [0, 1, 2, 3, 4], 3, 0), { nextIndex: 4, nextSet: 0, pause: false });
assert.deepEqual(nextStrengthSet(triple, [0, 1, 2, 3, 4], 4, 0), { nextIndex: 3, nextSet: 1, pause: true });

const selected = block(['A', 'B', 'C']);
assert.deepEqual(nextStrengthSet(selected, [1], 1, 0), { nextIndex: 1, nextSet: 1, pause: true });
assert.deepEqual(nextStrengthSet(selected, [1], 1, 2), { nextSet: 0, pause: false });
assert.equal(parseRestSeconds('90–120 s'), 90);
assert.equal(parseRestSeconds('1–2 min'), 60);
assert.equal(restForItem('60–90 s', '120 s'), 60);
assert.equal(restForItem(undefined, '45 s entre vueltas'), 45);
assert.equal(restForItem(undefined, 'Administrá ritmo'), 60);
console.log('Set navigation OK');
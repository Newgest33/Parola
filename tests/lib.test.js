import test from 'node:test';
import assert from 'node:assert/strict';
import { checkTyped, review, newCard, streak, dayKey, DAY, similarity, shuffle } from '../src/lib.js';

test('checkTyped : exact, casse et ponctuation ignorées', () => {
  assert.equal(checkTyped('Buongiorno!', 'buongiorno').kind, 'exact');
  assert.equal(checkTyped('  come   stai ', 'Come stai?').kind, 'exact');
});
test('checkTyped : accents oubliés acceptés mais signalés', () => {
  const r = checkTyped('cafe', 'caffè'); // accent + une lettre manquante
  assert.equal(checkTyped('perche', 'perché').kind, 'accent');
  assert.ok(r.ok);
});
test('checkTyped : une faute de frappe tolérée, deux non', () => {
  assert.equal(checkTyped('grazye', 'grazie').kind, 'typo');
  assert.equal(checkTyped('grxxie', 'grazie').ok, false);
  assert.equal(checkTyped('', 'ciao').ok, false);
});
test('SRS : progression 1j -> 3j -> x ease, et reset sur erreur', () => {
  const t0 = 1_000_000;
  let c = review(newCard(), true, t0);
  assert.equal(c.interval, 1); assert.equal(c.due, t0 + DAY);
  c = review(c, true, t0); assert.equal(c.interval, 3);
  c = review(c, true, t0); assert.ok(c.interval >= 7);
  const w = review(c, false, t0);
  assert.equal(w.reps, 0); assert.equal(w.lapses, 1); assert.ok(w.due - t0 <= 10 * 60000);
  assert.ok(w.ease < c.ease);
});
test('série : jour de grâce pardonné, deux jours manqués cassent', () => {
  const now = new Date(2026, 5, 10, 12).getTime();
  const d = (n) => dayKey(now - n * DAY);
  assert.equal(streak({ [d(0)]: 1, [d(1)]: 1, [d(2)]: 1 }, now), 3);
  assert.equal(streak({ [d(1)]: 1, [d(2)]: 1 }, now), 2); // pas encore pratiqué aujourd'hui
  assert.equal(streak({ [d(0)]: 1, [d(2)]: 1, [d(3)]: 1 }, now), 3); // 1 trou pardonné
  assert.equal(streak({ [d(0)]: 1, [d(3)]: 1 }, now), 1); // 2 jours manqués
  assert.equal(streak({}, now), 0);
});
test('similarity & shuffle', () => {
  assert.ok(similarity('Buon giorno', 'buongiorno') > 0.85);
  assert.equal(shuffle([1, 2, 3, 4, 5]).sort().join(), '1,2,3,4,5');
});

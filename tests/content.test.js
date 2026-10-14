import test from 'node:test';
import assert from 'node:assert/strict';
import { LANGS } from '../src/content.js';

test('contenu : langues attendues, ids uniques, aucun texte vide', () => {
  assert.deepEqual(Object.keys(LANGS).sort(), ['es', 'it', 'lb']);
  for (const L of Object.values(LANGS)) {
    const ids = L.items.map((i) => i.id);
    assert.equal(new Set(ids).size, ids.length, L.name + ' : ids dupliqués');
    assert.ok(L.units.length >= 4);
    for (const i of L.items) { assert.ok(i.t.trim() && i.f.trim(), i.id); assert.ok(i.t.split(' ').length <= 6, i.id + ' trop long'); }
  }
});
test('luxembourgeois : exercices audio désactivés (pas de voix lb dans les navigateurs)', () => {
  assert.equal(LANGS.lb.noVoice, true);
  assert.equal(LANGS.it.noVoice, undefined);
});

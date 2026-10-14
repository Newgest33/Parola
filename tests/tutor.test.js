import test from 'node:test';
import assert from 'node:assert/strict';
import { trimHistory, systemPrompt, askTutor, TutorReply } from '../src/tutor.js';
import { SCENARIOS } from '../src/content.js';

test('trimHistory : commence par user, ignore le bruit, borne la taille', () => {
  const h = trimHistory([{ role: 'assistant', content: 'Ciao' }, { role: 'system', content: 'x' }, { role: 'user', content: '  ' },
    { role: 'user', content: 'Buongiorno' }, { role: 'assistant', content: 'Ciao!' }, { role: 'user', content: 'a'.repeat(5000) }]);
  assert.equal(h[0].role, 'user'); assert.equal(h.length, 3); assert.equal(h[2].content.length, 2000);
  const long = Array.from({ length: 200 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: 'm' + i }));
  assert.ok(trimHistory(long).length <= 48);
});
test('systemPrompt : nomme la langue et le scénario', () => {
  const p = systemPrompt('lb', SCENARIOS[0]);
  assert.match(p, /luxembourgeois/); assert.match(p, /Au café/);
});
test('askTutor (mock) : réponse conforme au schéma, corrige « grazi »', async () => {
  const r = await askTutor({ lang: 'it', scenario: SCENARIOS[0], messages: [{ role: 'user', content: 'grazi' }] }, { mock: true });
  TutorReply.parse(r);
  assert.equal(r.corrections[0].corrected, 'grazie');
  await assert.rejects(askTutor({ lang: 'it', scenario: SCENARIOS[0], messages: [] }, { mock: true }), /vide/);
});

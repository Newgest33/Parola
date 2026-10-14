// Tuteur conversationnel : appelé côté serveur uniquement (la clé API ne va jamais dans le navigateur).
// Un appel = une réponse structurée : réplique dans la langue cible, traduction, corrections expliquées, suggestion.
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';

export const MODEL = process.env.PAROLA_MODEL || 'claude-opus-5-5';
const MAX_TURNS = 24; // paires user/assistant conservées (limite la taille et le coût de chaque requête)

export const TutorReply = z.object({
  reply: z.string().describe('Réplique du personnage, dans la langue cible, 1 à 3 phrases simples, niveau de l’élève'),
  translation: z.string().describe('Traduction française fidèle de reply'),
  corrections: z.array(z.object({
    original: z.string().describe('Fragment exact écrit par l’élève'),
    corrected: z.string().describe('Version corrigée'),
    explanation: z.string().describe('Pourquoi, en français, une phrase courte'),
  })).describe('Erreurs du dernier message de l’élève ; vide si tout est correct'),
  praise: z.string().describe('Un mot d’encouragement sincère en français, ou chaîne vide'),
  suggestion: z.string().describe('Une phrase que l’élève pourrait dire ensuite, dans la langue cible'),
});

const LANG_NAMES = { it: 'italien', es: 'espagnol', lb: 'luxembourgeois' };

export function systemPrompt(lang, scenario) {
  const name = LANG_NAMES[lang] || lang;
  return `Tu es Léo, tuteur de ${name} dans l'application Parola, et tu joues un personnage dans un jeu de rôle avec un élève francophone débutant.

Scénario : ${scenario.title}. ${scenario.brief}

Règles du jeu de rôle :
- Reste dans le personnage et fais avancer la scène. Pose une question à la fin de chaque réplique pour que l'élève ait quelque chose à répondre.
- Écris en ${name} simple et naturel, tel qu'on le parle vraiment. Une à trois phrases courtes par réplique.
- Adapte-toi au niveau de l'élève : s'il écrit en français ou mélange les langues, réponds quand même en ${name} et propose dans "suggestion" comment il aurait pu le dire.
- Si l'élève fait des erreurs, signale-les dans "corrections" avec une explication très courte en français. Ignore les majuscules et la ponctuation. Les accents oubliés valent une correction mais sont minimes.
- Ne corrige jamais dans "reply" : le personnage ne fait pas la leçon, c'est le champ "corrections" qui s'en charge.
- "praise" : un encouragement sincère et précis quand l'élève progresse ou tente quelque chose de difficile ; chaîne vide sinon. Pas de flatterie creuse.
- Sois chaleureux, drôle quand c'est naturel, jamais condescendant.`;
}

export function trimHistory(messages) {
  const clean = messages.filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
  // commence toujours par un message user, et garde les MAX_TURNS derniers tours
  const trimmed = clean.slice(-MAX_TURNS * 2);
  while (trimmed.length && trimmed[0].role !== 'user') trimmed.shift();
  return trimmed;
}

let client;
export async function askTutor({ lang, scenario, messages }, { mock = process.env.PAROLA_TUTOR_MOCK === '1' } = {}) {
  const history = trimHistory(messages);
  if (!history.length) throw Object.assign(new Error('Conversation vide'), { status: 400 });
  if (mock) return mockReply(lang, history);

  client ??= new Anthropic();
  // Appel non streamé : les réponses sont courtes (quelques phrases) et le JSON doit être complet pour être affiché.
  // fallbacks "default" : si les classificateurs de sécurité refusent, la requête est rejouée sur un autre modèle côté serveur.
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 2048,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low', format: zodOutputFormat(TutorReply) },
    system: [{ type: 'text', text: systemPrompt(lang, scenario), cache_control: { type: 'ephemeral' } }],
    messages: history,
  });
  if (response.stop_reason === 'refusal') throw Object.assign(new Error('Le tuteur ne peut pas répondre à ce message.'), { status: 422 });
  const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  return TutorReply.parse(JSON.parse(text));
}

// Mode simulé (tests, démo sans clé) : réponses déterministes mais plausibles.
function mockReply(lang, history) {
  const last = history.at(-1).content;
  const greet = { it: 'Ciao! Cosa desideri?', es: '¡Hola! ¿Qué deseas?', lb: 'Moien! Wat wëllt Dir?' }[lang] || 'Ciao!';
  const corrections = /\bgrazi\b/i.test(last) ? [{ original: 'grazi', corrected: 'grazie', explanation: 'Il manque le « e » final.' }] : [];
  return { reply: greet, translation: 'Salut ! Que désires-tu ?', corrections, praise: corrections.length ? '' : 'Bien lancé !',
    suggestion: { it: 'Un caffè, per favore.', es: 'Un café, por favor.', lb: 'E Kaffi, wann ech gelift.' }[lang] || '' };
}

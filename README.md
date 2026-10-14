# Parola

Application d'apprentissage des langues (italien, espagnol et luxembourgeois pour francophones), pensée comme une alternative à Duolingo.
PWA sans dépendances : fonctionne hors ligne, aucun compte, aucune pub, aucun pistage.

## Lancer

```bash
npm install
export ANTHROPIC_API_KEY=sk-ant-...   # pour le tuteur IA (sinon l'onglet explique quoi faire)
npm start          # http://localhost:8080
npm test           # tests unitaires (SRS, tolérance aux fautes, série, contenu, tuteur simulé)
PAROLA_TUTOR_MOCK=1 npm start && node tests/e2e.mjs http://localhost:8080   # parcours complet dans Chromium
```

## Tuteur IA (Léo)

Onglet **Tuteur** : jeu de rôle en italien, espagnol ou luxembourgeois (café, gare, rencontre, marché, discussion libre).
À chaque tour, Claude renvoie une réponse structurée : réplique du personnage, traduction (bouton 🇫🇷), corrections expliquées
en français, encouragement, et une suggestion de ce que tu pourrais dire (bouton 💡). Dictée au micro quand le navigateur le permet.

- Appel côté serveur (`src/tutor.js`, SDK officiel `@anthropic-ai/sdk`) : la clé ne transite jamais par le navigateur.
- Modèle `claude-opus-5-5` par défaut (`PAROLA_MODEL` pour changer), effort `low` (réponses courtes, latence faible),
  sortie structurée validée par un schéma Zod, prompt système mis en cache.
- Repli serveur `fallbacks: "default"` activé : si les classificateurs de sécurité refusent une requête, elle est rejouée
  automatiquement sur un autre modèle au lieu d'échouer.
- `PAROLA_TUTOR_MOCK=1` : réponses simulées, pour la démo et les tests sans clé.

## Ce que Parola fait mieux

| Problème chez Duolingo | Réponse de Parola |
|---|---|
| Vies, pubs, paywall : on est puni d'apprendre | Aucune vie, aucun verrou, tout est gratuit et libre d'accès |
| Parcours rigide, exercices répétitifs | Répétition espacée réelle (SM-2) : chaque phrase revient *au moment où tu allais l'oublier* |
| Beaucoup de « taper la bonne tuile » | Production active : reconstruire, écrire, dicter, parler (reconnaissance vocale) |
| Mots isolés et phrases absurdes | Uniquement des phrases utiles du quotidien, groupées par situation |
| Fautes d'accent / de frappe = échec | Tolérance : accents signalés sans punir, 1 faute de frappe acceptée |
| Série cassée au moindre oubli → anxiété | 1 jour manqué pardonné automatiquement |
| Erreur corrigée = « validée » | Seule la 1ʳᵉ tentative compte pour la mémoire ; l'erreur revient plus tard en version facile |
| Données captives | Tout en local, export/import JSON de la progression |
| Écoute impossible dans le métro | Bouton « Je ne peux pas écouter / parler » : l'exercice est remplacé sans pénalité |

## Animations

Léo, le vrai spitz du propriétaire : trois photos détourées (`img/leo-*.webp`, pose de face = repos, regard levé = content, de profil = boudeur) animées en CSS (`src/mascot.js` : respiration, tête penchée, saut, boude, danse, confettis à partir de 3 bonnes réponses d'affilée, combo 🔥, secousse sur erreur,
XP flottants, compteur d'XP animé, petits sons WebAudio (désactivables dans Réglages). Tout est coupé avec `prefers-reduced-motion`.

## Luxembourgeois

Aucun navigateur n'a de voix luxembourgeoise : pour cette langue, écoute et parole sont remplacées par des exercices écrits.
Le contenu doit être relu par un locuteur natif avant diffusion.

## Architecture

- `src/lib.js` — logique pure : normalisation, distance d'édition, SRS, mémoire estimée, série.
- `src/content.js` — contenu. Ajouter une langue ou une unité = ajouter des paires `[cible, français]`.
- `src/fx.js` — confettis, texte flottant, sons.
- `src/tutor.js` — appel Claude (serveur), schéma de réponse, prompt système. `src/chat.js` — interface du tuteur.
- `src/app.js` — interface (DOM sans `innerHTML`), séances, exercices, synthèse/reconnaissance vocale (Web Speech API).
- `sw.js` + `manifest.webmanifest` — installable et utilisable hors ligne.

## Pistes suivantes

Plus de contenu/langues, synchronisation chiffrée entre appareils,
mode lecture (textes gradués), grammaire expliquée à la demande, voix neuronales hors ligne.

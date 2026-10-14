# Parola

Application d'apprentissage des langues (italien et espagnol pour francophones), pensée comme une alternative à Duolingo.
PWA sans dépendances : fonctionne hors ligne, aucun compte, aucune pub, aucun pistage.

## Lancer

```bash
npm start          # http://localhost:8080
npm test           # tests unitaires du moteur (SRS, tolérance aux fautes, série)
node tests/e2e.mjs http://localhost:8080   # parcours complet dans Chromium (playwright)
```

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

## Architecture

- `src/lib.js` — logique pure : normalisation, distance d'édition, SRS, mémoire estimée, série.
- `src/content.js` — contenu. Ajouter une langue ou une unité = ajouter des paires `[cible, français]`.
- `src/app.js` — interface (DOM sans `innerHTML`), séances, exercices, synthèse/reconnaissance vocale (Web Speech API).
- `sw.js` + `manifest.webmanifest` — installable et utilisable hors ligne.

## Pistes suivantes

Tuteur conversationnel IA (API Claude) avec correction expliquée, plus de contenu/langues, synchronisation chiffrée entre appareils,
mode lecture (textes gradués), grammaire expliquée à la demande, voix neuronales hors ligne.

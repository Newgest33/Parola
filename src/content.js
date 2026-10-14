// Contenu : phrases réelles, pas des mots isolés. t = langue cible, f = français.
// Ajouter une langue = ajouter une entrée ici (voix : code BCP-47 pour synthèse/reconnaissance vocale).
export const LANGS = {
  it: {
    name: 'Italien', flag: '🇮🇹', voice: 'it-IT',
    units: [
      { id: 'it1', title: 'Premiers mots', emoji: '👋', items: [
        ['Ciao', 'Salut'], ['Buongiorno', 'Bonjour'], ['Buonasera', 'Bonsoir'], ['Grazie mille', 'Merci beaucoup'],
        ['Prego', 'Je vous en prie'], ['Per favore', "S'il vous plaît"], ['Mi dispiace', 'Je suis désolé'],
        ['Come stai?', 'Comment vas-tu ?'], ['Sto bene, grazie', 'Je vais bien, merci'], ['Arrivederci', 'Au revoir'] ] },
      { id: 'it2', title: 'Se présenter', emoji: '🙋', items: [
        ['Mi chiamo Luca', "Je m'appelle Luca"], ['Piacere di conoscerti', 'Enchanté de te rencontrer'],
        ['Di dove sei?', "D'où viens-tu ?"], ['Sono francese', 'Je suis français'], ['Parli inglese?', 'Parles-tu anglais ?'],
        ['Non capisco', 'Je ne comprends pas'], ['Parla più lentamente', 'Parle plus lentement'],
        ['Abito a Parigi', "J'habite à Paris"], ['Ho venticinque anni', "J'ai vingt-cinq ans"], ['Studio italiano', "J'étudie l'italien"] ] },
      { id: 'it3', title: 'Au restaurant', emoji: '🍝', items: [
        ['Un tavolo per due', 'Une table pour deux'], ['Il menù, per favore', "La carte, s'il vous plaît"],
        ['Vorrei una pizza margherita', 'Je voudrais une pizza margherita'], ['Cosa mi consiglia?', 'Que me conseillez-vous ?'],
        ['Un bicchiere di vino rosso', 'Un verre de vin rouge'], ["L'acqua naturale", "L'eau plate"],
        ['Il conto, per favore', "L'addition, s'il vous plaît"], ['Era buonissimo', "C'était délicieux"],
        ['Sono vegetariano', 'Je suis végétarien'], ['Senza glutine', 'Sans gluten'] ] },
      { id: 'it4', title: 'En ville', emoji: '🗺️', items: [
        ["Dov'è la stazione?", 'Où est la gare ?'], ['Giri a destra', 'Tournez à droite'], ['Vada sempre dritto', 'Allez tout droit'],
        ['A sinistra', 'À gauche'], ['Quanto costa il biglietto?', 'Combien coûte le billet ?'],
        ["A che ora parte il treno?", 'À quelle heure part le train ?'], ['È lontano da qui?', "C'est loin d'ici ?"],
        ['Cerco una farmacia', 'Je cherche une pharmacie'], ['Mi sono perso', 'Je me suis perdu'], ['Può aiutarmi?', 'Pouvez-vous m’aider ?'] ] },
    ],
  },
  es: {
    name: 'Espagnol', flag: '🇪🇸', voice: 'es-ES',
    units: [
      { id: 'es1', title: 'Premiers mots', emoji: '👋', items: [
        ['Hola', 'Salut'], ['Buenos días', 'Bonjour'], ['Buenas noches', 'Bonne nuit'], ['Muchas gracias', 'Merci beaucoup'],
        ['De nada', 'De rien'], ['Por favor', "S'il vous plaît"], ['Lo siento', 'Je suis désolé'],
        ['¿Cómo estás?', 'Comment vas-tu ?'], ['Estoy bien, gracias', 'Je vais bien, merci'], ['Hasta luego', 'À tout à l’heure'] ] },
      { id: 'es2', title: 'Se présenter', emoji: '🙋', items: [
        ['Me llamo Ana', "Je m'appelle Ana"], ['Encantado de conocerte', 'Enchanté de te rencontrer'],
        ['¿De dónde eres?', "D'où viens-tu ?"], ['Soy francés', 'Je suis français'], ['¿Hablas inglés?', 'Parles-tu anglais ?'],
        ['No entiendo', 'Je ne comprends pas'], ['Habla más despacio', 'Parle plus lentement'],
        ['Vivo en París', "J'habite à Paris"], ['Tengo veinticinco años', "J'ai vingt-cinq ans"], ['Estudio español', "J'étudie l'espagnol"] ] },
      { id: 'es3', title: 'Au restaurant', emoji: '🥘', items: [
        ['Una mesa para dos', 'Une table pour deux'], ['La carta, por favor', "La carte, s'il vous plaît"],
        ['Quisiera una paella', 'Je voudrais une paella'], ['¿Qué me recomienda?', 'Que me conseillez-vous ?'],
        ['Una copa de vino tinto', 'Un verre de vin rouge'], ['Agua sin gas', "De l'eau plate"],
        ['La cuenta, por favor', "L'addition, s'il vous plaît"], ['Estaba buenísimo', "C'était délicieux"],
        ['Soy vegetariano', 'Je suis végétarien'], ['Sin gluten', 'Sans gluten'] ] },
      { id: 'es4', title: 'En ville', emoji: '🗺️', items: [
        ['¿Dónde está la estación?', 'Où est la gare ?'], ['Gire a la derecha', 'Tournez à droite'], ['Siga recto', 'Allez tout droit'],
        ['A la izquierda', 'À gauche'], ['¿Cuánto cuesta el billete?', 'Combien coûte le billet ?'],
        ['¿A qué hora sale el tren?', 'À quelle heure part le train ?'], ['¿Está lejos de aquí?', "C'est loin d'ici ?"],
        ['Busco una farmacia', 'Je cherche une pharmacie'], ['Me he perdido', 'Je me suis perdu'], ['¿Puede ayudarme?', 'Pouvez-vous m’aider ?'] ] },
    ],
  },
  lb: {
    name: 'Luxembourgeois', flag: '🇱🇺', voice: 'lb-LU', noVoice: true, // pas de voix lb dans les navigateurs : exercices audio désactivés
    units: [
      { id: 'lb1', title: 'Premiers mots', emoji: '👋', items: [
        ['Moien', 'Salut'], ['Gudde Moien', 'Bonjour'], ['Gudden Owend', 'Bonsoir'], ['Merci villmools', 'Merci beaucoup'],
        ['Gär geschitt', 'Je vous en prie'], ['Wann ech gelift', "S'il vous plaît"], ['Et deet mir leed', 'Je suis désolé'],
        ['Wéi geet et?', 'Comment vas-tu ?'], ['Et geet mir gutt, merci', 'Je vais bien, merci'], ['Äddi', 'Au revoir'] ] },
      { id: 'lb2', title: 'Se présenter', emoji: '🙋', items: [
        ['Ech heeschen Luc', "Je m'appelle Luc"], ['Et freet mech', 'Enchanté'], ['Wou kënns du hier?', "D'où viens-tu ?"],
        ['Ech sinn Fransous', 'Je suis français'], ['Schwätz du Englesch?', 'Parles-tu anglais ?'], ['Ech verstinn net', 'Je ne comprends pas'],
        ['Schwätz w.e.g. méi lues', 'Parle plus lentement, s’il te plaît'], ['Ech wunnen zu Paräis', "J'habite à Paris"],
        ['Ech sinn fënnefanzwanzeg Joer al', "J'ai vingt-cinq ans"], ['Ech léieren Lëtzebuergesch', "J'apprends le luxembourgeois"] ] },
      { id: 'lb3', title: 'Au restaurant', emoji: '🍺', items: [
        ['En Dësch fir zwee', 'Une table pour deux'], ["D'Kaart, wann ech gelift", "La carte, s'il vous plaît"],
        ['Ech hätt gär e Béier', 'Je voudrais une bière'], ['Ech hätt gär Gromperekichelcher', 'Je voudrais des galettes de pommes de terre'],
        ['Wat proposéiert Dir mir?', 'Que me conseillez-vous ?'], ['E Glas roude Wäin', 'Un verre de vin rouge'],
        ['E Glas Waasser', "Un verre d'eau"], ["D'Rechnung, wann ech gelift", "L'addition, s'il vous plaît"],
        ['Et war ganz lecker', "C'était délicieux"], ['Ech sinn Vegetarier', 'Je suis végétarien'] ] },
      { id: 'lb4', title: 'En ville', emoji: '🗺️', items: [
        ['Wou ass de Bahnhof?', 'Où est la gare ?'], ['Gitt riets', 'Tournez à droite'], ['Gitt riicht aus', 'Allez tout droit'],
        ['Lénks', 'À gauche'], ['Wéi vill kascht d’Ticket?', 'Combien coûte le billet ?'], ['Wéini fiert den Zuch?', 'Quand part le train ?'],
        ['Ass et wäit vun hei?', "C'est loin d'ici ?"], ['Ech sichen eng Apdikt', 'Je cherche une pharmacie'],
        ['Ech sinn verluer gaangen', 'Je me suis perdu'], ['Kënnt Dir mir hëllefen?', 'Pouvez-vous m’aider ?'] ] },
    ],
  },
};

// Normalisation : chaque item reçoit un id stable "unit:index"
for (const [code, L] of Object.entries(LANGS)) {
  L.code = code;
  for (const u of L.units) u.items = u.items.map(([t, f], i) => ({ id: `${u.id}:${i}`, t, f, unit: u.id }));
  L.items = L.units.flatMap((u) => u.items);
}

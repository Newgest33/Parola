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
      { id: 'it5', title: 'Les nombres', emoji: '🔢', items: [
        ['Uno, due, tre', 'Un, deux, trois'], ['Quattro, cinque, sei', 'Quatre, cinq, six'], ['Sette, otto, nove', 'Sept, huit, neuf'],
        ['Dieci', 'Dix'], ['Venti euro', 'Vingt euros'], ['Cento', 'Cent'], ['Il primo', 'Le premier'],
        ['La metà', 'La moitié'], ['Sono le tre', 'Il est trois heures'], ['Alle otto e mezza', 'À huit heures et demie'] ] },
      { id: 'it6', title: 'La famille', emoji: '👨‍👩‍👧', items: [
        ['Mia madre', 'Ma mère'], ['Mio padre', 'Mon père'], ['Ho un fratello', "J'ai un frère"], ['Ho due sorelle', "J'ai deux sœurs"],
        ['I miei nonni', 'Mes grands-parents'], ['Mio marito', 'Mon mari'], ['Mia moglie', 'Ma femme'],
        ['I nostri figli', 'Nos enfants'], ['Sono sposato', 'Je suis marié'], ['Ho un cane', "J'ai un chien"] ] },
      { id: 'it7', title: 'Les courses', emoji: '🛒', items: [
        ['Quanto costa?', 'Combien ça coûte ?'], ['È troppo caro', "C'est trop cher"], ['Posso pagare con la carta?', 'Je peux payer par carte ?'],
        ['Un chilo di pomodori', 'Un kilo de tomates'], ['Mezzo chilo di pane', 'Une demi-livre de pain'], ['Avete una taglia più grande?', 'Avez-vous une taille plus grande ?'],
        ['Lo prendo', 'Je le prends'], ['Solo guardo, grazie', 'Je regarde seulement, merci'], ['Lo scontrino, per favore', "Le ticket, s'il vous plaît"], ['È in saldo?', "C'est en solde ?"] ] },
      { id: 'it8', title: 'Le temps qu’il fait', emoji: '🌦️', items: [
        ['Che tempo fa?', 'Quel temps fait-il ?'], ['Fa caldo', 'Il fait chaud'], ['Fa freddo', 'Il fait froid'], ['Piove', 'Il pleut'],
        ['C’è il sole', 'Il y a du soleil'], ['Nevica', 'Il neige'], ['Tira vento', 'Il y a du vent'],
        ['Domani sarà bello', 'Demain il fera beau'], ['Prendi l’ombrello', 'Prends le parapluie'], ['Che bella giornata!', 'Quelle belle journée !'] ] },
      { id: 'it9', title: 'Urgences & santé', emoji: '🚑', items: [
        ['Aiuto!', 'Au secours !'], ['Chiami un medico', 'Appelez un médecin'], ['Mi sento male', 'Je me sens mal'], ['Ho mal di testa', "J'ai mal à la tête"],
        ['Ho la febbre', "J'ai de la fièvre"], ['Sono allergico', 'Je suis allergique'], ['Dov’è l’ospedale?', "Où est l'hôpital ?"],
        ['Ho perso il passaporto', "J'ai perdu mon passeport"], ['Chiami la polizia', 'Appelez la police'], ['Va tutto bene', 'Tout va bien'] ] },
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
      { id: 'es5', title: 'Les nombres', emoji: '🔢', items: [
        ['Uno, dos, tres', 'Un, deux, trois'], ['Cuatro, cinco, seis', 'Quatre, cinq, six'], ['Siete, ocho, nueve', 'Sept, huit, neuf'],
        ['Diez', 'Dix'], ['Veinte euros', 'Vingt euros'], ['Cien', 'Cent'], ['El primero', 'Le premier'],
        ['La mitad', 'La moitié'], ['Son las tres', 'Il est trois heures'], ['A las ocho y media', 'À huit heures et demie'] ] },
      { id: 'es6', title: 'La famille', emoji: '👨‍👩‍👧', items: [
        ['Mi madre', 'Ma mère'], ['Mi padre', 'Mon père'], ['Tengo un hermano', "J'ai un frère"], ['Tengo dos hermanas', "J'ai deux sœurs"],
        ['Mis abuelos', 'Mes grands-parents'], ['Mi marido', 'Mon mari'], ['Mi mujer', 'Ma femme'],
        ['Nuestros hijos', 'Nos enfants'], ['Estoy casado', 'Je suis marié'], ['Tengo un perro', "J'ai un chien"] ] },
      { id: 'es7', title: 'Les courses', emoji: '🛒', items: [
        ['¿Cuánto cuesta?', 'Combien ça coûte ?'], ['Es demasiado caro', "C'est trop cher"], ['¿Puedo pagar con tarjeta?', 'Je peux payer par carte ?'],
        ['Un kilo de tomates', 'Un kilo de tomates'], ['Medio kilo de pan', 'Une demi-livre de pain'], ['¿Tiene una talla más grande?', 'Avez-vous une taille plus grande ?'],
        ['Me lo llevo', 'Je le prends'], ['Solo estoy mirando, gracias', 'Je regarde seulement, merci'], ['El tique, por favor', "Le ticket, s'il vous plaît"], ['¿Está de rebajas?', "C'est en solde ?"] ] },
      { id: 'es8', title: 'Le temps qu’il fait', emoji: '🌦️', items: [
        ['¿Qué tiempo hace?', 'Quel temps fait-il ?'], ['Hace calor', 'Il fait chaud'], ['Hace frío', 'Il fait froid'], ['Llueve', 'Il pleut'],
        ['Hace sol', 'Il y a du soleil'], ['Nieva', 'Il neige'], ['Hace viento', 'Il y a du vent'],
        ['Mañana hará bueno', 'Demain il fera beau'], ['Coge el paraguas', 'Prends le parapluie'], ['¡Qué día tan bonito!', 'Quelle belle journée !'] ] },
      { id: 'es9', title: 'Urgences & santé', emoji: '🚑', items: [
        ['¡Socorro!', 'Au secours !'], ['Llame a un médico', 'Appelez un médecin'], ['Me encuentro mal', 'Je me sens mal'], ['Me duele la cabeza', "J'ai mal à la tête"],
        ['Tengo fiebre', "J'ai de la fièvre"], ['Soy alérgico', 'Je suis allergique'], ['¿Dónde está el hospital?', "Où est l'hôpital ?"],
        ['He perdido el pasaporte', "J'ai perdu mon passeport"], ['Llame a la policía', 'Appelez la police'], ['Todo está bien', 'Tout va bien'] ] },
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
      { id: 'lb5', title: 'Les nombres', emoji: '🔢', items: [
        ['Eent, zwee, dräi', 'Un, deux, trois'], ['Véier, fënnef, sechs', 'Quatre, cinq, six'], ['Siwen, aacht, néng', 'Sept, huit, neuf'],
        ['Zéng', 'Dix'], ['Zwanzeg Euro', 'Vingt euros'], ['Honnert', 'Cent'], ['Deen éischten', 'Le premier'],
        ['D’Hallschent', 'La moitié'], ['Et ass dräi Auer', 'Il est trois heures'], ['Um hallwer néng', 'À huit heures et demie'] ] },
      { id: 'lb6', title: 'La famille', emoji: '👨‍👩‍👧', items: [
        ['Meng Mamm', 'Ma mère'], ['Mäi Papp', 'Mon père'], ['Ech hunn e Brudder', "J'ai un frère"], ['Ech hunn zwou Schwësteren', "J'ai deux sœurs"],
        ['Meng Grousselteren', 'Mes grands-parents'], ['Mäi Mann', 'Mon mari'], ['Meng Fra', 'Ma femme'],
        ['Eis Kanner', 'Nos enfants'], ['Ech si bestuet', 'Je suis marié'], ['Ech hunn en Hond', "J'ai un chien"] ] },
      { id: 'lb7', title: 'Les courses', emoji: '🛒', items: [
        ['Wéi vill kascht dat?', 'Combien ça coûte ?'], ['Dat ass ze deier', "C'est trop cher"], ['Kann ech mat der Kaart bezuelen?', 'Je peux payer par carte ?'],
        ['E Kilo Tomaten', 'Un kilo de tomates'], ['En halleft Kilo Brout', 'Une demi-livre de pain'], ['Hutt Dir eng méi grouss Gréisst?', 'Avez-vous une taille plus grande ?'],
        ['Ech huelen et', 'Je le prends'], ['Ech kucken just, merci', 'Je regarde seulement, merci'], ['De Bong, wann ech gelift', "Le ticket, s'il vous plaît"], ['Ass dat am Solde?', "C'est en solde ?"] ] },
      { id: 'lb8', title: 'Le temps qu’il fait', emoji: '🌦️', items: [
        ['Wéi ass d’Wieder?', 'Quel temps fait-il ?'], ['Et ass waarm', 'Il fait chaud'], ['Et ass kal', 'Il fait froid'], ['Et reent', 'Il pleut'],
        ['D’Sonn schéngt', 'Il y a du soleil'], ['Et schneit', 'Il neige'], ['Et ass wandeg', 'Il y a du vent'],
        ['Muer gëtt et schéin', 'Demain il fera beau'], ['Huel de Prabbeli mat', 'Prends le parapluie'], ['Wat e schéinen Dag!', 'Quelle belle journée !'] ] },
      { id: 'lb9', title: 'Urgences & santé', emoji: '🚑', items: [
        ['Hëllef!', 'Au secours !'], ['Rufft en Dokter', 'Appelez un médecin'], ['Mir ass net gutt', 'Je me sens mal'], ['Ech hu Kappwéi', "J'ai mal à la tête"],
        ['Ech hu Féiwer', "J'ai de la fièvre"], ['Ech sinn allergesch', 'Je suis allergique'], ['Wou ass d’Spidol?', "Où est l'hôpital ?"],
        ['Ech hu mäi Pass verluer', "J'ai perdu mon passeport"], ['Rufft d’Police', 'Appelez la police'], ['Alles ass gutt', 'Tout va bien'] ] },
    ],
  },
};

// Scénarios de conversation pour le tuteur IA
export const SCENARIOS = [
  { id: 'cafe', emoji: '☕', title: 'Au café', brief: 'Tu entres dans un café. Le tuteur est le serveur : commande, demande l’addition.' },
  { id: 'gare', emoji: '🚆', title: 'À la gare', brief: 'Tu dois acheter un billet et trouver ton quai. Le tuteur est le guichetier.' },
  { id: 'rencontre', emoji: '🤝', title: 'Une rencontre', brief: 'Tu rencontres quelqu’un à une fête. Le tuteur est un invité curieux : présente-toi, pose des questions.' },
  { id: 'marche', emoji: '🥕', title: 'Au marché', brief: 'Tu fais tes courses. Le tuteur est le marchand : demande les prix, négocie un peu.' },
  { id: 'libre', emoji: '💬', title: 'Discussion libre', brief: 'Parle de ce que tu veux. Le tuteur suit la conversation et corrige en douceur.' },
];

// Normalisation : chaque item reçoit un id stable "unit:index"
for (const [code, L] of Object.entries(LANGS)) {
  L.code = code;
  for (const u of L.units) u.items = u.items.map(([t, f], i) => ({ id: `${u.id}:${i}`, t, f, unit: u.id }));
  L.items = L.units.flatMap((u) => u.items);
}

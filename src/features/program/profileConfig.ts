import type { Objective, ProfileConfig, Principle } from '../../types';

export const PROFILE_CONFIG: Record<Objective, ProfileConfig> = {
  muscle: {
    hero_title: `Construis<br>du <span class="italic">muscle</span><br>en <span class="accent">45 min</span>`,
    hero_sub: "Six séances par semaine. Split Push / Pull / Legs. Zéro matériel, zéro saut si tu veux. <em>Deux mois pour transformer ton corps.</em>",
    manifesto: `« Le muscle se construit en silence, rep après rep. <span class="highlight">Pas d'excuse.</span> Quarante-cinq minutes suffisent, si la surcharge progressive devient ta religion. »`,
    sessions: 6,
    phases: ['muscle_p1', 'muscle_p2'],
    p1_title: "Semaines 1 – 4 · Fondation",
    p1_sub: "Maîtrise des patterns moteurs. Volume progressif. Le corps apprend avant de forcer.",
    p2_title: "Semaines 5 – 8 · Intensité",
    p2_sub: "Variantes avancées. Surcharge via leviers et tempo. Le muscle n'a plus le choix.",
  },
  fat: {
    hero_title: `Brûle<br>du <span class="italic">gras</span><br>en <span class="accent">45 min</span>`,
    hero_sub: "Cinq séances par semaine en circuits denses. Haute dépense calorique, sollicitation musculaire continue. <em>Deux mois pour une transformation visible.</em>",
    manifesto: `« Tu ne perds pas du gras en t'affamant. <span class="highlight">Tu le brûles en bougeant.</span> Chaque séance est un feu qui consume — le plan t'apporte le bois. »`,
    sessions: 5,
    phases: ['fat_p1', 'fat_p2'],
    p1_title: "Semaines 1 – 4 · Activation",
    p1_sub: "Construction du moteur cardio-musculaire. Habitude ancrée.",
    p2_title: "Semaines 5 – 8 · Combustion",
    p2_sub: "Densité augmentée, temps de repos réduit. La machine tourne à plein régime.",
  },
  endurance: {
    hero_title: `Bâtis<br>ton <span class="italic">endurance</span><br>en <span class="accent">45 min</span>`,
    hero_sub: "Six séances par semaine. Circuits longs, transitions courtes, capacité aérobie et musculaire. <em>Deux mois pour tenir sans faiblir.</em>",
    manifesto: `« L'endurance n'est pas un don — <span class="highlight">c'est une habitude.</span> Chaque matin, tu repousses la frontière de la fatigue d'une minute. »`,
    sessions: 6,
    phases: ['end_p1', 'end_p2'],
    p1_title: "Semaines 1 – 4 · Capacité",
    p1_sub: "Volume constant, tempo régulier. Le cœur s'habitue.",
    p2_title: "Semaines 5 – 8 · Résistance",
    p2_sub: "Séries plus longues, intensité variable. Tu tiens sur la durée.",
  },
  balance: {
    hero_title: `Trouve<br>ton <span class="italic">équilibre</span><br>en <span class="accent">45 min</span>`,
    hero_sub: "Cinq séances par semaine. Force, cardio, mobilité — tout dose proprement. <em>Deux mois pour te sentir mieux dans ton corps.</em>",
    manifesto: `« Ni bodybuilder, ni marathonien : juste <span class="highlight">en pleine forme.</span> Un corps qui répond, qui dure, qui te laisse vivre. C'est ça, la vraie performance. »`,
    sessions: 5,
    phases: ['bal_p1', 'bal_p2'],
    p1_title: "Semaines 1 – 4 · Retour en forme",
    p1_sub: "Réveil musculaire complet. Chaque zone activée.",
    p2_title: "Semaines 5 – 8 · Consolidation",
    p2_sub: "Intensité dosée, régularité clé. Habitudes ancrées.",
  },
};

export function buildPrinciples(objective: Objective): Principle[] {
  const base: Principle[] = [
    {
      n: "PRINCIPE 01",
      title: `Surcharge <span class="italic">progressive</span>`,
      text: `Chaque semaine, ajoute <strong>1 répétition</strong> par série ou <strong>1 série</strong> sur au moins un exercice. C'est ton seul vrai moteur.`,
    },
    {
      n: "PRINCIPE 02",
      title: `Sommeil <span class="italic">sacré</span>`,
      text: `La récupération se fait la nuit. <strong>7 à 8 heures</strong>, non-négociable. Sans sommeil, aucun résultat.`,
    },
  ];

  if (objective === 'muscle') {
    return [...base,
      { n: "PRINCIPE 03", title: `Protéines<br><span class="italic">d'abord</span>`,
        text: `Vise <strong>1,8 à 2 g / kg</strong> par jour. Œufs, fromage blanc, thon, poulet. Sans ça, l'entraînement ne devient pas du muscle.` },
      { n: "PRINCIPE 04", title: `Tempo <span class="italic">lent</span>`,
        text: `Tempo <strong>2-0-1</strong> : deux secondes de descente, une de remontée. La tension mécanique stimule la croissance.` },
    ];
  }
  if (objective === 'fat') {
    return [...base,
      { n: "PRINCIPE 03", title: `Déficit <span class="italic">maîtrisé</span>`,
        text: `Vise <strong>-300 à -500 kcal</strong> par jour. Pas plus. Un déficit trop agressif brûle aussi du muscle.` },
      { n: "PRINCIPE 04", title: `Protéines <span class="italic">hautes</span>`,
        text: `<strong>2 à 2,2 g / kg</strong> par jour. Protège la masse musculaire pendant la perte de gras. Effet satiétogène.` },
    ];
  }
  if (objective === 'endurance') {
    return [...base,
      { n: "PRINCIPE 03", title: `Hydratation<br><span class="italic">constante</span>`,
        text: `<strong>35 ml / kg / jour</strong> minimum. Plus si tu transpires. L'endurance chute dès -2% du poids en eau perdue.` },
      { n: "PRINCIPE 04", title: `Respiration <span class="italic">nasale</span>`,
        text: `Inspire et expire par le nez autant que possible. Améliore l'oxygénation, régule l'intensité.` },
    ];
  }
  return [...base,
    { n: "PRINCIPE 03", title: `Alimentation <span class="italic">équilibrée</span>`,
      text: `Protéines à chaque repas (<strong>1,5 g / kg</strong>), glucides autour des entraînements, légumes à volonté.` },
    { n: "PRINCIPE 04", title: `Mobilité <span class="italic">quotidienne</span>`,
      text: `<strong>5 minutes par jour</strong> d'étirements ou chat-vache. Un corps mobile est un corps qui dure.` },
  ];
}
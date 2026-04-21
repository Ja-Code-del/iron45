import type { Exercise } from '../types';

export const EXERCISES: Record<string, Exercise> = {
  // PUSH
  pushup_wide: { name: 'Pompes larges', muscle: 'Pectoraux', icon: 'pushup', cue: "Mains légèrement plus larges que les épaules. Gaine complètement le tronc, descends poitrine à 5 cm du sol." },
  pushup_diamond: { name: 'Pompes serrées', muscle: 'Triceps', icon: 'pushup_narrow', cue: "Mains sous les épaules, coudes collés au corps. Travail principal sur les triceps." },
  pushup_incline: { name: 'Pompes inclinées', muscle: 'Haut pectoraux', icon: 'pushup_incline', cue: "Pieds surélevés sur une chaise ou un lit. Active le haut des pectoraux." },
  pushup_knee: { name: 'Pompes sur genoux', muscle: 'Pectoraux', icon: 'pushup', cue: "Genoux au sol, ligne genoux-épaules parfaite. Parfait pour construire la base." },
  dips_chair: { name: 'Dips sur chaise', muscle: 'Triceps · Pectoraux', icon: 'dips', cue: "Mains sur le rebord d'une chaise stable, pieds tendus. Descends jusqu'à 90° aux coudes." },
  pike: { name: 'Pike push-ups', muscle: 'Épaules', icon: 'pike', cue: "Position chien tête en bas, descends la tête vers le sol. Substitut du développé militaire." },
  plank: { name: 'Gainage planche', muscle: 'Core', icon: 'plank', cue: "Ligne parfaite des chevilles à la tête. Serre fessiers et abdos, ne creuse pas." },
  pushup_archer: { name: 'Pompes archer', muscle: 'Pectoraux unilatéral', icon: 'archer', cue: "Un bras tendu sur le côté, descends sur le bras fléchi. Surcharge unilatérale." },
  pushup_decline_pause: { name: 'Pompes declined + pause', muscle: 'Haut pectoraux', icon: 'pushup_incline', cue: "Pieds surélevés, pause 2 secondes en position basse. Tension maximale." },
  hspu: { name: 'Handstand push-up', muscle: 'Épaules', icon: 'hspu', cue: "Contre un mur, descends la tête vers le sol. Substitue par pike pieds sur chaise si trop dur." },
  dips_slow: { name: 'Dips sur chaise lents', muscle: 'Triceps', icon: 'dips', cue: "3 secondes descente, 1 seconde montée. La lenteur crée la surcharge." },
  planche_pu: { name: 'Pseudo planche push-up', muscle: 'Pectoraux · Épaules', icon: 'planche', cue: "Mains vers la taille, pointes des doigts vers l'arrière. Corps incliné vers l'avant." },
  shoulder_tap: { name: 'Planche + shoulder tap', muscle: 'Core · Épaules', icon: 'shoulder_tap', cue: "En planche, touche l'épaule opposée. Les hanches ne bougent pas." },

  // PULL
  superman: { name: 'Superman', muscle: 'Érecteurs', icon: 'superman', cue: "Face au sol, lève bras et jambes simultanément. Tiens 1 sec en haut." },
  rows_table: { name: 'Table rows', muscle: 'Dos', icon: 'rows', cue: "Sous une table solide, tire-toi jusqu'à ce que la poitrine touche. Corps gainé." },
  curl_wall: { name: 'Curl biceps mural', muscle: 'Biceps', icon: 'curl_wall', cue: "Bras fléchi à 90°, pousse le dos de la main contre le mur. Isométrie maximale." },
  hypers: { name: 'Reverse hypers', muscle: 'Fessiers · Lombaires', icon: 'hypers', cue: "Face au sol, lève les jambes tendues le plus haut possible. Contrôle la descente." },
  bridge: { name: 'Glute bridge', muscle: 'Fessiers', icon: 'bridge', cue: "Pieds au sol près des fesses. Pousse le bassin vers le haut, serre les fessiers." },
  deadbug: { name: 'Dead bug', muscle: 'Core profond', icon: 'deadbug', cue: "Sur le dos, bras vers le plafond. Descends bras et jambe opposés, sans creuser." },
  australian: { name: 'Australian pull-up', muscle: 'Dos', icon: 'australian', cue: "Sous une table stable, tire-toi jusqu'à la poitrine. La meilleure approximation du tirage." },
  superman_hold: { name: 'Superman + hold 3 sec', muscle: 'Chaîne postérieure', icon: 'superman', cue: "Tiens la position haute 3 secondes à chaque répétition." },
  nordic: { name: 'Nordic curl négatif', muscle: 'Ischio-jambiers', icon: 'nordic', cue: "À genoux, chevilles fixées. Descends lentement en freinant, remonte avec les mains." },
  bridge_single: { name: 'Glute bridge unilatéral', muscle: 'Fessiers', icon: 'bridge', cue: "Une jambe tendue vers le plafond, pousse avec l'autre talon. Surcharge unilatérale." },
  facepull: { name: 'Face pulls simulés', muscle: 'Épaules postérieures', icon: 'facepull', cue: "Mouvement à vide, accent sur la contraction des rhomboïdes et deltoïdes arrière." },
  hollow: { name: 'Hollow body hold', muscle: 'Core antérieur', icon: 'hollow', cue: "Dos collé au sol, bras et jambes tendus hors du sol. Reste plat." },
  bird_dog: { name: 'Bird-dog', muscle: 'Core · Dos', icon: 'bird_dog', cue: "À quatre pattes, tends bras et jambe opposés. Reste parfaitement stable." },

  // LEGS
  bulgarian: { name: 'Squat bulgare', muscle: 'Quadriceps', icon: 'bulgarian', cue: "Pied arrière sur une chaise, genou avant aligné avec les orteils. Cuisse parallèle au sol." },
  lunge: { name: 'Fentes avant', muscle: 'Quadriceps · Fessiers', icon: 'lunge', cue: "Grand pas en avant, genou arrière presque au sol. Pousse sur le talon avant." },
  hipthrust: { name: 'Hip thrust au sol', muscle: 'Fessiers', icon: 'hipthrust', cue: "Haut du dos contre le canapé, pieds au sol. Serre les fessiers 1 sec en haut." },
  sissy: { name: 'Sissy squat', muscle: 'Quadriceps', icon: 'sissy', cue: "Accroche-toi à une porte, penche-toi en arrière en pliant les genoux. Étire les quadriceps." },
  calves: { name: 'Mollets debout', muscle: 'Mollets', icon: 'calves', cue: "Sur une marche, talons dans le vide. Monte lentement, descends sous la marche." },
  sideplank: { name: 'Gainage latéral', muscle: 'Obliques', icon: 'sideplank', cue: "Sur le coude, corps aligné. Le bassin ne s'affaisse pas. Respire calmement." },
  pistol: { name: 'Pistol squat assisté', muscle: 'Quadriceps unilatéral', icon: 'pistol', cue: "Tiens une porte, descends sur une jambe. La progression ultime sans matériel." },
  lunge_walk: { name: 'Fente marchée', muscle: 'Quadriceps · Fessiers', icon: 'lunge', cue: "Dans un couloir, enchaîne les fentes vers l'avant. Tempo contrôlé, pas d'élan." },
  hipthrust_single: { name: 'Hip thrust unilatéral', muscle: 'Fessiers', icon: 'hipthrust', cue: "Une jambe au sol, l'autre tendue. Double la charge sur un seul côté." },
  wallsit: { name: 'Wall sit', muscle: 'Quadriceps isométrique', icon: 'wallsit', cue: "Dos au mur, cuisses parallèles au sol. Brûlure garantie. Respire calmement." },
  calves_single: { name: 'Mollets unilatéraux', muscle: 'Mollets', icon: 'calves', cue: "Sur une seule jambe, tempo 3-3. Charge doublée par rapport aux deux pieds." },
  side_dyn: { name: 'Gainage latéral dynamique', muscle: 'Obliques', icon: 'side_dyn', cue: "Monte et descends le bassin depuis la planche latérale. Contrôle total." },
  squat_body: { name: 'Squat au poids du corps', muscle: 'Quadriceps · Fessiers', icon: 'squat', cue: "Pieds écartés largeur d'épaules, descends jusqu'à la cuisse parallèle. Genoux alignés." },

  // CARDIO
  mountain_climb: { name: 'Mountain climbers', muscle: 'Cardio · Core', icon: 'mountain_climb', cue: "En planche, ramène les genoux en alternance vers la poitrine. Rapide mais silencieux." },
  burpee_low: { name: 'Burpee sans saut', muscle: 'Full body', icon: 'burpee_low', cue: "Descends en planche, remonte debout. Sans le saut final pour rester silencieux." },
  jack_silent: { name: 'Jumping jacks silencieux', muscle: 'Cardio', icon: 'jack_silent', cue: "Bras et jambes écartés en alternance, sans quitter le sol. Mouvement glissé." },
  high_knee: { name: 'Montées de genoux', muscle: 'Cardio', icon: 'high_knee', cue: "Montée alternée des genoux, sur place. Tempo rapide mais pose douce." },
  shadow_punch: { name: 'Shadow boxing', muscle: 'Cardio · Épaules', icon: 'shadow_punch', cue: "Enchaîne jabs et directs, ciblage mental. 30 sec par main." },
  cat_cow: { name: 'Chat-vache', muscle: 'Mobilité dos', icon: 'cat_cow', cue: "À quatre pattes, alterne dos rond et dos creux. Fluide, respire avec le mouvement." },
};
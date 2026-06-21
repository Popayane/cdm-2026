// Base de connaissances véhicules (démo).
// En production ces données proviendraient de la table `vehicles_catalog` Supabase
// ou d'une API tierce de fiabilité automobile.

export const VEHICLES = [
  {
    marque: 'Renault',
    modele: 'Clio IV',
    annees: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'],
    motorisations: ['0.9 TCe 90', '1.2 16V 75', '1.5 dCi 90', '1.5 dCi 110'],
    fiabilite: 7.2,
    entretienAnnuel: 620,
    defauts: [
      'Capteur de pression de carburant défaillant (1.5 dCi)',
      'Usure prématurée de l’embrayage en ville',
      'Problèmes électroniques du système multimédia R-Link',
    ],
    pannesMajeures: [
      'Casse de la pompe à injection sur dCi mal entretenus',
      'Vanne EGR encrassée provoquant des à-coups',
    ],
    conseils: [
      'Vérifier l’historique d’entretien de la distribution.',
      'Privilégier le 0.9 TCe pour un usage urbain.',
      'Contrôler l’état de l’embrayage à l’essai.',
    ],
  },
  {
    marque: 'Peugeot',
    modele: '308 II',
    annees: ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'],
    motorisations: ['1.2 PureTech 110', '1.2 PureTech 130', '1.6 BlueHDi 100', '1.6 BlueHDi 120', '2.0 BlueHDi 150'],
    fiabilite: 6.8,
    entretienAnnuel: 700,
    defauts: [
      'Courroie de distribution PureTech qui se délite (huile)',
      'Filtre à particules (FAP) qui se colmate sur petits trajets',
      'Consommation d’huile élevée sur certains PureTech',
    ],
    pannesMajeures: [
      'Casse moteur PureTech liée à la courroie immergée',
      'Injecteurs BlueHDi à remplacer',
    ],
    conseils: [
      'Sur PureTech, faire contrôler la courroie de distribution sans tarder.',
      'Éviter le diesel pour de courts trajets urbains.',
      'Surveiller le niveau d’huile entre les vidanges.',
    ],
  },
  {
    marque: 'Volkswagen',
    modele: 'Golf VII',
    annees: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'],
    motorisations: ['1.0 TSI 110', '1.4 TSI 125', '1.5 TSI 150', '1.6 TDI 115', '2.0 TDI 150'],
    fiabilite: 8.1,
    entretienAnnuel: 780,
    defauts: [
      'Boîte DSG7 à-coups à basse vitesse',
      'Bobines d’allumage TSI à remplacer',
      'Pompe à eau électrique fragile',
    ],
    pannesMajeures: [
      'Défaillance mécatronique de la boîte DSG',
      'Volant moteur bi-masse sur TDI',
    ],
    conseils: [
      'Faire vidanger l’huile de la DSG tous les 60 000 km.',
      'Vérifier les mises à jour logicielles moteur.',
      'Excellent choix sur autoroute en TDI.',
    ],
  },
  {
    marque: 'Citroën',
    modele: 'C3 III',
    annees: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
    motorisations: ['1.2 PureTech 82', '1.2 PureTech 110', '1.5 BlueHDi 100'],
    fiabilite: 6.9,
    entretienAnnuel: 580,
    defauts: [
      'Courroie de distribution PureTech (huile)',
      'Bruits de suspension avant',
      'Écran tactile qui fige',
    ],
    pannesMajeures: [
      'Casse moteur 1.2 PureTech sur entretien négligé',
    ],
    conseils: [
      'Contrôle impératif de la courroie de distribution.',
      'Idéale en ville, confort de suspension réputé.',
    ],
  },
  {
    marque: 'Toyota',
    modele: 'Yaris IV',
    annees: ['2020', '2021', '2022', '2023', '2024'],
    motorisations: ['1.0 VVT-i 72', '1.5 VVT-i 125', '1.5 Hybride 116'],
    fiabilite: 9.0,
    entretienAnnuel: 480,
    defauts: [
      'Bruits de plastiques intérieurs',
      'Capacité de coffre limitée',
    ],
    pannesMajeures: [
      'Très peu de pannes majeures recensées',
    ],
    conseils: [
      'La version hybride est la plus fiable et économique.',
      'Garantie constructeur étendue jusqu’à 10 ans (conditions).',
    ],
  },
  {
    marque: 'BMW',
    modele: 'Série 3 (F30)',
    annees: ['2012', '2013', '2014', '2015', '2016', '2017', '2018'],
    motorisations: ['320i 184', '320d 184', '330d 258', '335i 306'],
    fiabilite: 7.6,
    entretienAnnuel: 1100,
    defauts: [
      'Chaîne de distribution N47 (diesels anciens)',
      'Fuites de la pompe à eau électrique',
      'Vanne EGR et FAP sur diesels',
    ],
    pannesMajeures: [
      'Casse chaîne de distribution moteur N47',
      'Turbo sur 335i fortement sollicités',
    ],
    conseils: [
      'Privilégier les moteurs B47/B48 (après 2015).',
      'Entretien plus coûteux : prévoir le budget.',
    ],
  },
]

export const MARQUES = [...new Set(VEHICLES.map((v) => v.marque))].sort()

export function modelesFor(marque) {
  return VEHICLES.filter((v) => v.marque === marque).map((v) => v.modele)
}

export function findVehicleSpec(marque, modele) {
  return VEHICLES.find((v) => v.marque === marque && v.modele === modele) || null
}

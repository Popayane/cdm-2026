// Moteur de diagnostic.
// - Si VITE_OPENAI_API_KEY est défini -> appel réel à l'API OpenAI.
// - Sinon -> moteur local à base de règles (mode démo), entièrement fonctionnel.

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY
export const isOpenAIConfigured = Boolean(OPENAI_KEY)

const GRAVITE = { FAIBLE: 'Faible', MOYENNE: 'Moyenne', ELEVEE: 'Élevée' }

// Base de règles : mots-clés -> diagnostic.
const RULES = [
  {
    keywords: ['perd de la puissance', 'perte de puissance', 'mode dégradé', 'voyant moteur', 'cale', 'à-coups', 'a-coups'],
    causes: [
      { cause: 'Vanne EGR ou turbo encrassé', confiance: 72 },
      { cause: 'Capteur de débit d’air (débitmètre) défaillant', confiance: 61 },
      { cause: 'Filtre à particules (FAP) colmaté', confiance: 48 },
    ],
    gravite: GRAVITE.MOYENNE,
    prixMin: 150,
    prixMax: 900,
    verifs: [
      'Lire les codes défaut avec une valise OBD2.',
      'Vérifier l’encrassement de la vanne EGR.',
      'Contrôler la pression de suralimentation du turbo.',
    ],
  },
  {
    keywords: ['frein', 'freinage', 'pédale', 'pedale molle', 'grince', 'sifflement au freinage', 'voyant abs'],
    causes: [
      { cause: 'Plaquettes de frein usées', confiance: 80 },
      { cause: 'Disques de frein voilés ou usés', confiance: 58 },
      { cause: 'Capteur ABS défectueux', confiance: 40 },
    ],
    gravite: GRAVITE.ELEVEE,
    prixMin: 80,
    prixMax: 600,
    verifs: [
      'Contrôler l’épaisseur des plaquettes et disques.',
      'Vérifier le niveau de liquide de frein.',
      'Diagnostiquer les capteurs ABS si le voyant est allumé.',
    ],
  },
  {
    keywords: ['surchauffe', 'température', 'temperature', 'liquide de refroidissement', 'fume blanche', 'fumée blanche', 'radiateur'],
    causes: [
      { cause: 'Fuite du circuit de refroidissement', confiance: 70 },
      { cause: 'Thermostat bloqué', confiance: 55 },
      { cause: 'Joint de culasse défaillant', confiance: 38 },
    ],
    gravite: GRAVITE.ELEVEE,
    prixMin: 120,
    prixMax: 1800,
    verifs: [
      'Vérifier le niveau et les fuites de liquide de refroidissement.',
      'Tester le fonctionnement du ventilateur et du thermostat.',
      'Rechercher une émulsion d’huile (joint de culasse).',
    ],
  },
  {
    keywords: ['démarre', 'demarre', 'démarrage', 'ne démarre pas', 'batterie', 'démarreur', 'clic', 'voyant batterie'],
    causes: [
      { cause: 'Batterie déchargée ou en fin de vie', confiance: 76 },
      { cause: 'Alternateur défaillant', confiance: 52 },
      { cause: 'Démarreur défectueux', confiance: 44 },
    ],
    gravite: GRAVITE.MOYENNE,
    prixMin: 100,
    prixMax: 550,
    verifs: [
      'Tester la tension de la batterie (≈12,6 V à l’arrêt).',
      'Vérifier la charge de l’alternateur (≈14 V moteur tournant).',
      'Contrôler l’état des cosses et de la masse.',
    ],
  },
  {
    keywords: ['bruit', 'claquement', 'cognement', 'grincement', 'roulement', 'sifflement', 'vibration'],
    causes: [
      { cause: 'Roulement de roue usé', confiance: 64 },
      { cause: 'Rotule ou silentbloc de suspension', confiance: 57 },
      { cause: 'Cardan / transmission', confiance: 41 },
    ],
    gravite: GRAVITE.MOYENNE,
    prixMin: 90,
    prixMax: 700,
    verifs: [
      'Localiser le bruit (vitesse, virage, freinage).',
      'Contrôler les roulements et la liaison au sol.',
      'Vérifier les soufflets de cardan.',
    ],
  },
  {
    keywords: ['huile', 'fuite d’huile', 'fuite huile', 'voyant huile', 'pression d’huile', 'consomme de l’huile'],
    causes: [
      { cause: 'Fuite par un joint (carter, cache-culbuteurs)', confiance: 66 },
      { cause: 'Capteur de pression d’huile défaillant', confiance: 49 },
      { cause: 'Consommation d’huile élevée (segmentation)', confiance: 39 },
    ],
    gravite: GRAVITE.ELEVEE,
    prixMin: 60,
    prixMax: 1500,
    verifs: [
      'Vérifier le niveau d’huile immédiatement.',
      'Localiser la fuite sous le moteur.',
      'Ne pas rouler si le voyant de pression d’huile est rouge.',
    ],
  },
  {
    keywords: ['climatisation', 'clim', 'ne refroidit', 'air chaud', 'chauffage'],
    causes: [
      { cause: 'Manque de gaz réfrigérant', confiance: 71 },
      { cause: 'Compresseur de climatisation HS', confiance: 46 },
      { cause: 'Filtre d’habitacle encrassé', confiance: 35 },
    ],
    gravite: GRAVITE.FAIBLE,
    prixMin: 50,
    prixMax: 900,
    verifs: [
      'Faire contrôler la charge de gaz et l’étanchéité.',
      'Vérifier l’embrayage du compresseur.',
      'Remplacer le filtre d’habitacle.',
    ],
  },
]

const FALLBACK = {
  causes: [
    { cause: 'Anomalie détectée par un capteur — diagnostic électronique requis', confiance: 50 },
    { cause: 'Usure d’une pièce mécanique liée au kilométrage', confiance: 40 },
    { cause: 'Problème électrique ou de connectique', confiance: 30 },
  ],
  gravite: GRAVITE.MOYENNE,
  prixMin: 80,
  prixMax: 800,
  verifs: [
    'Effectuer une lecture des codes défaut (OBD2).',
    'Décrire précisément les conditions d’apparition du symptôme.',
    'Consulter un professionnel pour un diagnostic approfondi.',
  ],
}

function normalize(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

function localDiagnose(symptome, vehicle) {
  const text = normalize(symptome)
  let best = null
  let bestScore = 0
  for (const rule of RULES) {
    const score = rule.keywords.reduce(
      (acc, kw) => (text.includes(normalize(kw)) ? acc + 1 : acc),
      0
    )
    if (score > bestScore) {
      bestScore = score
      best = rule
    }
  }
  const match = best && bestScore > 0 ? best : FALLBACK
  const vlabel = vehicle ? `${vehicle.marque} ${vehicle.modele}` : 'votre véhicule'
  return {
    resume: `Analyse du symptôme pour ${vlabel}. ${
      bestScore > 0
        ? 'Plusieurs causes probables ont été identifiées.'
        : 'Symptôme peu spécifique : un diagnostic électronique est conseillé.'
    }`,
    causes: match.causes,
    gravite: match.gravite,
    estimation: { min: match.prixMin, max: match.prixMax, devise: '€' },
    verifications: match.verifs,
    moteur: 'local',
  }
}

async function openaiDiagnose(symptome, vehicle) {
  const vlabel = vehicle
    ? `${vehicle.marque} ${vehicle.modele} ${vehicle.annee || ''} ${vehicle.motorisation || ''}`.trim()
    : 'véhicule non précisé'

  const sys =
    'Tu es un mécanicien expert automobile. Réponds STRICTEMENT en JSON valide, en français, ' +
    'avec ce schéma: {"resume": string, "causes": [{"cause": string, "confiance": number}], ' +
    '"gravite": "Faible"|"Moyenne"|"Élevée", "estimation": {"min": number, "max": number, "devise": "€"}, ' +
    '"verifications": [string]}. 3 causes max, confiance entre 0 et 100.'

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: sys },
        {
          role: 'user',
          content: `Véhicule: ${vlabel}.\nSymptôme décrit par le client: "${symptome}".`,
        },
      ],
    }),
  })

  if (!res.ok) throw new Error(`OpenAI ${res.status}`)
  const data = await res.json()
  const parsed = JSON.parse(data.choices[0].message.content)
  return { ...parsed, moteur: 'openai' }
}

export async function diagnose(symptome, vehicle) {
  if (isOpenAIConfigured) {
    try {
      return await openaiDiagnose(symptome, vehicle)
    } catch (e) {
      // En cas d'échec réseau/quota, on bascule sur le moteur local.
      console.warn('OpenAI indisponible, bascule sur le moteur local :', e.message)
    }
  }
  // Petit délai pour simuler le traitement (UX).
  await new Promise((r) => setTimeout(r, 650))
  return localDiagnose(symptome, vehicle)
}

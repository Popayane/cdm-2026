# 🔧 AutoDiag AI

Application web responsive de **diagnostic automobile assisté par IA**.
Recherchez les défauts connus d'un véhicule, décrivez une panne et obtenez les
causes probables, le niveau de gravité et une estimation du coût des réparations.

> Design moderne « automobile premium » : fond sombre, bleu électrique, cartes
> arrondies, icônes mécaniques et animations fluides. Optimisé mobile.

## ✨ Fonctionnalités

- **Accueil** : recherche rapide, accès véhicule/diagnostic, derniers véhicules consultés.
- **Module véhicule** : marque → modèle → année → motorisation, avec note de
  fiabilité /10, défauts fréquents, pannes majeures, coût d'entretien et conseils.
- **Diagnostic IA** : description en langage naturel → causes probables avec
  niveau de confiance, gravité (Faible/Moyenne/Élevée), fourchette de prix et
  vérifications recommandées.
- **Historique** : chaque diagnostic est sauvegardé (date, véhicule, symptôme, réponse IA).
- **Tableau de bord** : nombre de diagnostics, véhicules enregistrés, dernières recherches.
- **Authentification** : Google + Email (Supabase).
- **Quotas** : 3 diagnostics gratuits pour les visiteurs, illimités une fois connecté.

## 🧱 Stack technique

- **Frontend** : React 18 + Vite + Tailwind CSS + React Router
- **Backend / Auth / DB** : Supabase
- **IA** : API OpenAI (`gpt-4o-mini`)

## 🚀 Démarrage

```bash
cd autodiag-ai
npm install
npm run dev
```

L'application démarre sur http://localhost:5173

### Mode démo (par défaut)

Sans clés d'environnement, l'app fonctionne **immédiatement** :
- L'authentification est simulée (localStorage).
- Les véhicules et diagnostics sont persistés dans le navigateur.
- Le diagnostic utilise un **moteur local à base de règles** (français).

### Mode production (Supabase + OpenAI)

1. Copiez `.env.example` en `.env` et renseignez vos clés :

   ```env
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_OPENAI_API_KEY=...
   ```

2. Dans Supabase, exécutez [`supabase/schema.sql`](supabase/schema.sql) (tables
   `vehicles` et `diagnostics` + Row Level Security). La table `users` est gérée
   nativement par Supabase (`auth.users`).

3. Activez les providers **Email** et **Google** dans
   *Authentication → Providers* de votre projet Supabase.

L'app bascule automatiquement sur les vrais services dès que les variables sont présentes.

> ⚠️ **Sécurité** : exposer une clé OpenAI côté navigateur convient pour une démo,
> mais en production il faut proxifier l'appel via une **Edge Function Supabase**
> ou un backend, afin de ne jamais exposer la clé.

## 🗂️ Structure

```
autodiag-ai/
├── src/
│   ├── components/   # Layout, icônes, affichage du résultat
│   ├── context/      # AuthContext (Supabase / démo)
│   ├── data/         # Base de connaissances véhicules
│   ├── lib/          # supabaseClient, db (persistance), ai (moteur diagnostic)
│   └── pages/        # Home, Vehicles, Diagnostic, History, Dashboard, Login
├── supabase/schema.sql
└── .env.example
```

## ⚖️ Avertissement

Les diagnostics fournis sont **indicatifs** et ne remplacent pas l'avis d'un
professionnel qualifié.

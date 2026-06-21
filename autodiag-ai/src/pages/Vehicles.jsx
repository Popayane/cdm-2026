import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { MARQUES, modelesFor, findVehicleSpec } from '../data/vehicles'
import { pushRecent, addVehicle } from '../lib/db'
import { useAuth } from '../context/AuthContext'
import { IconCar, IconStar, IconCheck, IconScan } from '../components/Icons'

function FiabilityGauge({ note }) {
  const pct = (note / 10) * 100
  const color = note >= 8 ? 'text-emerald-400' : note >= 6.5 ? 'text-amber-400' : 'text-red-400'
  return (
    <div className="flex items-center gap-4">
      <div className={`relative grid h-20 w-20 place-items-center rounded-full ${color}`}
        style={{ background: `conic-gradient(currentColor ${pct}%, rgba(255,255,255,.08) 0)` }}>
        <div className="grid h-16 w-16 place-items-center rounded-full bg-ink-800">
          <span className="text-xl font-extrabold text-slate-100">{note}</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-400">Note de fiabilité</p>
        <p className="text-lg font-bold">{note} / 10</p>
      </div>
    </div>
  )
}

export default function Vehicles() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [marque, setMarque] = useState('')
  const [modele, setModele] = useState('')
  const [annee, setAnnee] = useState('')
  const [motorisation, setMotorisation] = useState('')
  const [saved, setSaved] = useState(false)

  // Pré-remplissage depuis la recherche rapide de l'accueil.
  useEffect(() => {
    const q = (params.get('q') || '').toLowerCase()
    if (!q) return
    const hit = MARQUES.find((m) => q.includes(m.toLowerCase()))
    if (hit) setMarque(hit)
  }, [params])

  const modeles = useMemo(() => (marque ? modelesFor(marque) : []), [marque])
  const spec = useMemo(() => findVehicleSpec(marque, modele), [marque, modele])

  useEffect(() => {
    setModele('')
    setAnnee('')
    setMotorisation('')
  }, [marque])

  useEffect(() => {
    if (spec) pushRecent(`${spec.marque} ${spec.modele}`)
    setSaved(false)
  }, [spec])

  async function save() {
    await addVehicle(user?.id, { marque, modele, annee, motorisation })
    setSaved(true)
  }

  function diagnose() {
    const label = `${marque} ${modele} ${annee} ${motorisation}`.trim()
    navigate(`/diagnostic?vehicule=${encodeURIComponent(label)}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Rechercher un véhicule</h1>
        <p className="text-sm text-slate-400">Sélectionnez votre véhicule pour consulter sa fiabilité et ses défauts connus.</p>
      </div>

      {/* Sélecteurs */}
      <div className="card grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="label">Marque</label>
          <select className="input" value={marque} onChange={(e) => setMarque(e.target.value)}>
            <option value="">— Choisir —</option>
            {MARQUES.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Modèle</label>
          <select className="input" value={modele} onChange={(e) => setModele(e.target.value)} disabled={!marque}>
            <option value="">— Choisir —</option>
            {modeles.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Année</label>
          <select className="input" value={annee} onChange={(e) => setAnnee(e.target.value)} disabled={!spec}>
            <option value="">— Choisir —</option>
            {spec?.annees.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Motorisation</label>
          <select className="input" value={motorisation} onChange={(e) => setMotorisation(e.target.value)} disabled={!spec}>
            <option value="">— Choisir —</option>
            {spec?.motorisations.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Résultats */}
      {spec ? (
        <div className="space-y-4 animate-fade-up">
          <div className="card flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-electric-500/15 text-2xl text-electric-400">
                <IconCar />
              </span>
              <div>
                <h2 className="text-xl font-bold">{spec.marque} {spec.modele}</h2>
                <p className="text-sm text-slate-400">
                  {annee || spec.annees[0]} · {motorisation || spec.motorisations[0]}
                </p>
              </div>
            </div>
            <FiabilityGauge note={spec.fiabilite} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card">
              <h3 className="mb-2 font-bold text-amber-300">⚠️ Défauts fréquents</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {spec.defauts.map((d, i) => <li key={i} className="flex gap-2">• <span>{d}</span></li>)}
              </ul>
            </div>
            <div className="card">
              <h3 className="mb-2 font-bold text-red-300">🔧 Pannes majeures</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {spec.pannesMajeures.map((d, i) => <li key={i} className="flex gap-2">• <span>{d}</span></li>)}
              </ul>
            </div>
            <div className="card">
              <h3 className="mb-2 font-bold text-electric-300">💶 Coût moyen d’entretien</h3>
              <p className="text-2xl font-extrabold">{spec.entretienAnnuel} € <span className="text-sm font-normal text-slate-400">/ an</span></p>
            </div>
            <div className="card">
              <h3 className="mb-2 flex items-center gap-2 font-bold text-emerald-300"><IconStar /> Conseils avant achat</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {spec.conseils.map((d, i) => (
                  <li key={i} className="flex items-start gap-2"><IconCheck className="mt-0.5 shrink-0 text-emerald-400" /><span>{d}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={diagnose} className="btn-primary"><IconScan /> Diagnostiquer ce véhicule</button>
            {user && (
              <button onClick={save} disabled={saved} className="btn-ghost">
                {saved ? <><IconCheck /> Enregistré</> : <><IconCar /> Sauvegarder ce véhicule</>}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="card grid place-items-center py-12 text-center text-slate-400">
          <IconCar className="text-4xl text-slate-600" />
          <p className="mt-3">Sélectionnez au moins une marque et un modèle pour afficher la fiche.</p>
        </div>
      )}
    </div>
  )
}

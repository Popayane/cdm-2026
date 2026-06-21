import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getRecent } from '../lib/db'
import { useAuth } from '../context/AuthContext'
import { IconSearch, IconCar, IconScan, IconBolt, IconStar } from '../components/Icons'

export default function Home() {
  const navigate = useNavigate()
  const { user, isDemo } = useAuth()
  const [q, setQ] = useState('')
  const recent = getRecent()

  function quickSearch(e) {
    e.preventDefault()
    if (!q.trim()) return navigate('/vehicules')
    navigate(`/vehicules?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-700 to-ink-800 px-6 py-12 sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-electric-500/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="chip mb-4">
            <IconBolt className="text-electric-400" /> Diagnostic automobile par IA
          </span>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
            Comprenez la panne de votre voiture en{' '}
            <span className="bg-gradient-to-r from-electric-400 to-electric-600 bg-clip-text text-transparent">
              quelques secondes
            </span>
          </h1>
          <p className="mt-4 text-slate-300">
            Décrivez votre problème, obtenez les causes probables, le niveau de gravité et une
            estimation du coût des réparations.
          </p>

          {/* Barre de recherche rapide */}
          <form onSubmit={quickSearch} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <IconSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un véhicule (ex. Renault Clio)…"
                className="input pl-11"
              />
            </div>
            <button className="btn-primary whitespace-nowrap">Rechercher</button>
          </form>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/vehicules" className="btn-ghost">
              <IconCar /> Rechercher un véhicule
            </Link>
            <Link to="/diagnostic" className="btn-primary">
              <IconScan /> Diagnostiquer une panne
            </Link>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: IconScan, t: 'Diagnostic IA', d: 'Analyse intelligente de vos symptômes en langage naturel.' },
          { icon: IconStar, t: 'Fiabilité véhicule', d: 'Note sur 10, défauts connus et pannes majeures.' },
          { icon: IconBolt, t: 'Estimation coût', d: 'Une fourchette de prix réaliste pour anticiper.' },
        ].map((f) => {
          const Icon = f.icon
          return (
            <div key={f.t} className="card card-hover">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-electric-500/15 text-xl text-electric-400">
                <Icon />
              </span>
              <h3 className="mt-3 font-bold">{f.t}</h3>
              <p className="mt-1 text-sm text-slate-400">{f.d}</p>
            </div>
          )
        })}
      </section>

      {/* Derniers véhicules consultés */}
      {recent.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold">Derniers véhicules consultés</h2>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <Link
                key={r}
                to={`/vehicules?q=${encodeURIComponent(r)}`}
                className="chip card-hover px-4 py-2 text-sm"
              >
                <IconCar className="text-electric-400" /> {r}
              </Link>
            ))}
          </div>
        </section>
      )}

      {!user && (
        <section className="card flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <h2 className="font-bold">Créez un compte gratuit</h2>
            <p className="text-sm text-slate-400">
              Sauvegardez vos véhicules, accédez à l’historique et profitez de diagnostics illimités.
              {isDemo && ' (Mode démo : authentification simulée localement.)'}
            </p>
          </div>
          <Link to="/connexion" className="btn-primary">Commencer</Link>
        </section>
      )}
    </div>
  )
}

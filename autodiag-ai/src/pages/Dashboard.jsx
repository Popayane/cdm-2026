import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDiagnostics, getVehicles, getRecent, deleteVehicle } from '../lib/db'
import { useAuth } from '../context/AuthContext'
import { IconScan, IconCar, IconHistory, IconSearch } from '../components/Icons'

function Stat({ icon: Icon, value, label, to }) {
  const inner = (
    <div className="card card-hover flex items-center gap-4">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-electric-500/15 text-2xl text-electric-400">
        <Icon />
      </span>
      <div>
        <p className="text-2xl font-extrabold leading-none">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

export default function Dashboard() {
  const { user } = useAuth()
  const [diags, setDiags] = useState([])
  const [vehicles, setVehicles] = useState([])
  const recent = getRecent()

  async function load() {
    const [d, v] = await Promise.all([getDiagnostics(user?.id), getVehicles(user?.id)])
    setDiags(d)
    setVehicles(v)
  }
  useEffect(() => {
    load()
  }, [user])

  async function remove(id) {
    await deleteVehicle(user?.id, id)
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Tableau de bord</h1>
        <p className="text-sm text-slate-400">Bonjour {user?.user_metadata?.name || user?.email} 👋</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={IconScan} value={diags.length} label="Diagnostics réalisés" to="/historique" />
        <Stat icon={IconCar} value={vehicles.length} label="Véhicules enregistrés" />
        <Stat icon={IconSearch} value={recent.length} label="Recherches récentes" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Véhicules enregistrés */}
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Mes véhicules</h2>
            <Link to="/vehicules" className="text-sm font-semibold text-electric-400 hover:underline">+ Ajouter</Link>
          </div>
          {vehicles.length === 0 ? (
            <p className="text-sm text-slate-400">Aucun véhicule enregistré.</p>
          ) : (
            <ul className="space-y-2">
              {vehicles.map((v) => (
                <li key={v.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <span className="flex items-center gap-2 text-sm">
                    <IconCar className="text-electric-400" />
                    {v.marque} {v.modele} <span className="text-slate-500">{v.annee} {v.motorisation}</span>
                  </span>
                  <button onClick={() => remove(v.id)} className="text-xs text-slate-500 hover:text-red-400">Suppr.</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Dernières recherches */}
        <div className="card">
          <h2 className="mb-3 font-bold">Dernières recherches</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-400">Aucune recherche récente.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {recent.map((r) => (
                <Link key={r} to={`/vehicules?q=${encodeURIComponent(r)}`} className="chip card-hover px-3 py-1.5 text-sm">
                  <IconCar className="text-electric-400" /> {r}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Derniers diagnostics */}
      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">Derniers diagnostics</h2>
          <Link to="/historique" className="text-sm font-semibold text-electric-400 hover:underline">Tout voir →</Link>
        </div>
        {diags.length === 0 ? (
          <p className="text-sm text-slate-400">Aucun diagnostic réalisé.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {diags.slice(0, 5).map((d) => (
              <li key={d.id} className="flex items-center gap-3 py-2.5 text-sm">
                <IconHistory className="shrink-0 text-electric-400" />
                <span className="truncate text-slate-300">{d.symptome}</span>
                <span className="ml-auto shrink-0 text-xs text-slate-500">
                  {new Date(d.date).toLocaleDateString('fr-FR')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

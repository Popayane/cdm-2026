import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDiagnostics } from '../lib/db'
import { useAuth } from '../context/AuthContext'
import DiagnosticResult from '../components/DiagnosticResult'
import { IconHistory, IconScan } from '../components/Icons'

function fmtDate(d) {
  return new Date(d).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function History() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)

  useEffect(() => {
    getDiagnostics(user?.id).then((d) => {
      setItems(d)
      setLoading(false)
    })
  }, [user])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">Historique des diagnostics</h1>
        <p className="text-sm text-slate-400">Retrouvez tous vos diagnostics passés.</p>
      </div>

      {loading ? (
        <div className="card text-slate-400">Chargement…</div>
      ) : items.length === 0 ? (
        <div className="card grid place-items-center py-12 text-center text-slate-400">
          <IconHistory className="text-4xl text-slate-600" />
          <p className="mt-3">Aucun diagnostic pour le moment.</p>
          <Link to="/diagnostic" className="btn-primary mt-4"><IconScan /> Lancer un diagnostic</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => {
            const isOpen = open === it.id
            const topCause = it.resultat?.causes?.[0]
            return (
              <div key={it.id} className="card card-hover">
                <button onClick={() => setOpen(isOpen ? null : it.id)} className="flex w-full items-start gap-3 text-left">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-electric-500/15 text-electric-400">
                    <IconScan />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="font-semibold">{it.vehicle_label || 'Véhicule non précisé'}</p>
                      <span className="text-xs text-slate-500">{fmtDate(it.date)}</span>
                    </div>
                    <p className="truncate text-sm text-slate-400">{it.symptome}</p>
                    {topCause && !isOpen && (
                      <p className="mt-1 text-sm text-electric-300">→ {topCause.cause} ({Math.round(topCause.confiance)}%)</p>
                    )}
                  </div>
                  <span className="text-slate-500">{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <DiagnosticResult result={it.resultat} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

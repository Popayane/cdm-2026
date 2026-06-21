import { IconCheck } from './Icons'

const GRAVITE_STYLE = {
  Faible: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  Moyenne: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  Élevée: 'bg-red-500/15 text-red-300 border-red-400/30',
}

function ConfidenceBar({ value }) {
  const color = value >= 65 ? 'from-emerald-400 to-emerald-500' : value >= 45 ? 'from-amber-400 to-amber-500' : 'from-slate-400 to-slate-500'
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export default function DiagnosticResult({ result }) {
  if (!result) return null
  const { resume, causes = [], gravite, estimation, verifications = [], moteur } = result

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-full border px-3 py-1 text-sm font-bold ${GRAVITE_STYLE[gravite] || GRAVITE_STYLE.Moyenne}`}>
          Gravité : {gravite}
        </span>
        {estimation && (
          <span className="rounded-full border border-electric-400/30 bg-electric-500/10 px-3 py-1 text-sm font-bold text-electric-300">
            Estimation : {estimation.min}–{estimation.max} {estimation.devise || '€'}
          </span>
        )}
        <span className="chip ml-auto">
          {moteur === 'openai' ? '⚡ OpenAI' : '🧠 Moteur local'}
        </span>
      </div>

      {resume && <p className="text-sm text-slate-300">{resume}</p>}

      {/* Causes probables */}
      <div>
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-400">Causes probables</h3>
        <div className="space-y-3">
          {causes.map((c, i) => (
            <div key={i} className="card card-hover p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{c.cause}</p>
                <span className="shrink-0 text-sm font-bold text-electric-400">{Math.round(c.confiance)}%</span>
              </div>
              <ConfidenceBar value={Math.round(c.confiance)} />
            </div>
          ))}
        </div>
      </div>

      {/* Vérifications recommandées */}
      {verifications.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-400">Vérifications recommandées</h3>
          <ul className="space-y-2">
            {verifications.map((v, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-200">
                <IconCheck className="mt-0.5 shrink-0 text-electric-400" />
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

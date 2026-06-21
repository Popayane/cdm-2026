import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { diagnose } from '../lib/ai'
import { addDiagnostic, getGuestCount, incGuestCount, GUEST_LIMIT } from '../lib/db'
import { useAuth } from '../context/AuthContext'
import DiagnosticResult from '../components/DiagnosticResult'
import { IconScan, IconBolt } from '../components/Icons'

const EXAMPLES = [
  'Ma voiture perd de la puissance et un voyant moteur est allumé.',
  'Un sifflement aigu apparaît quand je freine.',
  'Le moteur chauffe et de la fumée blanche sort du capot.',
  'La voiture ne démarre pas, j’entends juste un clic.',
]

export default function Diagnostic() {
  const [params] = useSearchParams()
  const { user } = useAuth()

  const [symptome, setSymptome] = useState('')
  const [vehicule, setVehicule] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [guestUsed, setGuestUsed] = useState(getGuestCount())

  useEffect(() => {
    const v = params.get('vehicule')
    if (v) setVehicule(v)
  }, [params])

  const limitReached = !user && guestUsed >= GUEST_LIMIT

  async function run(e) {
    e?.preventDefault()
    setError('')
    if (symptome.trim().length < 8) {
      setError('Merci de décrire le problème avec un peu plus de détails.')
      return
    }
    if (limitReached) return

    setLoading(true)
    setResult(null)
    try {
      const vehicleObj = vehicule ? { marque: vehicule, modele: '' } : null
      const res = await diagnose(symptome, vehicleObj)
      setResult(res)
      await addDiagnostic(user?.id, {
        symptome,
        vehicle_label: vehicule || null,
        resultat: res,
      })
      if (!user) setGuestUsed(incGuestCount())
    } catch (err) {
      setError('Une erreur est survenue pendant le diagnostic. Réessayez.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Colonne formulaire */}
      <div className="space-y-4 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-extrabold">Diagnostic IA</h1>
          <p className="text-sm text-slate-400">Décrivez votre problème en quelques mots, l’IA s’occupe du reste.</p>
        </div>

        {/* Quota visiteur */}
        {!user && (
          <div className="card flex items-center justify-between gap-3 py-3">
            <span className="text-sm text-slate-300">
              Diagnostics gratuits : <b className="text-electric-400">{Math.max(0, GUEST_LIMIT - guestUsed)}</b> / {GUEST_LIMIT}
            </span>
            <Link to="/connexion" className="text-sm font-semibold text-electric-400 hover:underline">
              Illimité →
            </Link>
          </div>
        )}

        <form onSubmit={run} className="card space-y-4">
          <div>
            <label className="label">Véhicule concerné (optionnel)</label>
            <input
              className="input"
              value={vehicule}
              onChange={(e) => setVehicule(e.target.value)}
              placeholder="Ex. Renault Clio IV 1.5 dCi"
            />
          </div>
          <div>
            <label className="label">Décrivez votre problème</label>
            <textarea
              className="input min-h-[120px] resize-y"
              value={symptome}
              onChange={(e) => setSymptome(e.target.value)}
              placeholder="Ex. Ma voiture perd de la puissance et un voyant moteur est allumé."
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {limitReached ? (
            <Link to="/connexion" className="btn-primary w-full">
              <IconBolt /> Limite atteinte — Connectez-vous
            </Link>
          ) : (
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? 'Analyse en cours…' : <><IconScan /> Lancer le diagnostic</>}
            </button>
          )}
        </form>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Exemples</p>
          <div className="flex flex-col gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setSymptome(ex)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-slate-300 transition hover:border-electric-400/40 hover:bg-white/10"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Colonne résultat */}
      <div className="lg:col-span-3">
        <div className="card min-h-[300px]">
          {loading ? (
            <div className="grid h-full place-items-center py-16 text-center">
              <div>
                <div className="relative mx-auto h-16 w-16">
                  <span className="absolute inset-0 rounded-full bg-electric-500/40 animate-pulse-ring" />
                  <span className="absolute inset-0 grid place-items-center rounded-full bg-electric-500/20 text-2xl text-electric-400">
                    <IconScan />
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-400">L’IA analyse vos symptômes…</p>
              </div>
            </div>
          ) : result ? (
            <DiagnosticResult result={result} />
          ) : (
            <div className="grid h-full place-items-center py-16 text-center text-slate-500">
              <div>
                <IconScan className="mx-auto text-4xl text-slate-600" />
                <p className="mt-3">Le résultat de votre diagnostic apparaîtra ici.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

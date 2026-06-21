import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconGoogle, IconBolt } from '../components/Icons'

export default function Login() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, isDemo } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') await signInWithEmail(email, password)
      else await signUpWithEmail(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Échec de l’authentification.')
    } finally {
      setLoading(false)
    }
  }

  async function google() {
    setError('')
    try {
      await signInWithGoogle()
      if (isDemo) navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Échec de la connexion Google.')
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card animate-fade-up">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-electric-400 to-electric-600 text-ink-900 shadow-glow">
            <IconBolt className="text-xl" />
          </span>
          <h1 className="mt-3 text-xl font-extrabold">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h1>
          <p className="text-sm text-slate-400">Diagnostics illimités, historique et véhicules sauvegardés.</p>
        </div>

        <button onClick={google} className="btn-ghost w-full">
          <IconGoogle className="text-lg" /> Continuer avec Google
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-slate-500">
          <div className="h-px flex-1 bg-white/10" /> ou <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label">Email</label>
            <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@email.com" />
          </div>
          <div>
            <label className="label">Mot de passe</label>
            <input type="password" required minLength={6} className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? '…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà inscrit ?'}{' '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="font-semibold text-electric-400 hover:underline">
            {mode === 'login' ? 'Créer un compte' : 'Se connecter'}
          </button>
        </p>

        {isDemo && (
          <p className="mt-4 rounded-xl border border-electric-400/20 bg-electric-500/10 p-3 text-center text-xs text-electric-200">
            Mode démo : l’authentification est simulée localement. Renseignez les clés Supabase pour activer la vraie connexion.
          </p>
        )}
      </div>
    </div>
  )
}

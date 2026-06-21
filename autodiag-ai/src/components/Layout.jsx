import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconCar, IconScan, IconHistory, IconDash, IconSearch, IconUser, IconBolt } from './Icons'

const navItems = [
  { to: '/', label: 'Accueil', icon: IconBolt, end: true },
  { to: '/vehicules', label: 'Véhicules', icon: IconCar },
  { to: '/diagnostic', label: 'Diagnostic', icon: IconScan },
  { to: '/historique', label: 'Historique', icon: IconHistory, auth: true },
  { to: '/dashboard', label: 'Tableau de bord', icon: IconDash, auth: true },
]

export default function Layout({ children }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-electric-400 to-electric-600 text-ink-900 shadow-glow">
              <IconBolt className="text-lg" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              AutoDiag <span className="text-electric-400">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {navItems
              .filter((i) => !i.auth || user)
              .map((i) => (
                <NavLink
                  key={i.to}
                  to={i.to}
                  end={i.end}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      isActive ? 'bg-white/10 text-electric-400' : 'text-slate-300 hover:bg-white/5'
                    }`
                  }
                >
                  {i.label}
                </NavLink>
              ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm sm:flex">
                  <IconUser className="text-electric-400" />
                  <span className="max-w-[140px] truncate">{user.email}</span>
                </span>
                <button
                  onClick={() => {
                    signOut()
                    navigate('/')
                  }}
                  className="btn-ghost px-3 py-1.5 text-sm"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/connexion" className="btn-primary px-4 py-2 text-sm">
                Connexion
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        AutoDiag AI — Démo · Les diagnostics sont indicatifs et ne remplacent pas l’avis d’un professionnel.
      </footer>

      {/* Bottom nav mobile */}
      <nav className="sticky bottom-0 z-30 border-t border-white/10 bg-ink-900/90 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-6xl items-stretch justify-around">
          {navItems
            .filter((i) => !i.auth || user)
            .map((i) => {
              const Icon = i.icon
              return (
                <NavLink
                  key={i.to}
                  to={i.to}
                  end={i.end}
                  className={({ isActive }) =>
                    `flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition ${
                      isActive ? 'text-electric-400' : 'text-slate-400'
                    }`
                  }
                >
                  <Icon className="text-xl" />
                  {i.label}
                </NavLink>
              )
            })}
        </div>
      </nav>
    </div>
  )
}

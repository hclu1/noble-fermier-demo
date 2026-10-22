// Path: src/features/auth/LoginPage.tsx

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import Container from '../../layout/Container'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import styles from './LoginPage.module.css'

// Page de connexion — email + mot de passe
// Redirige vers la page demandée avant la connexion (ou /mon-compte)
// Identifiants de démo : marie.dupont@exemple.fr / demo1234
export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate        = useNavigate()
  const location        = useLocation()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  // Page à afficher après connexion (mémorisée par ProtectedRoute)
  const redirectTo = (location.state as { from?: string })?.from ?? '/mon-compte'

  // Si déjà connecté, on redirige directement
  if (user) {
    navigate(redirectTo, { replace: true })
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: loginError } = await login(email, password)

    if (loginError) {
      setError(loginError)
      setLoading(false)
      return
    }

    navigate(redirectTo, { replace: true })
  }

  return (
    <Container narrow>
      <div className={styles.page}>
        <div className={styles.wrapper}>

          {/* En-tête */}
          <div className={styles.header}>
            <h1 className={styles.title}>Connexion</h1>
            <p className={styles.subtitle}>
              Accédez à votre espace client Noble Fermier.
            </p>
          </div>

          <Card padding="lg">
            <form onSubmit={handleSubmit} className={styles.form} noValidate>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="marie@exemple.fr"
                  disabled={loading}
                />
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label htmlFor="password" className={styles.label}>
                    Mot de passe
                  </label>
                  <Link to="/mot-de-passe-oublie" className={styles.forgotLink}>
                    Mot de passe oublié ?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Connexion en cours…' : 'Se connecter'}
              </Button>
            </form>
          </Card>

          {/* Identifiants de démo — visibles uniquement en développement local */}
          {import.meta.env.DEV && (
            <div className={styles.demo}>
              <p className={styles.demoLabel}>Compte de démonstration</p>
              <p>Email : <strong>marie.dupont@exemple.fr</strong></p>
              <p>Mot de passe : <strong>demo1234</strong></p>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

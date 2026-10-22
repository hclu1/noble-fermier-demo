// Path: src/features/auth/ForgotPasswordPage.tsx

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './useAuth'
import Container from '../../layout/Container'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import styles from './ForgotPasswordPage.module.css'

type Status = 'idle' | 'sending' | 'sent' | 'error'

// Page mot de passe oublié
// Envoie un email de réinitialisation via resetPassword()
// TODO Supabase : la fonction resetPassword() appellera
//   supabase.auth.resetPasswordForEmail(email, { redirectTo: '...' })
export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error,  setError]  = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setStatus('sending')

    const { error: resetError } = await resetPassword(email)

    if (resetError) {
      setError(resetError)
      setStatus('error')
      return
    }

    setStatus('sent')
  }

  return (
    <Container narrow>
      <div className={styles.page}>
        <div className={styles.wrapper}>

          {/* En-tête */}
          <div className={styles.header}>
            <h1 className={styles.title}>Mot de passe oublié</h1>
            <p className={styles.subtitle}>
              Renseignez votre email pour recevoir un lien de réinitialisation.
            </p>
          </div>

          <Card padding="lg">
            {status === 'sent' ? (
              /* ─── État succès ─── */
              <div className={styles.success}>
                <span className={styles.successIcon}>✉️</span>
                <h2 className={styles.successTitle}>Email envoyé !</h2>
                <p className={styles.successText}>
                  Si un compte existe pour <strong>{email}</strong>, vous
                  recevrez un lien de réinitialisation dans quelques minutes.
                  Vérifiez aussi vos spams.
                </p>
                <Link to="/connexion">
                  <Button variant="secondary" fullWidth>
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            ) : (
              /* ─── Formulaire ─── */
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
                    disabled={status === 'sending'}
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
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le lien'}
                </Button>

                <Link to="/connexion" className={styles.backLink}>
                  ← Retour à la connexion
                </Link>
              </form>
            )}
          </Card>
        </div>
      </div>
    </Container>
  )
}

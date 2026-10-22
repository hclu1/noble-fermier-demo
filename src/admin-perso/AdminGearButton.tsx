// ══════════════════════════════════════════════════════════════════════════
//  ROUE DENTÉE — Bouton d'accès à l'administration client
//  Fichier : src/admin-perso/AdminGearButton.tsx
//
//  Ce bouton ⚙️ est discret, placé dans le footer.
//  Un clic ouvre la modale de connexion admin.
//  Identifiants : Hclu1 / 3131
// ══════════════════════════════════════════════════════════════════════════

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminPerso } from './AdminPersoContext'
import styles from './AdminGearButton.module.css'

export default function AdminGearButton() {
  const { login, isAdminLoggedIn, logout } = useAdminPerso()
  const navigate = useNavigate()

  const [open,     setOpen]     = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')

  function handleOpen() {
    if (isAdminLoggedIn) {
      // Déjà connecté → aller directement au panneau
      navigate('/admin-perso')
    } else {
      setOpen(true)
      setUsername('')
      setPassword('')
      setError('')
    }
  }

  function handleClose() {
    setOpen(false)
    setError('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = login(username, password)
    if (ok) {
      setOpen(false)
      navigate('/admin-perso')
    } else {
      setError('Identifiants incorrects. Veuillez réessayer.')
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <>
      {/* ─── Bouton roue dentée ─── */}
      <button
        id="admin-gear-button"
        className={`${styles.gearBtn} ${isAdminLoggedIn ? styles.active : ''}`}
        onClick={handleOpen}
        title={isAdminLoggedIn ? 'Panneau admin — cliquer pour ouvrir' : 'Administration'}
        aria-label="Accès administration"
      >
        ⚙️
      </button>

      {/* ─── Modale de connexion ─── */}
      {open && (
        <div className={styles.overlay} onClick={handleClose} role="dialog" aria-modal="true">
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

            <button className={styles.closeBtn} onClick={handleClose} aria-label="Fermer">✕</button>

            <div className={styles.modalIcon}>⚙️</div>
            <h2 className={styles.modalTitle}>Administration</h2>
            <p className={styles.modalSub}>Espace réservé — saisissez vos identifiants</p>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="admin-username">Nom d'utilisateur</label>
                <input
                  id="admin-username"
                  className={styles.input}
                  type="text"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Hclu1"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="admin-password">Mot de passe</label>
                <input
                  id="admin-password"
                  className={styles.input}
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  required
                />
              </div>

              {error && <p className={styles.error} role="alert">{error}</p>}

              <button className={styles.submitBtn} type="submit">
                Se connecter
              </button>

            </form>
          </div>
        </div>
      )}

      {/* ─── Lien déconnexion si admin connecté ─── */}
      {isAdminLoggedIn && (
        <button
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 'var(--text-xs)', color: 'var(--color-cta)',
            textDecoration: 'underline', padding: 0,
          }}
          onClick={handleLogout}
          title="Se déconnecter de l'admin"
        >
          Quitter l'admin
        </button>
      )}
    </>
  )
}

// Path: src/demo/components/DemoHeader.tsx

import { Link, useLocation } from 'react-router-dom'
import styles from './DemoHeader.module.css'

export default function DemoHeader() {
  const location = useLocation()

  function isActive(path: string) {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logoIcon}>🧺</span>
          <span className={styles.brandName}>Noble Fermier — Mode Démo</span>
        </Link>

        <nav className={styles.nav} aria-label="Navigation démo">
          <Link
            to="/"
            className={`${styles.navLink} ${isActive('/') && location.pathname === '/' ? styles.active : ''}`}
          >
            Accueil
          </Link>
          <Link
            to="/catalogue"
            className={`${styles.navLink} ${isActive('/catalogue') || isActive('/produit') ? styles.active : ''}`}
          >
            Catalogue & Rayons
          </Link>
          <Link
            to="/commandes"
            className={`${styles.navLink} ${isActive('/commandes') ? styles.active : ''}`}
          >
            Suivi Commandes
          </Link>
          <Link
            to="/contact"
            className={`${styles.navLink} ${isActive('/contact') ? styles.active : ''}`}
          >
            Horaires & Contact
          </Link>
        </nav>

        <div className={styles.actions}>
          <Link to="/admin-preview" className={styles.adminBtn}>
            <span>⚙️</span> Aperçu Admin
          </Link>
        </div>
      </div>
    </header>
  )
}

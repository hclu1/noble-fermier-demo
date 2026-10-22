// Path: src/demo/components/DemoHeader.tsx

import { Link, useLocation } from 'react-router-dom'
import styles from './DemoHeader.module.css'

export default function DemoHeader() {
  const location = useLocation()
  const prefix = location.pathname.startsWith('/demo') ? '/demo' : ''

  function isActive(path: string) {
    const target = prefix ? `${prefix}${path === '/' ? '' : path}` : path
    if (path === '/' && (location.pathname === '/' || location.pathname === '/demo' || location.pathname === '/demo/')) return true
    if (path !== '/' && location.pathname.startsWith(target)) return true
    return false
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to={prefix ? `${prefix}` : '/'} className={styles.brand}>
          <span className={styles.logoIcon}>🧺</span>
          <span className={styles.brandName}>Noble Fermier — Mode Démo</span>
        </Link>

        <nav className={styles.nav} aria-label="Navigation démo">
          <Link
            to={prefix ? `${prefix}` : '/'}
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
          >
            Accueil
          </Link>
          <Link
            to={`${prefix}/catalogue`}
            className={`${styles.navLink} ${isActive('/catalogue') || location.pathname.includes('/produit') ? styles.active : ''}`}
          >
            Catalogue & Rayons
          </Link>
          <Link
            to={`${prefix}/commandes`}
            className={`${styles.navLink} ${isActive('/commandes') ? styles.active : ''}`}
          >
            Suivi Commandes
          </Link>
          <Link
            to={`${prefix}/contact`}
            className={`${styles.navLink} ${isActive('/contact') ? styles.active : ''}`}
          >
            Horaires & Contact
          </Link>
        </nav>

        <div className={styles.actions}>
          <Link to={`${prefix}/admin-preview`} className={styles.adminBtn}>
            <span>⚙️</span> Aperçu Admin
          </Link>
        </div>
      </div>
    </header>
  )
}

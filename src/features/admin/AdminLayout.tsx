// Path: src/features/admin/AdminLayout.tsx

import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { brandConfig } from '../../config/brandConfig'
import styles from './AdminLayout.module.css'

// Layout de l'espace admin — remplace PageLayout pour toutes les pages /admin/*
// Contient : topbar + sidebar desktop + menu mobile + zone de contenu
export default function AdminLayout() {
  const { user, logout }     = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  return (
    <div className={styles.shell}>

      {/* ─── Barre du haut ─── */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          {/* Bouton menu hamburger — visible seulement sur mobile */}
          <button
            className={styles.menuToggle}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>

          <Link to="/admin/produits" className={styles.brand}>
            <span className={styles.brandIcon}>🌿</span>
            <span className={styles.brandName}>Admin — {brandConfig.name}</span>
          </Link>
        </div>

        <div className={styles.topbarRight}>
          <span className={styles.userEmail}>{user?.email}</span>
          <Link to="/" className={styles.siteLink}>Voir le site →</Link>
          <button className={styles.logoutBtn} onClick={() => logout()}>
            Déconnexion
          </button>
        </div>
      </header>

      <div className={styles.body}>

        {/* ─── Sidebar desktop + menu mobile ─── */}
        <nav
          className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}
          aria-label="Navigation admin"
        >
          <p className={styles.sidebarLabel}>Gestion</p>
          <NavLink to="/admin/commandes"  className={navClass} onClick={closeMobile}>📋 Commandes</NavLink>
          <NavLink to="/admin/produits"   className={navClass} onClick={closeMobile}>📦 Produits</NavLink>
          <NavLink to="/admin/promotions" className={navClass} onClick={closeMobile}>🏷️ Promotions</NavLink>
          <NavLink to="/admin/contenu"    className={navClass} onClick={closeMobile}>📄 Contenu</NavLink>
          <NavLink to="/admin/reglages"   className={navClass} onClick={closeMobile}>⚙️ Réglages</NavLink>

          {/* Branding — réservé au platform_admin (concepteur SaaS) */}
          {user?.isPlatformAdmin && (
            <>
              <p className={`${styles.sidebarLabel} ${styles.sidebarLabelTop}`}>Concepteur</p>
              <NavLink to="/admin/branding" className={navClass} onClick={closeMobile}>🎨 Branding</NavLink>
            </>
          )}

          {/* Lien déconnexion visible seulement sur mobile dans le menu */}
          <div className={styles.mobileFooter}>
            <Link to="/" className={styles.mobileSiteLink} onClick={closeMobile}>
              Voir le site →
            </Link>
            <button className={styles.mobileLogout} onClick={() => { logout(); closeMobile() }}>
              Déconnexion
            </button>
          </div>
        </nav>

        {/* Fond semi-transparent derrière le menu mobile */}
        {mobileOpen && (
          <div
            className={styles.overlay}
            onClick={closeMobile}
            aria-hidden="true"
          />
        )}

        {/* ─── Zone de contenu principale ─── */}
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// Classe CSS active/inactive pour les liens de la sidebar
function navClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? `${styles.navLink} ${styles.active}`
    : styles.navLink
}

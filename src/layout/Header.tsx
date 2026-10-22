// Path: src/layout/Header.tsx

import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../features/cart/CartContext'
import { brandConfig } from '../config/brandConfig'
import { activeRoutes } from '../config/routesConfig'
import Container from './Container'
import styles from './Header.module.css'

// Header principal de la boutique
// Navigation dynamique selon les routes activées dans routesConfig
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  // On ne garde que les routes marquées comme visibles dans la nav
  const navLinks = activeRoutes.filter((r) => r.showInNav)
  const { totalItems } = useCart()

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.inner}>

          {/* Logo + nom de la boutique */}
          <Link to="/" className={styles.brand}>
            {brandConfig.logoUrl ? (
              <img
                src={brandConfig.logoUrl}
                alt={brandConfig.name}
                className={styles.logo}
              />
            ) : (
              <span className={styles.logoPlaceholder}>
                {brandConfig.name.charAt(0)}
              </span>
            )}
            <span className={styles.brandName}>{brandConfig.name}</span>
          </Link>
          {/* Navigation desktop */}
          <nav className={styles.nav} aria-label="Navigation principale">
            {navLinks.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                {route.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions utilisateur : Panier */}
          <div className={styles.actions}>
            <Link to="/panier" className={styles.cartLink} aria-label="Voir le panier">
              <span className={styles.cartIcon}>🛒</span>
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </Link>

            {/* Bouton menu mobile */}
            <button
              className={styles.menuButton}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
            >
              <span className={styles.hamburger} />
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {menuOpen && (
          <nav className={styles.mobileNav} aria-label="Menu mobile">
            {navLinks.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) =>
                  isActive ? `${styles.mobileLink} ${styles.active}` : styles.mobileLink
                }
                onClick={() => setMenuOpen(false)}
              >
                {route.label}
              </NavLink>
            ))}
          </nav>
        )}
      </Container>
    </header>
  )
}

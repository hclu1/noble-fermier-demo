// Path: src/layout/Footer.tsx

import { Link } from 'react-router-dom'
import { brandConfig } from '../config/brandConfig'
import { APP_VERSION } from '../config/appConfig'
import Container from './Container'
import AdminGearButton from '../admin-perso/AdminGearButton'
import styles from './Footer.module.css'

// Footer de la boutique
// Affiche les infos du magasin depuis brandConfig
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>

          {/* Colonne 1 — Identité boutique */}
          <div className={styles.column}>
            <p className={styles.brandName}>{brandConfig.name}</p>
            <p className={styles.tagline}>{brandConfig.tagline}</p>

            {brandConfig.address && (
              <address className={styles.address}>
                {brandConfig.address.street}<br />
                {brandConfig.address.zip} {brandConfig.address.city}
              </address>
            )}

            {brandConfig.phone && (
              <a href={`tel:${brandConfig.phone}`} className={styles.contact}>
                {brandConfig.phone}
              </a>
            )}
          </div>

          {/* Colonne 2 — Horaires */}
          {brandConfig.openingHours && (
            <div className={styles.column}>
              <p className={styles.columnTitle}>Horaires</p>
              {brandConfig.openingHours.map((line, i) => (
                <p key={i} className={styles.hours}>{line}</p>
              ))}
            </div>
          )}

          {/* Colonne 3 — Liens légaux */}
          <div className={styles.column}>
            <p className={styles.columnTitle}>Informations</p>
            <nav aria-label="Liens légaux">
              <Link to="/contact" className={styles.footerLink}>Contact</Link>
              <Link to="/mentions-legales" className={styles.footerLink}>Mentions légales</Link>
              <Link to="/confidentialite" className={styles.footerLink}>Confidentialité</Link>
            </nav>
          </div>
        </div>

        {/* Barre de bas de page */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {year} {brandConfig.name}. Tous droits réservés.
            <span className={styles.version}>v{APP_VERSION}</span>
          </p>

          {/* Réseaux sociaux */}
          {brandConfig.socialLinks && brandConfig.socialLinks.length > 0 && (
            <div className={styles.socials}>
              {brandConfig.socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                >
                  {social.platform}
                </a>
              ))}
            </div>
          )}

          {/* ⚙️ Bouton d'accès à l'administration — cliquer pour personnaliser */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AdminGearButton />
          </div>
        </div>

      </Container>
    </footer>
  )
}

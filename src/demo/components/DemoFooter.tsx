// Path: src/demo/components/DemoFooter.tsx

import { Link } from 'react-router-dom'
import styles from './DemoFooter.module.css'

export default function DemoFooter() {
  const appalacarteUrl = (import.meta.env.VITE_APPALACARTE_URL as string) || 'https://appalacarte.fr'

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <h4 className={styles.title}>Noble Fermier — Mode Démo</h4>
          <p className={styles.text}>
            Exemple d’application e-commerce & vitrine personnalisée pour primeurs,
            maraîchers et artisans des circuits courts.
          </p>
        </div>

        <div>
          <h4 className={styles.title}>Parcours Démo</h4>
          <ul className={styles.linkList}>
            <li><Link to="/" className={styles.link}>Accueil Démo</Link></li>
            <li><Link to="/catalogue" className={styles.link}>Catalogue Produits</Link></li>
            <li><Link to="/commandes" className={styles.link}>Suivi des Commandes</Link></li>
            <li><Link to="/admin-preview" className={styles.link}>Aperçu Tableau de Bord</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={styles.title}>Vitrine Appalacarte</h4>
          <p className={styles.text}>
            Cette démonstration interactive illustre les fonctionnalités de gestion, de catalogue et de fidélisation de l’application primeur.
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            <a
              href={appalacarteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              style={{ color: '#10b981', fontWeight: 600 }}
            >
              En savoir plus sur Appalacarte →
            </a>
          </p>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Noble Fermier — Vitrine interactive.</span>
        <span className={styles.demoDisclaimer}>
          🔒 Environnement Démo Sécurisé — Écritures neutralisées
        </span>
      </div>
    </footer>
  )
}

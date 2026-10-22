// Path: src/demo/components/DemoBanner.tsx

import styles from './DemoBanner.module.css'

export default function DemoBanner() {
  const appalacarteUrl = (import.meta.env.VITE_APPALACARTE_URL as string) || 'https://appalacarte.fr'

  return (
    <aside className={styles.banner} aria-label="Bannière d’information mode démo">
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.badge}>Démo</span>
          <span className={styles.text}>
            Mode démo — <span className={styles.highlight}>données d’exemple</span>
          </span>
        </div>

        <div className={styles.right}>
          <a
            href={appalacarteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.backBtn}
            title="Revenir vers le catalogue de vitrines Appalacarte"
          >
            ← Retour à Appalacarte
          </a>
        </div>
      </div>
    </aside>
  )
}

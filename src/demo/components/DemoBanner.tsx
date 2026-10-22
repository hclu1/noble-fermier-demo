// Path: src/demo/components/DemoBanner.tsx

import { useDemoContext } from '../context/DemoContext'
import styles from './DemoBanner.module.css'

export default function DemoBanner() {
  const { deviceMode, setDeviceMode } = useDemoContext()
  const appalacarteUrl = (import.meta.env.VITE_APPALACARTE_URL as string) || 'https://appalacarte.fr'

  return (
    <aside className={styles.banner} aria-label="Bannière d’information mode démo">
      <div className={styles.inner}>
        {/* Gauche : Badge & Info */}
        <div className={styles.left}>
          <span className={styles.badge}>Démo</span>
          <span className={styles.text}>
            Mode démo — <span className={styles.highlight}>données d’exemple</span>
          </span>
        </div>

        {/* Centre : Sélecteur de vue PC / Smartphone */}
        <div className={styles.center}>
          <div className={styles.deviceSwitcher} role="group" aria-label="Choisir la vue de démonstration">
            <button
              type="button"
              className={`${styles.deviceBtn} ${deviceMode === 'desktop' ? styles.activeDevice : ''}`}
              onClick={() => setDeviceMode('desktop')}
              title="Affichage normal écran PC (Plein écran)"
            >
              🖥️ Vue PC
            </button>
            <button
              type="button"
              className={`${styles.deviceBtn} ${deviceMode === 'mobile' ? styles.activeDevice : ''}`}
              onClick={() => setDeviceMode('mobile')}
              title="Simulateur d'affichage Smartphone mobile"
            >
              📱 Vue Smartphone
            </button>
          </div>
        </div>

        {/* Droite : Bouton Retour Vitrine */}
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

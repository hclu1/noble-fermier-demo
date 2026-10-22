// Path: src/demo/components/DemoActionModal.tsx

import { useDemoContext } from '../context/DemoContext'
import styles from './DemoActionModal.module.css'

export default function DemoActionModal() {
  const { isModalOpen, blockedActionName, closeDemoNotice } = useDemoContext()
  const appalacarteUrl = (import.meta.env.VITE_APPALACARTE_URL as string) || 'https://appalacarte.fr'

  if (!isModalOpen) return null

  return (
    <div className={styles.overlay} onClick={closeDemoNotice} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconContainer}>
          🔒
        </div>

        {blockedActionName && (
          <div className={styles.actionBadge}>
            Tentative : {blockedActionName}
          </div>
        )}

        <h3 className={styles.title}>Version de Démonstration</h3>

        <p className={styles.message}>
          Cette action est disponible dans la version complète de l’application.
          En mode démo, la modification, la validation et l’export de données sont verrouillés pour garantir l’intégrité de la présentation.
        </p>

        <div className={styles.buttonGroup}>
          <a
            href={appalacarteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            Découvrir l'offre complète sur Appalacarte
          </a>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeDemoNotice}
          >
            Poursuivre la visite de la démo
          </button>
        </div>
      </div>
    </div>
  )
}

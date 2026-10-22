// Path: src/demo/layout/DemoLayout.tsx

import React from 'react'
import DemoBanner from '../components/DemoBanner'
import DemoHeader from '../components/DemoHeader'
import DemoFooter from '../components/DemoFooter'
import DemoActionModal from '../components/DemoActionModal'
import { useDemoContext } from '../context/DemoContext'
import styles from './DemoLayout.module.css'

interface DemoLayoutProps {
  children: React.ReactNode
}

export default function DemoLayout({ children }: DemoLayoutProps) {
  const { deviceMode } = useDemoContext()

  return (
    <div className={styles.wrapper}>
      {/* La bannière démo reste toujours accessible en haut */}
      <DemoBanner />

      {deviceMode === 'mobile' ? (
        /* ─── Mode Simulateur Smartphone ─── */
        <div className={styles.mobileStage}>
          <div className={styles.stageHeader}>
            <span className={styles.stageBadge}>Simulateur iOS / Android</span>
            <span>📱 Format smartphone 390 × 844 · Défilement tactile actif</span>
          </div>

          <div className={styles.phoneCase}>
            {/* Encoche / Dynamic Island */}
            <div className={styles.islandPill}>
              <div className={styles.cameraLens} />
            </div>

            {/* Écran tactile du smartphone avec défilement */}
            <div className={styles.phoneScreen}>
              <DemoHeader />
              <main className={styles.main}>
                {children}
              </main>
              <DemoFooter />
            </div>

            {/* Barre de retour accueil type smartphone */}
            <div className={styles.homeIndicator} />
          </div>
        </div>
      ) : (
        /* ─── Mode Normal Plein Écran (PC) ─── */
        <>
          <DemoHeader />
          <main className={styles.main}>
            {children}
          </main>
          <DemoFooter />
        </>
      )}

      {/* Modale d'action sécurisée */}
      <DemoActionModal />
    </div>
  )
}

// Path: src/demo/layout/DemoLayout.tsx

import React from 'react'
import DemoBanner from '../components/DemoBanner'
import DemoHeader from '../components/DemoHeader'
import DemoFooter from '../components/DemoFooter'
import DemoActionModal from '../components/DemoActionModal'
import styles from './DemoLayout.module.css'

interface DemoLayoutProps {
  children: React.ReactNode
}

export default function DemoLayout({ children }: DemoLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <DemoBanner />
      <DemoHeader />
      <main className={styles.main}>
        {children}
      </main>
      <DemoFooter />
      <DemoActionModal />
    </div>
  )
}

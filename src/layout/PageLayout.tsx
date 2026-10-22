// Path: src/layout/PageLayout.tsx

import Header from './Header'
import Footer from './Footer'
import styles from './PageLayout.module.css'

interface PageLayoutProps {
  children: React.ReactNode
}

// Enveloppe globale de chaque page
// Toutes les pages passent par ce composant
export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

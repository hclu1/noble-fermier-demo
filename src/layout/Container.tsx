// Path: src/layout/Container.tsx

import styles from './Container.module.css'

interface ContainerProps {
  children: React.ReactNode
  narrow?: boolean     // version plus étroite pour les pages de contenu
  className?: string
}

// Centrage horizontal avec max-width
// narrow=true → 800px (articles, formulaires)
// narrow=false → 1200px (catalogue, accueil)
export default function Container({ children, narrow = false, className = '' }: ContainerProps) {
  const widthClass = narrow ? styles.narrow : styles.wide

  return (
    <div className={`${styles.container} ${widthClass} ${className}`}>
      {children}
    </div>
  )
}

// Path: src/components/ui/Card.tsx

import styles from './Card.module.css'

interface CardProps {
  children: React.ReactNode
  className?: string
  clickable?: boolean    // ajoute un effet hover si la carte est cliquable
  padding?: 'sm' | 'md' | 'lg'
}

// Carte générique réutilisable pour les produits, promotions, contenus, etc.
// Entourer n'importe quel contenu dans <Card> pour lui donner le style carte
export default function Card({
  children,
  className = '',
  clickable = false,
  padding = 'md',
}: CardProps) {
  const classes = [
    styles.card,
    styles[`padding-${padding}`],
    clickable ? styles.clickable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {children}
    </div>
  )
}

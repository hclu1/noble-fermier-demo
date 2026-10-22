// Path: src/features/NotFoundPage.tsx

import { Link } from 'react-router-dom'
import Container from '../layout/Container'
import Button from '../components/ui/Button'
import styles from './NotFoundPage.module.css'

// Page 404 — affiché sur toute URL non reconnue
export default function NotFoundPage() {
  return (
    <Container narrow>
      <div className={styles.page}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Page introuvable</h1>
        <p className={styles.text}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/">
          <Button size="lg" variant="primary">
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </Container>
  )
}

// Path: src/features/content/ContentPage.tsx

import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { fetchContentPageBySlug } from '../../lib/queries/content'
import type { ContentPage } from '../../types'
import Container from '../../layout/Container'
import styles from './ContentPage.module.css'
import homeStyles from '../home/HomePage.module.css'

// Résout le slug depuis les paramètres d'URL ou depuis le pathname.
// Gère à la fois /p/:slug et les routes fixes (/mentions-legales, /confidentialite).
function resolveSlug(slug?: string): string {
  if (slug) return slug
  return window.location.pathname.replace(/^\//, '')
}

export default function ContentPage() {
  const { slug } = useParams<{ slug: string }>()
  const [page,      setPage]      = useState<ContentPage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  const resolvedSlug = resolveSlug(slug)

  useEffect(() => {
    fetchContentPageBySlug(resolvedSlug).then(({ data, error: fetchErr }) => {
      if (fetchErr) setError(fetchErr)
      else if (data) setPage(data)
      setIsLoading(false)
    })
  }, [resolvedSlug])

  if (isLoading) {
    return (
      <Container narrow>
        <article className={styles.article} style={{ paddingTop: 'var(--space-8)' }}>
          <div className={`${homeStyles.skeleton}`} style={{ height: '40px', width: '60%', marginBottom: 'var(--space-4)' }} />
          <div className={`${homeStyles.skeleton}`} style={{ height: '20px', width: '40%', marginBottom: 'var(--space-8)' }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`${homeStyles.skeleton}`} style={{ height: '20px', width: '100%', marginBottom: 'var(--space-2)' }} />
          ))}
        </article>
      </Container>
    )
  }

  if (error) {
    return (
      <Container narrow>
        <article className={styles.article} style={{ padding: 'var(--space-20) 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-accent)' }}>{error}</p>
          <nav className={styles.back} style={{ marginTop: 'var(--space-8)', justifyContent: 'center' }}>
            <Link to="/" className={styles.backLink}>← Retour à l'accueil</Link>
          </nav>
        </article>
      </Container>
    )
  }

  // Page introuvable → redirection accueil
  if (!page) return <Navigate to="/" replace />

  return (
    <Container narrow>
      <article className={styles.article}>

        <nav className={styles.back}>
          <Link to="/" className={styles.backLink}>← Retour à l'accueil</Link>
        </nav>

        <header className={styles.header}>
          <h1 className={styles.title}>{page.title}</h1>
          <p className={styles.date}>
            Dernière mise à jour :{' '}
            {new Date(page.updatedAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </header>

        {/* Corps HTML provenant de mockContent (contenu interne, pas utilisateur) */}
        <div
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: page.body }}
        />

      </article>
    </Container>
  )
}

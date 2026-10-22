// Path: src/features/catalog/ProductPage.tsx

import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link, Navigate } from 'react-router-dom'
import { fetchProductBySlug, fetchCategories } from '../../lib/queries/products'
import { featureFlags } from '../../config/featureFlags'
import { hasFeature } from '../../config/packs'
import type { Product, Category } from '../../types'
import Container from '../../layout/Container'
import Button from '../../components/ui/Button'
import styles from './ProductPage.module.css'
import homeStyles from '../home/HomePage.module.css'

export default function ProductPage() {
  const { slug }   = useParams<{ slug: string }>()
  const navigate   = useNavigate()
  const [product,    setProduct]    = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [error,      setError]      = useState<string | null>(null)

  useEffect(() => {
    if (!slug) { setIsLoading(false); return }
    Promise.all([
      fetchProductBySlug(slug),
      fetchCategories(),
    ]).then(([prodResult, catResult]) => {
      if (prodResult.error) {
        setError(prodResult.error)
      } else if (prodResult.data) {
        setProduct(prodResult.data)
      }
      if (catResult.data) setCategories(catResult.data)
      setIsLoading(false)
    })
  }, [slug])

  if (isLoading) {
    return (
      <Container>
        <div className={styles.page} style={{ paddingTop: 'var(--space-8)' }}>
          <div className={styles.layout}>
            <div className={`${homeStyles.skeleton}`} style={{ aspectRatio: '1', borderRadius: 'var(--radius-xl)' }} />
            <div className={styles.info}>
              <div className={`${homeStyles.skeleton}`} style={{ height: '40px', width: '60%' }} />
              <div className={`${homeStyles.skeleton}`} style={{ height: '20px', width: '40%' }} />
              <div className={`${homeStyles.skeleton}`} style={{ height: '20px', width: '30%' }} />
              <div className={`${homeStyles.skeleton}`} style={{ height: '100px', width: '100%', marginTop: 'var(--space-4)' }} />
            </div>
          </div>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <div className={styles.page} style={{ padding: 'var(--space-20) 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-accent)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>{error}</p>
          <Button variant="secondary" onClick={() => navigate('/catalogue')}>Retour au catalogue</Button>
        </div>
      </Container>
    )
  }

  // Produit introuvable → redirection catalogue
  if (!product) return <Navigate to="/catalogue" replace />

  const category = categories.find((c) => c.id === product.categoryId)

  const isUnavailable = product.isAvailable === false

  return (
    <Container>
      <div className={styles.page}>

        {/* Fil d'Ariane */}
        <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
          <Link to="/"          className={styles.breadcrumbLink}>Accueil</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <Link to="/catalogue" className={styles.breadcrumbLink}>Catalogue</Link>
          {category && (
            <>
              <span className={styles.breadcrumbSep}>›</span>
              <Link
                to={`/catalogue?categorie=${category.slug}`}
                className={styles.breadcrumbLink}
              >
                {category.name}
              </Link>
            </>
          )}
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        <div className={styles.layout}>

          {/* Image */}
          <div className={styles.imageWrapper}>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className={styles.image}
              />
            ) : (
              <div className={styles.imagePlaceholder} aria-hidden="true">
                <span>🥦</span>
              </div>
            )}
            {product.promotionId && featureFlags.showPromoBadges && (
              <span className={styles.badgePromo}>Promotion</span>
            )}
          </div>

          {/* Infos */}
          <div className={styles.info}>
            {category && (
              <Link
                to={`/catalogue?categorie=${category.slug}`}
                className={styles.categoryTag}
              >
                {category.name}
              </Link>
            )}

            <h1 className={styles.name}>{product.name}</h1>

            {featureFlags.showStockStatus && (
              <p className={isUnavailable ? styles.unavailable : styles.available}>
                {isUnavailable ? '✗ Rupture de stock' : '✓ En stock'}
              </p>
            )}

            {featureFlags.showPricesPublicly ? (
              <div className={styles.priceBlock}>
                <span className={styles.price}>{product.price.toFixed(2)} €</span>
                <span className={styles.unit}>/ {product.unit}</span>
              </div>
            ) : (
              <p className={styles.priceHidden}>Prix sur demande</p>
            )}

            <p className={styles.description}>{product.description}</p>

            <div className={styles.actions}>
              {hasFeature('cart') ? (
                <Button
                  size="lg"
                  variant="primary"
                  fullWidth
                  disabled={isUnavailable}
                >
                  {isUnavailable ? 'Indisponible' : 'Ajouter au panier'}
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="primary"
                  fullWidth
                  onClick={() => navigate('/contact')}
                >
                  Nous contacter pour commander
                </Button>
              )}
              <Button
                size="lg"
                variant="secondary"
                fullWidth
                onClick={() => navigate('/catalogue')}
              >
                ← Retour au catalogue
              </Button>
            </div>
          </div>
        </div>

      </div>
    </Container>
  )
}

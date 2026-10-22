// Path: src/features/home/HomePage.tsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchFeaturedProducts, fetchCategories } from '../../lib/queries/products'
import { brandConfig, CATEGORY_EMOJIS } from '../../config/brandConfig'
import { useAdminPerso } from '../../admin-perso/AdminPersoContext'
import type { Product, Category } from '../../types'
import Container from '../../layout/Container'
import ProductCard from '../catalog/components/ProductCard'
import Button from '../../components/ui/Button'
import styles from './HomePage.module.css'

export default function HomePage() {
  const navigate = useNavigate()
  const { perso } = useAdminPerso()
  const t = perso.texts   // textes personnalisés (ou valeurs par défaut)

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories,       setCategories]       = useState<Category[]>([])
  const [isLoading,        setIsLoading]        = useState(true)
  const [error,            setError]            = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetchFeaturedProducts(),
      fetchCategories()
    ]).then(([prodRes, catRes]) => {
      if (prodRes.error || catRes.error) {
        setError(prodRes.error || catRes.error)
      } else {
        if (prodRes.data) setFeaturedProducts(prodRes.data)
        if (catRes.data) setCategories(catRes.data)
      }
      setIsLoading(false)
    })
  }, [])


  return (
    <div className={styles.page}>

      {/* ── 1. Hero ── */}
      <section className={styles.hero}>
        <Container>
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>
              {t.heroEyebrow || `Primeur local · ${brandConfig.address?.city ?? 'France'}`}
            </p>
            <h1 className={styles.heroTitle}>
              {t.heroTitle
                ? t.heroTitle.split('\n').map((line, i, arr) =>
                    i < arr.length - 1 ? <span key={i}>{line}<br /></span> : <em key={i}>{line}</em>
                  )
                : <><span>La fraîcheur du marché,</span><br /><em>à votre porte.</em></>
              }
            </h1>
            <p className={styles.heroSubtitle}>{t.heroSubtitle || brandConfig.tagline}</p>
            <div className={styles.heroActions}>
              <Button size="lg" variant="primary" onClick={() => navigate('/catalogue')}>
                {t.heroButtonMain || 'Découvrir nos produits'}
              </Button>
              <Button size="lg" variant="ghost" onClick={() => navigate('/contact')}>
                {t.heroButtonSec || 'Nous contacter'}
              </Button>
            </div>
          </div>
        </Container>
        <div className={styles.heroDecor} aria-hidden="true">🍃</div>
      </section>

      {/* ── 2. Rayons ── */}
      <section className={styles.section}>
        <Container>
          <h2 className={styles.sectionTitle}>Nos rayons</h2>
          <p className={styles.sectionSubtitle}>
            Du champ à votre table — fruits, légumes, herbes et paniers composés.
          </p>
          <div className={styles.categoryGrid}>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`${styles.categoryCard} ${styles.skeleton}`} style={{ height: '120px' }} />
              ))
            ) : error ? (
              <p style={{ color: 'var(--color-accent)' }}>Impossible de charger les rayons.</p>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  className={styles.categoryCard}
                  onClick={() => navigate(`/catalogue?categorie=${cat.slug}`)}
                >
                  <span className={styles.categoryEmoji}>
                    {CATEGORY_EMOJIS[cat.slug] ?? '🌱'}
                  </span>
                  <span className={styles.categoryName}>{cat.name}</span>
                </button>
              ))
            )}
          </div>
        </Container>
      </section>

      {/* ── 3. Coups de cœur ── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <Container>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Nos coups de cœur</h2>
              <p className={styles.sectionSubtitle}>
                Une sélection du moment, choisie par notre équipe.
              </p>
            </div>
            <Button variant="secondary" onClick={() => navigate('/catalogue')}>
              Tout voir
            </Button>
          </div>

          <div className={styles.productGrid}>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={`${styles.skeleton} ${styles.skeletonCard}`} />
              ))
            ) : error ? (
              <p style={{ color: 'var(--color-accent)' }}>Impossible de charger les produits.</p>
            ) : (
              featuredProducts.map((product) => {
                const category = categories.find((c) => c.id === product.categoryId)
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    category={category}
                    hasPromo={!!product.promotionId}
                  />
                )
              })
            )}
          </div>
        </Container>
      </section>

      {/* ── 4. Argumentaire ── */}
      <section className={styles.section}>
        <Container>
          <h2 className={styles.sectionTitle}>Pourquoi {brandConfig.name} ?</h2>
          <div className={styles.argumentGrid}>
            {ARGUMENTS.map((arg) => (
              <div key={arg.title} className={styles.argumentCard}>
                <span className={styles.argumentIcon}>{arg.icon}</span>
                <h3 className={styles.argumentTitle}>{arg.title}</h3>
                <p className={styles.argumentText}>{arg.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 5. Bandeau CTA ── */}
      <section className={styles.ctaBand}>
        <Container>
          <p className={styles.ctaText}>
            {t.ctaBandText || 'Une question ? On est là du lundi au samedi.'}
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate('/contact')}>
            Nous écrire
          </Button>
        </Container>
      </section>

    </div>
  )
}

// ─── Argumentaire commercial — générique primeur ───
const ARGUMENTS = [
  {
    icon: '🌱',
    title: 'Produits locaux',
    text: 'Nos producteurs sont sélectionnés dans un rayon de 200 km, pour garantir fraîcheur et traçabilité.',
  },
  {
    icon: '🤝',
    title: 'Circuits courts',
    text: 'Pas d\'intermédiaires. Du producteur à vous, directement. Un prix juste pour tous.',
  },
  {
    icon: '🗓️',
    title: 'Retrait rapide',
    text: 'Commandez avant 18h, votre panier est prêt le lendemain matin dès l\'ouverture.',
  },
  {
    icon: '💚',
    title: 'Saison garantie',
    text: 'Nous ne proposons que des produits de saison. Goût naturel, aucun compromis.',
  },
]

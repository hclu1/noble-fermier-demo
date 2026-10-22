// Path: src/demo/pages/DemoHomePage.tsx

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchDemoProducts, fetchDemoCategories } from '../lib/demoQueries'
import type { Product, Category } from '../../types'
import DemoProductCard from '../components/DemoProductCard'
import styles from './DemoHomePage.module.css'

export default function DemoHomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [prodRes, catRes] = await Promise.all([
        fetchDemoProducts(),
        fetchDemoCategories(),
      ])
      if (prodRes.data) {
        setFeaturedProducts(prodRes.data.filter((p) => p.isFeatured).slice(0, 8))
      }
      if (catRes.data) {
        setCategories(catRes.data)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>🌱 Fraîcheur & Terroir en Direct · Démo Appalacarte</span>
          <h1 className={styles.heroTitle}>Noble Fermier — Mode Démo</h1>
          <p className={styles.heroSubtitle}>
            Fruits cueillis à maturité, légumes de pleine terre et paniers composés.
            Présentation interactive de l'application primeur pour votre vitrine.
          </p>
          <div className={styles.heroActions}>
            <Link to="/catalogue" className={styles.primaryBtn}>
              Découvrir le Catalogue ({featuredProducts.length > 0 ? '28' : '...'} produits)
            </Link>
            <Link to="/commandes" className={styles.secondaryBtn}>
              Voir une commande test
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Rayons & Catégories ─── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Nos Rayons de Saison</h2>
          <p className={styles.sectionSubtitle}>Sélectionnez une catégorie pour explorer les étals</p>
        </div>

        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalogue?cat=${cat.id}`}
              className={styles.categoryCard}
            >
              {cat.imageUrl && (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className={styles.categoryImg}
                  loading="lazy"
                />
              )}
              <div className={styles.categoryOverlay}>
                <span className={styles.categoryName}>{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Produits Vedettes ─── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Arrivages & Sélections du Moment</h2>
          <p className={styles.sectionSubtitle}>Les pépites de nos producteurs partenaires</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            Chargement des étals...
          </div>
        ) : (
          <div className={styles.productGrid}>
            {featuredProducts.map((p) => (
              <DemoProductCard
                key={p.id}
                product={p}
                promotionLabel={p.promotionId ? 'Offre Découverte' : undefined}
              />
            ))}
          </div>
        )}
      </section>

      {/* ─── Engagements ─── */}
      <section className={styles.valuesBanner}>
        <div className={styles.valuesInner}>
          <div className={styles.valueItem}>
            <div className={styles.valueIcon}>🚜</div>
            <h4>100% Circuits Courts</h4>
            <p>Partenariats directs avec nos maraîchers locaux pour une rémunération juste.</p>
          </div>
          <div className={styles.valueItem}>
            <div className={styles.valueIcon}>☀️</div>
            <h4>Cueillette à Maturité</h4>
            <p>Pas de mûrissement artificiel : le vrai goût du soleil dans votre assiette.</p>
          </div>
          <div className={styles.valueItem}>
            <div className={styles.valueIcon}>🧺</div>
            <h4>Click & Collect Express</h4>
            <p>Vos cagettes préparées en 2h chrono et prêtes à être retirées en boutique.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

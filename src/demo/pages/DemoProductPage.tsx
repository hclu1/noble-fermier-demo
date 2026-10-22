// Path: src/demo/pages/DemoProductPage.tsx

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchDemoProducts, fetchDemoPromotions } from '../lib/demoQueries'
import type { Product, Promotion } from '../../types'
import { useDemoContext } from '../context/DemoContext'
import styles from './DemoProductPage.module.css'

export default function DemoProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { triggerDemoNotice } = useDemoContext()
  const [product, setProduct] = useState<Product | null>(null)
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      const [prodRes, promoRes] = await Promise.all([
        fetchDemoProducts(),
        fetchDemoPromotions(),
      ])

      if (prodRes.data) {
        const found = prodRes.data.find((p) => p.slug === slug)
        setProduct(found || null)
      }
      if (promoRes.data) {
        setPromotions(promoRes.data)
      }
      setLoading(false)
    }
    loadProduct()
  }, [slug])

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
          Chargement de la fiche produit...
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Produit non trouvé</h2>
          <p style={{ color: '#6b7280', margin: '1rem 0' }}>Ce produit n’existe pas ou a été retiré des étals.</p>
          <Link to="/catalogue" className={styles.backLink}>
            ← Revenir au catalogue
          </Link>
        </div>
      </div>
    )
  }

  const promo = promotions.find((pr) => pr.productIds && pr.productIds.includes(product.id))

  return (
    <div className={styles.container}>
      <Link to="/catalogue" className={styles.backLink}>
        ← Retour aux rayons primeurs
      </Link>

      <div className={styles.layout}>
        <div className={styles.imageBox}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className={styles.image}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '4rem' }}>
              🧺
            </div>
          )}

          {promo && (
            <span className={styles.badge}>
              Promo -{promo.discountPercent}%
            </span>
          )}
        </div>

        <div className={styles.details}>
          <h1 className={styles.title}>{product.name}</h1>

          <div className={styles.priceRow}>
            <span className={styles.price}>{product.price.toFixed(2)} €</span>
            <span className={styles.unit}>TTC / la {product.unit}</span>
          </div>

          <p className={styles.description}>
            {product.description || 'Produit frais rigoureusement sélectionné par notre équipe selon arrivage maraîcher.'}
          </p>

          <div className={styles.guarantees}>
            <div className={styles.guaranteeItem}>
              <span>🌿</span>
              <span><strong>Origine garantie :</strong> Maraîchage local & récolte raisonnée</span>
            </div>
            <div className={styles.guaranteeItem}>
              <span>❄️</span>
              <span><strong>Fraîcheur :</strong> Livré ou préparé sous 24h</span>
            </div>
            <div className={styles.guaranteeItem}>
              <span>⚖️</span>
              <span><strong>Pesée précise :</strong> Ajustement au gramme près en boutique</span>
            </div>
          </div>

          <div className={styles.btnGroup}>
            <button
              type="button"
              className={styles.cartBtn}
              onClick={() => triggerDemoNotice(`Ajout au panier de ${product.name}`)}
            >
              <span>🧺</span> Ajouter à mon panier (Démo)
            </button>

            <button
              type="button"
              className={styles.fastOrderBtn}
              onClick={() => triggerDemoNotice(`Validation de commande express pour ${product.name}`)}
            >
              ⚡ Commander en retrait express 2h
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

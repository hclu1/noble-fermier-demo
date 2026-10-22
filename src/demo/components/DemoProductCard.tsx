// Path: src/demo/components/DemoProductCard.tsx

import React from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { useDemoContext } from '../context/DemoContext'
import styles from './DemoProductCard.module.css'

interface DemoProductCardProps {
  product: Product
  promotionLabel?: string
}

export default function DemoProductCard({ product, promotionLabel }: DemoProductCardProps) {
  const { triggerDemoNotice } = useDemoContext()

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    triggerDemoNotice(`Ajout au panier : ${product.name}`)
  }

  return (
    <article className={styles.card}>
      <Link to={`/produit/${product.slug}`} className={styles.linkWrapper}>
        <div className={styles.imageContainer}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className={styles.image}
              loading="lazy"
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2rem' }}>
              🥬
            </div>
          )}

          {promotionLabel && (
            <span className={styles.badge}>{promotionLabel}</span>
          )}
        </div>

        <div className={styles.content}>
          <h3 className={styles.name}>{product.name}</h3>
          {product.description && (
            <p className={styles.description}>{product.description}</p>
          )}

          <div className={styles.footer}>
            <div className={styles.priceBlock}>
              <span className={styles.price}>{product.price.toFixed(2)} €</span>
              <span className={styles.unit}>la {product.unit}</span>
            </div>

            <button
              type="button"
              className={styles.addBtn}
              onClick={handleAdd}
              title="Ajouter au panier (Mode Démo)"
            >
              <span>+</span> Panier
            </button>
          </div>
        </div>
      </Link>
    </article>
  )
}

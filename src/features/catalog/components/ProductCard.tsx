// Path: src/features/catalog/components/ProductCard.tsx

import { Link } from 'react-router-dom'
import type { Product, Category } from '../../../types'
import { featureFlags } from '../../../config/featureFlags'
import { useCart } from '../../cart/CartContext'
import { useProductImage } from '../../../admin-perso/useProductImage'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
  category?: Category
  hasPromo?: boolean
}

// Carte produit — affichée dans le catalogue et l'accueil
// Respecte les feature flags : prix masqués, badge promo, etc.
export default function ProductCard({ product, category, hasPromo = false }: ProductCardProps) {
  const { addToCart } = useCart()
  const isUnavailable = product.isAvailable === false

  // Résout l'image : URL externe ou image locale (IndexedDB) prise depuis l'admin
  const resolvedImage = useProductImage((product as any).imageUrl)

  return (
    <Card clickable className={styles.card}>
      <Link to={`/produit/${product.slug}`} className={styles.link}>

        {/* Image produit */}
        <div className={styles.imageWrapper}>
          {resolvedImage ? (
            <img src={resolvedImage} alt={product.name} className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder} aria-hidden="true">
              <span className={styles.placeholderEmoji}>🥦</span>
            </div>
          )}

          {/* Badges */}
          <div className={styles.badges}>
            {hasPromo && featureFlags.showPromoBadges && (
              <span className={styles.badgePromo}>Promo</span>
            )}
            {isUnavailable && (
              <span className={styles.badgeUnavailable}>Rupture</span>
            )}
          </div>
        </div>

        {/* Infos produit */}
        <div className={styles.body}>
          {category && (
            <span className={styles.category}>{category.name}</span>
          )}

          <h3 className={styles.name}>{product.name}</h3>

          <p className={styles.description}>
            {product.description.slice(0, 80)}…
          </p>

          {/* Prix */}
          <div className={styles.footer}>
            {featureFlags.showPricesPublicly ? (
              <p className={styles.price}>
                <span className={styles.priceAmount}>
                  {product.price.toFixed(2)} €
                </span>
                <span className={styles.priceUnit}> / {product.unit}</span>
              </p>
            ) : (
              <p className={styles.priceHidden}>Prix sur demande</p>
            )}

            <Button 
              size="sm" 
              variant="primary" 
              disabled={isUnavailable}
              onClick={(e) => {
                e.preventDefault()
                addToCart(product)
              }}
            >
              {isUnavailable ? 'Indisponible' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  )
}

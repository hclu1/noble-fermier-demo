// Path: src/features/cart/CartPage.tsx

import { Link } from 'react-router-dom'
import { useCart } from './CartContext'
import Container from '../../layout/Container'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import styles from './CartPage.module.css'

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart()

  if (items.length === 0) {
    return (
      <Container narrow>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🛒</span>
          <h1 className={styles.title}>Votre panier est vide</h1>
          <p className={styles.text}>
            Découvrez nos produits frais et locaux pour commencer vos achats.
          </p>
          <Link to="/catalogue">
            <Button variant="primary">Voir le catalogue</Button>
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className={styles.page}>
        <h1 className={styles.title}>Mon Panier</h1>

        <div className={styles.layout}>
          <div className={styles.items}>
            {items.map((item) => (
              <Card key={item.product.id} className={styles.itemCard}>
                <div className={styles.itemRow}>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.product.name}</h3>
                    <p className={styles.itemPrice}>
                      {item.product.price.toFixed(2)} € / {item.product.unit}
                    </p>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantity}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className={styles.qtyBtn}
                      >
                        -
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className={styles.qtyBtn}
                      >
                        +
                      </button>
                    </div>
                    <span className={styles.itemTotal}>
                      {(item.product.price * item.quantity).toFixed(2)} €
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className={styles.removeBtn}
                      aria-label="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <aside className={styles.summary}>
            <Card padding="lg">
              <h2 className={styles.summaryTitle}>Récapitulatif</h2>
              <div className={styles.summaryRow}>
                <span>Total</span>
                <span className={styles.summaryTotal}>{totalPrice.toFixed(2)} €</span>
              </div>
              <Link to="/commande">
                <Button variant="primary" fullWidth size="lg">
                  Passer la commande
                </Button>
              </Link>
            </Card>
          </aside>
        </div>
      </div>
    </Container>
  )
}

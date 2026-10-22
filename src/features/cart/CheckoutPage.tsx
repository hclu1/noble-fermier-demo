// Path: src/features/cart/CheckoutPage.tsx

import { Link, useNavigate } from 'react-router-dom'
import { useCart } from './CartContext'
import Container from '../../layout/Container'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import styles from './CheckoutPage.module.css'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <Container narrow>
        <div style={{ textAlign: 'center', padding: 'var(--space-20) 0' }}>
          <p>Votre panier est vide.</p>
          <Link to="/catalogue">
            <Button variant="secondary" style={{ marginTop: 'var(--space-4)' }}>
              Retour au catalogue
            </Button>
          </Link>
        </div>
      </Container>
    )
  }

  function handleConfirm() {
    // Simulation de création de commande
    alert('Commande validée ! (Simulation)')
    clearCart()
    navigate('/mes-commandes')
  }

  return (
    <Container narrow>
      <div className={styles.page}>
        <h1 className={styles.title}>Finalisation de commande</h1>

        <div className={styles.layout}>
          <Card padding="lg">
            <h2 className={styles.sectionTitle}>Votre commande</h2>
            <div className={styles.summary}>
              <div className={styles.row}>
                <span>Produits ({items.length})</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <div className={`${styles.row} ${styles.total}`}>
                <span>Total à régler</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
            </div>

            <p className={styles.notice}>
              En cliquant sur "Confirmer", vous validez votre commande en retrait magasin. 
              Le paiement s'effectue sur place.
            </p>

            <Button variant="primary" fullWidth size="lg" onClick={handleConfirm}>
              Confirmer la commande
            </Button>

            <Link to="/panier" style={{ display: 'block', textAlign: 'center', marginTop: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              Modifier mon panier
            </Link>
          </Card>
        </div>
      </div>
    </Container>
  )
}

// Path: src/features/account/components/OrderCard.tsx

import { useState } from 'react'
import type { Order } from '../../../types'
import OrderStatusBadge from './OrderStatusBadge'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import styles from './OrderCard.module.css'

interface OrderCardProps {
  order: Order
}

// Carte de commande — résumé + détail dépliable
// Affiche : numéro, date, statut, total, et les lignes de commande
export default function OrderCard({ order }: OrderCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formattedDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const deliveryLabel = order.deliveryMode === 'pickup' ? 'Retrait en magasin' : 'Livraison'

  return (
    <Card className={styles.card} padding="md">

      {/* ─── Ligne principale ─── */}
      <div className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.orderId}>Commande #{order.id.replace('ord-', '')}</span>
          <span className={styles.date}>{formattedDate}</span>
        </div>

        <div className={styles.right}>
          <OrderStatusBadge status={order.status} />
          <span className={styles.total}>{order.totalPrice.toFixed(2)} €</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Masquer les détails' : 'Voir les détails'}
          >
            {isOpen ? '▲ Masquer' : '▼ Détails'}
          </Button>
        </div>
      </div>

      {/* ─── Détail dépliable ─── */}
      {isOpen && (
        <div className={styles.detail}>
          <div className={styles.deliveryMode}>
            <span>📦</span>
            <span>{deliveryLabel}</span>
          </div>

          {/* Lignes de commande */}
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Produit</th>
                <th className={styles.th}>Qté</th>
                <th className={styles.th}>Prix unitaire</th>
                <th className={styles.th}>Sous-total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className={styles.tr}>
                  <td className={styles.td}>
                    <span className={styles.productName}>{item.productName}</span>
                    <span className={styles.productUnit}>{item.unit}</span>
                  </td>
                  <td className={styles.td}>{item.quantity}</td>
                  <td className={styles.td}>{item.unitPrice.toFixed(2)} €</td>
                  <td className={styles.td}>
                    {(item.quantity * item.unitPrice).toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Note */}
          {order.note && (
            <div className={styles.note}>
              <span className={styles.noteLabel}>Note :</span>
              <span>{order.note}</span>
            </div>
          )}

          {/* Total */}
          <div className={styles.totalRow}>
            <span>Total</span>
            <span className={styles.totalAmount}>{order.totalPrice.toFixed(2)} €</span>
          </div>
        </div>
      )}
    </Card>
  )
}

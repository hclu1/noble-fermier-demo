// Path: src/features/admin/orders/AdminOrdersPage.tsx

import { useState, useEffect } from 'react'
import { adminFetchAllOrders, adminUpdateOrderStatus } from '../../../lib/queries/admin'
import type { Order, OrderStatus } from '../../../types'
import Button from '../../../components/ui/Button'
import styles from './AdminOrdersPage.module.css'

// ─── Progression des statuts ───
// Chaque statut a un libellé affiché et une action possible vers le statut suivant.
const STATUS_LABEL: Record<OrderStatus, string> = {
  pending:   'En attente',
  confirmed: 'Confirmée',
  ready:     'Prête à retirer',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:   'confirmed',
  confirmed: 'ready',
  ready:     'delivered',
}

const NEXT_ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  pending:   'Confirmer',
  confirmed: 'Prête à retirer',
  ready:     'Livrée',
}

export default function AdminOrdersPage() {
  const [orders,     setOrders]     = useState<Order[]>([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error,      setError]      = useState<string | null>(null)

  useEffect(() => {
    adminFetchAllOrders().then(({ data, error }) => {
      if (data)  setOrders(data)
      if (error) setError(error)
      setIsLoading(false)
    })
  }, [])

  async function handleStatusChange(order: Order, newStatus: OrderStatus) {
    setUpdatingId(order.id)
    setError(null)
    const { error } = await adminUpdateOrderStatus(order.id, newStatus)
    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
      )
    } else {
      setError(error)
    }
    setUpdatingId(null)
  }

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Commandes</h1>
          <p className={styles.count}>{orders.length} commande{orders.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {error && <p className={styles.errorBanner}>Erreur : {error}</p>}

      {isLoading ? (
        <p className={styles.loading}>Chargement des commandes…</p>
      ) : orders.length === 0 ? (
        <p className={styles.empty}>Aucune commande pour l'instant.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Référence</th>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Articles</th>
                <th className={styles.th}>Total</th>
                <th className={styles.th}>Mode</th>
                <th className={styles.th}>Statut</th>
                <th className={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const nextStatus  = NEXT_STATUS[order.status]
                const actionLabel = NEXT_ACTION_LABEL[order.status]
                const isUpdating  = updatingId === order.id

                return (
                  <tr key={order.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.orderId}>#{order.id.slice(0, 8)}</span>
                    </td>
                    <td className={styles.td}>
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className={styles.td}>
                      {order.items.length} article{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className={styles.td}>
                      <strong>{order.totalPrice.toFixed(2)} €</strong>
                    </td>
                    <td className={styles.td}>
                      {order.deliveryMode === 'pickup' ? '🏪 Retrait' : '🚚 Livraison'}
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${styles[`badge_${order.status}`]}`}>
                        {STATUS_LABEL[order.status]}
                      </span>
                    </td>
                    <td className={styles.td}>
                      {nextStatus && actionLabel ? (
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(order, nextStatus)}
                        >
                          {isUpdating ? '…' : actionLabel}
                        </Button>
                      ) : (
                        <span className={styles.noAction}>—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

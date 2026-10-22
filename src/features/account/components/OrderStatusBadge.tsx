// Path: src/features/account/components/OrderStatusBadge.tsx

import type { OrderStatus } from '../../../types'
import styles from './OrderStatusBadge.module.css'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

// Badge coloré affichant le statut d'une commande
// Utilisé dans OrderCard et sur la page des commandes
export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { label, className } = STATUS_CONFIG[status]

  return (
    <span className={`${styles.badge} ${styles[className]}`}>
      {label}
    </span>
  )
}

// Configuration des statuts : libellé et classe CSS
const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending:   { label: 'En attente',      className: 'pending'   },
  confirmed: { label: 'Confirmée',       className: 'confirmed' },
  ready:     { label: 'Prête à retirer', className: 'ready'     },
  delivered: { label: 'Livrée',          className: 'delivered' },
  cancelled: { label: 'Annulée',         className: 'cancelled' },
}

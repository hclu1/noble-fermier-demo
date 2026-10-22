// Path: src/features/account/OrdersPage.tsx

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { fetchOrdersByUser } from '../../lib/queries/orders'
import type { Order, OrderStatus } from '../../types'
import Container from '../../layout/Container'
import Button from '../../components/ui/Button'
import OrderCard from './components/OrderCard'
import styles from './OrdersPage.module.css'
import homeStyles from '../home/HomePage.module.css'

// La page affiche uniquement les commandes de l'utilisateur connecté.
// La RLS Supabase filtre par auth.uid() — fetchOrdersByUser() ne reçoit pas d'id.
// En mode mock : fetchOrdersByUser() retourne mockOrders directement.

type StatusFilter = 'all' | OrderStatus

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders,       setOrders]       = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [isLoading,    setIsLoading]    = useState(true)
  const [error,        setError]        = useState<string | null>(null)

  useEffect(() => {
    fetchOrdersByUser().then(({ data, error: fetchErr }) => {
      if (fetchErr) setError(fetchErr)
      else if (data) setOrders(data)
      setIsLoading(false)
    })
  }, [])

  if (!user) return null

  // Commandes triées de la plus récente à la plus ancienne (fetchOrdersByUser trie déjà en Supabase)
  const userOrders = orders
    .filter((o) => o.profileId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const filtered =
    statusFilter === 'all'
      ? userOrders
      : userOrders.filter((o) => o.status === statusFilter)

  return (
    <Container>
      <div className={styles.page}>

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Mes commandes</h1>
            <p className={styles.subtitle}>{userOrders.length} commande{userOrders.length !== 1 ? 's' : ''} au total</p>
          </div>
          <Link to="/mon-compte">
            <Button variant="secondary">← Mon compte</Button>
          </Link>
        </div>

        {/* Filtre par statut */}
        <div className={styles.filters}>
          <label htmlFor="status-filter" className={styles.filterLabel}>
            Filtrer par statut :
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className={styles.filterSelect}
          >
            <option value="all">Toutes les commandes</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="ready">Prête à retirer</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>

        {/* Liste ou état vide */}
        {isLoading ? (
          <div className={styles.list}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`${homeStyles.skeleton}`} style={{ height: '140px', borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : error ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>❌</span>
            <p className={styles.emptyTitle}>Erreur de chargement</p>
            <p className={styles.emptyText}>{error}</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className={styles.list}>
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📋</span>
            <p className={styles.emptyTitle}>Aucune commande</p>
            <p className={styles.emptyText}>
              {statusFilter === 'all'
                ? "Vous n'avez pas encore passé de commande."
                : 'Aucune commande avec ce statut.'}
            </p>
            <Link to="/catalogue">
              <Button variant="primary">Voir le catalogue</Button>
            </Link>
          </div>
        )}

      </div>
    </Container>
  )
}

// Path: src/demo/pages/DemoOrdersPage.tsx

import { useEffect, useState } from 'react'
import { fetchDemoOrders } from '../lib/demoQueries'
import type { Order } from '../../types'
import { useDemoContext } from '../context/DemoContext'
import styles from './DemoOrdersPage.module.css'

export default function DemoOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const { triggerDemoNotice } = useDemoContext()

  useEffect(() => {
    async function load() {
      const res = await fetchDemoOrders()
      if (res.data) setOrders(res.data)
    }
    load()
  }, [])

  function renderStatusBadge(status: string) {
    switch (status) {
      case 'ready':
        return <span className={`${styles.statusBadge} ${styles.statusReady}`}>Prête à retirer</span>
      case 'confirmed':
        return <span className={`${styles.statusBadge} ${styles.statusConfirmed}`}>Confirmée</span>
      case 'delivered':
        return <span className={`${styles.statusBadge} ${styles.statusDelivered}`}>Remise au client</span>
      default:
        return <span className={styles.statusBadge}>{status}</span>
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Espace Client — Suivi des Commandes</h1>
        <p className={styles.subtitle}>
          Visualisation en direct du parcours de commande d'un client primeur (Pack Pro / Premium).
        </p>
      </header>

      <div className={styles.noticeBox}>
        <span>ℹ️</span>
        <div>
          <strong>Environnement Démo :</strong> Vous visualisez ici un exemple de carnet de commandes client synchronisé avec l'application. Les actions de modification ou réclamation sont simulées.
        </div>
      </div>

      <div className={styles.orderList}>
        {orders.map((order) => (
          <article key={order.id} className={styles.orderCard}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.orderId}>Commande #{order.id}</div>
                <div className={styles.orderDate}>
                  Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              {renderStatusBadge(order.status)}
            </div>

            <div className={styles.itemsList}>
              {order.items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <div>
                    <strong>{item.productName}</strong>
                    <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                      Qté : {item.quantity} {item.unit} à {item.unitPrice.toFixed(2)} € / {item.unit}
                    </div>
                  </div>
                  <div>
                    <strong>{(item.quantity * item.unitPrice).toFixed(2)} €</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cardFooter}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#6b7280', marginRight: '0.5rem' }}>Total commande :</span>
                <span className={styles.totalText}>{order.totalPrice.toFixed(2)} €</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => triggerDemoNotice('Téléchargement de facture')}
                >
                  📄 Facture PDF
                </button>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => triggerDemoNotice('Recommander le même panier')}
                >
                  🔄 Recommander
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

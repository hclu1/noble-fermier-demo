// Path: src/lib/queries/orders.ts

import { supabase, isMockMode } from '../supabase'
import type { QueryResult } from '../supabase'
import type { Order, OrderItem, OrderStatus } from '../../types'
import { mockOrders } from '../../data/mockOrders'

// ─────────────────────────────────────────────
// Requêtes de lecture — commandes (espace client)
// RLS Supabase garantit que chaque client ne voit que ses propres commandes.
// En mode mock : retourne toutes les commandes de démonstration.
// ─────────────────────────────────────────────

function rowToOrderItem(row: Record<string, unknown>): OrderItem {
  return {
    id:          row.id          as string,
    orderId:     row.order_id    as string,
    productId:   row.product_id  as string,
    // La colonne SQL s'appelle `name` (snapshot du produit à la commande)
    productName: row.name        as string,
    quantity:    row.quantity    as number,
    // La colonne SQL s'appelle `price` (prix unitaire au moment de la commande)
    unitPrice:   row.price       as number,
    unit:        row.unit        as string,
  }
}

function rowToOrder(row: Record<string, unknown>): Order {
  const items = Array.isArray(row.order_items)
    ? (row.order_items as Record<string, unknown>[]).map(rowToOrderItem)
    : []

  return {
    id:           row.id            as string,
    profileId:    row.customer_id   as string,
    status:       row.status        as OrderStatus,
    items,
    totalPrice:   row.total_price   as number,
    deliveryMode: row.delivery_mode as 'pickup' | 'delivery',
    note:         row.note          as string | undefined,
    createdAt:    row.created_at    as string,
    updatedAt:    row.updated_at    as string,
  }
}

// Lire les commandes du client connecté.
// En Supabase : la RLS filtre automatiquement par auth.uid(), pas besoin de passer l'id.
export async function fetchOrdersByUser(): Promise<QueryResult<Order[]>> {
  if (isMockMode) return { data: mockOrders, error: null }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data: data.map(rowToOrder), error: null }
}

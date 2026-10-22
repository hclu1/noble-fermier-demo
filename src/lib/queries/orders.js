// Path: src/lib/queries/orders.ts
import { supabase, isMockMode } from '../supabase';
import { mockOrders } from '../../data/mockOrders';
// ─────────────────────────────────────────────
// Requêtes de lecture — commandes (espace client)
// RLS Supabase garantit que chaque client ne voit que ses propres commandes.
// En mode mock : retourne toutes les commandes de démonstration.
// ─────────────────────────────────────────────
function rowToOrderItem(row) {
    return {
        id: row.id,
        orderId: row.order_id,
        productId: row.product_id,
        // La colonne SQL s'appelle `name` (snapshot du produit à la commande)
        productName: row.name,
        quantity: row.quantity,
        // La colonne SQL s'appelle `price` (prix unitaire au moment de la commande)
        unitPrice: row.price,
        unit: row.unit,
    };
}
function rowToOrder(row) {
    const items = Array.isArray(row.order_items)
        ? row.order_items.map(rowToOrderItem)
        : [];
    return {
        id: row.id,
        profileId: row.customer_id,
        status: row.status,
        items,
        totalPrice: row.total_price,
        deliveryMode: row.delivery_mode,
        note: row.note,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
// Lire les commandes du client connecté.
// En Supabase : la RLS filtre automatiquement par auth.uid(), pas besoin de passer l'id.
export async function fetchOrdersByUser() {
    if (isMockMode)
        return { data: mockOrders, error: null };
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      order_items (*)
    `)
        .order('created_at', { ascending: false });
    if (error)
        return { data: null, error: error.message };
    return { data: data.map(rowToOrder), error: null };
}

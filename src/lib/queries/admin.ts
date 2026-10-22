// Path: src/lib/queries/admin.ts

import { supabase, isMockMode } from '../supabase'
import type { QueryResult } from '../supabase'
import type { Product, Promotion, ContentPage, ShopSettings, SocialLink, Branding, Order, OrderItem, OrderStatus } from '../../types'
import { mockOrders } from '../../data/mockOrders'

// ─────────────────────────────────────────────
// Requêtes d'écriture — réservées à l'admin
//
// Ces fonctions sont protégées par RLS Supabase :
// seuls les utilisateurs avec profiles.role = 'admin'
// peuvent exécuter ces opérations côté base de données.
// ─────────────────────────────────────────────

// ════════════════════════════════════════════
// PRODUITS
// ════════════════════════════════════════════

export async function adminCreateProduct(
  product: Omit<Product, 'id'>
): Promise<QueryResult<Product>> {
  if (isMockMode) return { data: { id: crypto.randomUUID(), ...product }, error: null }

  const { data, error } = await supabase
    .from('products')
    .insert({
      name:         product.name,
      slug:         product.slug,
      description:  product.description,
      price:        product.price,
      unit:         product.unit,
      category_id:  product.categoryId,
      image_url:    product.imageUrl   ?? null,
      is_featured:  product.isFeatured  ?? false,
      is_available: product.isAvailable ?? true,
      promotion_id: product.promotionId ?? null,
    })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: rowToProduct(data), error: null }
}

export async function adminUpdateProduct(
  id: string,
  product: Omit<Product, 'id'>
): Promise<QueryResult<Product>> {
  if (isMockMode) return { data: { id, ...product }, error: null }

  const { data, error } = await supabase
    .from('products')
    .update({
      name:         product.name,
      slug:         product.slug,
      description:  product.description,
      price:        product.price,
      unit:         product.unit,
      category_id:  product.categoryId,
      image_url:    product.imageUrl   ?? null,
      is_featured:  product.isFeatured  ?? false,
      is_available: product.isAvailable ?? true,
      promotion_id: product.promotionId ?? null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: rowToProduct(data), error: null }
}

export async function adminDeleteProduct(id: string): Promise<{ error: string | null }> {
  if (isMockMode) return { error: null }
  const { error } = await supabase.from('products').delete().eq('id', id)
  return { error: error?.message ?? null }
}

// ════════════════════════════════════════════
// PROMOTIONS
// ════════════════════════════════════════════

export async function adminCreatePromotion(
  promo: Omit<Promotion, 'id'>
): Promise<QueryResult<Promotion>> {
  if (isMockMode) return { data: { id: crypto.randomUUID(), ...promo }, error: null }

  const { data, error } = await supabase
    .from('promotions')
    .insert({
      label:            promo.label,
      discount_percent: promo.discountPercent,
      product_ids:      promo.productIds   ?? [],
      category_ids:     promo.categoryIds  ?? [],
      start_date:       promo.startDate    ?? null,
      end_date:         promo.endDate      ?? null,
    })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: rowToPromotion(data), error: null }
}

export async function adminUpdatePromotion(
  id: string,
  promo: Omit<Promotion, 'id'>
): Promise<QueryResult<Promotion>> {
  if (isMockMode) return { data: { id, ...promo }, error: null }

  const { data, error } = await supabase
    .from('promotions')
    .update({
      label:            promo.label,
      discount_percent: promo.discountPercent,
      product_ids:      promo.productIds   ?? [],
      category_ids:     promo.categoryIds  ?? [],
      start_date:       promo.startDate    ?? null,
      end_date:         promo.endDate      ?? null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: rowToPromotion(data), error: null }
}

export async function adminDeletePromotion(id: string): Promise<{ error: string | null }> {
  if (isMockMode) return { error: null }
  const { error } = await supabase.from('promotions').delete().eq('id', id)
  return { error: error?.message ?? null }
}

// ════════════════════════════════════════════
// CONTENU
// ════════════════════════════════════════════

export async function adminCreateContentPage(
  page: Omit<ContentPage, 'id' | 'updatedAt'>
): Promise<QueryResult<ContentPage>> {
  if (isMockMode) return { data: { id: crypto.randomUUID(), updatedAt: new Date().toISOString(), ...page }, error: null }

  const { data, error } = await supabase
    .from('content_pages')
    .insert({ slug: page.slug, title: page.title, body: page.body })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: rowToContentPage(data), error: null }
}

export async function adminUpdateContentPage(
  id: string,
  page: Omit<ContentPage, 'id' | 'updatedAt'>
): Promise<QueryResult<ContentPage>> {
  if (isMockMode) return { data: { id, updatedAt: new Date().toISOString(), ...page }, error: null }

  const { data, error } = await supabase
    .from('content_pages')
    .update({ slug: page.slug, title: page.title, body: page.body })
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: rowToContentPage(data), error: null }
}

export async function adminDeleteContentPage(id: string): Promise<{ error: string | null }> {
  if (isMockMode) return { error: null }
  const { error } = await supabase.from('content_pages').delete().eq('id', id)
  return { error: error?.message ?? null }
}

// ════════════════════════════════════════════
// RÉGLAGES
// ════════════════════════════════════════════

export async function adminUpdateSettings(
  settings: ShopSettings
): Promise<{ error: string | null }> {
  if (isMockMode) return { error: null }

  const { error } = await supabase
    .from('shop_settings')
    .update({
      name:           settings.name,
      tagline:        settings.tagline        ?? null,
      logo_url:       settings.logoUrl        ?? null,
      phone:          settings.phone          ?? null,
      email:          settings.email          ?? null,
      address_street: settings.address.street,
      address_zip:    settings.address.zip,
      address_city:   settings.address.city,
      opening_hours:  settings.openingHours,
      social_links:   settings.socialLinks,
      primary_color:  settings.primaryColor ?? null,
    })
    .eq('id', 1) // La table shop_settings a une seule ligne

  return { error: error?.message ?? null }
}

// ════════════════════════════════════════════
// BRANDING (platform_admin uniquement)
// La RLS Supabase bloque les shop_admin sur cette table.
// ════════════════════════════════════════════

export async function adminFetchBranding(): Promise<QueryResult<Branding>> {
  if (isMockMode) {
    return {
      data: {
        primaryColor:     '#2D6A4F',
        secondaryColor:   '#F4845F',
        backgroundColor:  '#FEFAE0',
        fontHeading:      'Playfair Display',
        fontBody:         'Nunito',
        heroImageUrl:     undefined,
      },
      error: null,
    }
  }

  const { data, error } = await supabase
    .from('branding')
    .select('*')
    .single()

  if (error) return { data: null, error: error.message }

  return {
    data: {
      primaryColor:    data.primary_color    as string,
      secondaryColor:  data.secondary_color  as string,
      backgroundColor: data.background_color as string,
      fontHeading:     data.font_heading     as string,
      fontBody:        data.font_body        as string,
      heroImageUrl:    data.hero_image_url   as string | undefined,
    },
    error: null,
  }
}

export async function adminUpdateBranding(
  branding: Branding
): Promise<{ error: string | null }> {
  if (isMockMode) return { error: null }

  const { error } = await supabase
    .from('branding')
    .update({
      primary_color:    branding.primaryColor,
      secondary_color:  branding.secondaryColor,
      background_color: branding.backgroundColor,
      font_heading:     branding.fontHeading,
      font_body:        branding.fontBody,
      hero_image_url:   branding.heroImageUrl ?? null,
    })
    .eq('id', 1) // La table branding a une seule ligne

  return { error: error?.message ?? null }
}

// ════════════════════════════════════════════
// COMMANDES
// ════════════════════════════════════════════

// Message français envoyé au client à chaque étape
const STATUS_MESSAGES: Partial<Record<OrderStatus, string>> = {
  confirmed: "Votre commande est confirmée. Nous la préparons avec soin.",
  ready:     "Votre commande est prête à retirer. Passez nous voir !",
  delivered: "Votre commande a bien été livrée. Merci pour votre confiance.",
}

// Lire toutes les commandes — vue admin (sans filtre RLS sur customer_id)
export async function adminFetchAllOrders(): Promise<QueryResult<Order[]>> {
  if (isMockMode) return { data: mockOrders, error: null }

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items (*)')
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data: data.map(rowToOrder), error: null }
}

// Mettre à jour le statut d'une commande + déclencher la notification email
export async function adminUpdateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
): Promise<{ error: string | null }> {
  if (isMockMode) {
    const message = STATUS_MESSAGES[newStatus]
    if (message) console.info(`[Notification mock] ${message} (commande ${orderId})`)
    return { error: null }
  }

  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)

  if (error) return { error: error.message }

  // Déclenche l'email via une Edge Function Supabase (asynchrone, non bloquant)
  const message = STATUS_MESSAGES[newStatus]
  if (message) {
    supabase.functions
      .invoke('notify-order-status', { body: { orderId, status: newStatus, message } })
      .catch((err) => console.warn('[Notification] Non envoyée :', err))
  }

  return { error: null }
}

// ─────────────────────────────────────────────
// Mappers (snake_case Supabase → camelCase TypeScript)
// ─────────────────────────────────────────────

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id:          row.id           as string,
    name:        row.name         as string,
    slug:        row.slug         as string,
    description: row.description  as string,
    price:       row.price        as number,
    unit:        row.unit         as string,
    categoryId:  row.category_id  as string,
    imageUrl:    row.image_url    as string | undefined,
    isFeatured:  row.is_featured  as boolean,
    isAvailable: row.is_available as boolean,
    promotionId: row.promotion_id as string | undefined,
  }
}

function rowToPromotion(row: Record<string, unknown>): Promotion {
  return {
    id:              row.id               as string,
    label:           row.label            as string,
    discountPercent: row.discount_percent as number,
    productIds:      row.product_ids      as string[],
    categoryIds:     row.category_ids     as string[],
    startDate:       row.start_date       as string | undefined,
    endDate:         row.end_date         as string | undefined,
  }
}

function rowToContentPage(row: Record<string, unknown>): ContentPage {
  return {
    id:        row.id         as string,
    slug:      row.slug       as string,
    title:     row.title      as string,
    body:      row.body       as string,
    updatedAt: row.updated_at as string,
  }
}

function rowToOrderItem(row: Record<string, unknown>): OrderItem {
  return {
    id:          row.id         as string,
    orderId:     row.order_id   as string,
    productId:   row.product_id as string,
    productName: row.name       as string,
    quantity:    row.quantity   as number,
    unitPrice:   row.price      as number,
    unit:        row.unit       as string,
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

export type { SocialLink }

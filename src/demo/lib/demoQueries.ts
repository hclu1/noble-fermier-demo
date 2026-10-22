// Path: src/demo/lib/demoQueries.ts

import { demoSupabase, isDemoMockMode, type DemoQueryResult } from './demoSupabase'
import type { Product, Category, Promotion, ShopSettings, Branding, Order } from '../../types'
import {
  DEMO_PRODUCTS,
  DEMO_CATEGORIES,
  DEMO_PROMOTIONS,
  DEMO_SHOP_SETTINGS,
  DEMO_BRANDING,
  DEMO_ORDERS,
} from '../data/demoSeedData'

// ─────────────────────────────────────────────
// Requêtes de lecture exclusives au mode démo
//
// 1. Ciblent UNIQUEMENT les tables demo_*
// 2. Ne touchent JAMAIS aux tables de production
// 3. Fallback automatique sur les données d'exemple
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

function rowToCategory(row: Record<string, unknown>): Category {
  return {
    id:       row.id        as string,
    name:     row.name      as string,
    slug:     row.slug      as string,
    imageUrl: row.image_url as string | undefined,
    order:    row.order     as number | undefined,
  }
}

export async function fetchDemoProducts(): Promise<DemoQueryResult<Product[]>> {
  if (isDemoMockMode) {
    return { data: DEMO_PRODUCTS, error: null }
  }

  const { data, error } = await demoSupabase
    .from('demo_products')
    .select('*')
    .order('name')

  if (error || !data || data.length === 0) {
    return { data: DEMO_PRODUCTS, error: null }
  }

  return { data: data.map(rowToProduct), error: null }
}

export async function fetchDemoCategories(): Promise<DemoQueryResult<Category[]>> {
  if (isDemoMockMode) {
    return { data: DEMO_CATEGORIES, error: null }
  }

  const { data, error } = await demoSupabase
    .from('demo_categories')
    .select('*')
    .order('order', { ascending: true })

  if (error || !data || data.length === 0) {
    return { data: DEMO_CATEGORIES, error: null }
  }

  return { data: data.map(rowToCategory), error: null }
}

export async function fetchDemoPromotions(): Promise<DemoQueryResult<Promotion[]>> {
  if (isDemoMockMode) {
    return { data: DEMO_PROMOTIONS, error: null }
  }

  const { data, error } = await demoSupabase
    .from('demo_promotions')
    .select('*')

  if (error || !data || data.length === 0) {
    return { data: DEMO_PROMOTIONS, error: null }
  }

  return {
    data: data.map((row) => ({
      id:              row.id                as string,
      label:           row.label             as string,
      discountPercent: row.discount_percent  as number,
      productIds:      (row.product_ids       as string[] | undefined) ?? [],
      categoryIds:     (row.category_ids      as string[] | undefined) ?? [],
      startDate:       row.start_date        as string | undefined,
      endDate:         row.end_date          as string | undefined,
    })),
    error: null,
  }
}

export async function fetchDemoShopSettings(): Promise<DemoQueryResult<ShopSettings>> {
  if (isDemoMockMode) {
    return { data: DEMO_SHOP_SETTINGS, error: null }
  }

  const { data, error } = await demoSupabase
    .from('demo_shop_settings')
    .select('*')
    .single()

  if (error || !data) {
    return { data: DEMO_SHOP_SETTINGS, error: null }
  }

  return {
    data: {
      name:         data.name,
      tagline:      data.tagline,
      logoUrl:      data.logo_url,
      phone:        data.phone,
      email:        data.email,
      address: {
        street: data.address_street,
        zip:    data.address_zip,
        city:   data.address_city,
      },
      openingHours: (data.opening_hours as string[] | undefined) ?? DEMO_SHOP_SETTINGS.openingHours,
      socialLinks:  (data.social_links  as typeof DEMO_SHOP_SETTINGS.socialLinks | undefined) ?? DEMO_SHOP_SETTINGS.socialLinks,
      primaryColor: data.primary_color,
    },
    error: null,
  }
}

export async function fetchDemoBranding(): Promise<DemoQueryResult<Branding>> {
  if (isDemoMockMode) {
    return { data: DEMO_BRANDING, error: null }
  }

  const { data, error } = await demoSupabase
    .from('demo_branding')
    .select('*')
    .single()

  if (error || !data) {
    return { data: DEMO_BRANDING, error: null }
  }

  return {
    data: {
      primaryColor:    data.primary_color,
      secondaryColor:  data.secondary_color,
      backgroundColor: data.background_color,
      fontHeading:     data.font_heading,
      fontBody:        data.font_body,
      heroImageUrl:    data.hero_image_url,
    },
    error: null,
  }
}

export async function fetchDemoOrders(): Promise<DemoQueryResult<Order[]>> {
  return { data: DEMO_ORDERS, error: null }
}

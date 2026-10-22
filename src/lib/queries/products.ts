// Path: src/lib/queries/products.ts

import { supabase, isMockMode } from '../supabase'
import type { QueryResult } from '../supabase'
import type { Product, Category } from '../../types'
import { mockProducts, mockCategories } from '../../data/mockProducts'

// ─────────────────────────────────────────────
// Requêtes de lecture — produits et catégories
// Utilisées par les pages storefront (catalogue, fiche, accueil)
//
// En mode mock (dev sans .env.local) : retourne les données mock directement.
// En mode Supabase : appelle la base de données réelle.
// ─────────────────────────────────────────────

// ─── Mapping Supabase (snake_case) → TypeScript (camelCase) ───
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

// ─── Lire tous les produits ───
export async function fetchProducts(): Promise<QueryResult<Product[]>> {
  if (isMockMode) return { data: mockProducts, error: null }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name')

  if (error) return { data: null, error: error.message }
  return { data: data.map(rowToProduct), error: null }
}

// ─── Lire les produits vedettes (accueil) ───
export async function fetchFeaturedProducts(): Promise<QueryResult<Product[]>> {
  if (isMockMode) {
    const featured = mockProducts.filter((p) => p.isFeatured && p.isAvailable).slice(0, 6)
    return { data: featured, error: null }
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_available', true)
    .limit(6)

  if (error) return { data: null, error: error.message }
  return { data: data.map(rowToProduct), error: null }
}

// ─── Lire un produit par son slug ───
export async function fetchProductBySlug(slug: string): Promise<QueryResult<Product>> {
  if (isMockMode) {
    const product = mockProducts.find((p) => p.slug === slug)
    if (!product) return { data: null, error: 'Produit introuvable.' }
    return { data: product, error: null }
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return { data: null, error: error.message }
  return { data: rowToProduct(data), error: null }
}

// ─── Lire toutes les catégories ───
export async function fetchCategories(): Promise<QueryResult<Category[]>> {
  if (isMockMode) return { data: mockCategories, error: null }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order')

  if (error) return { data: null, error: error.message }
  return { data: data.map(rowToCategory), error: null }
}

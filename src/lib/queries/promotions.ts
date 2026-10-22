// Path: src/lib/queries/promotions.ts

import { supabase, isMockMode } from '../supabase'
import type { QueryResult } from '../supabase'
import type { Promotion } from '../../types'
import { mockPromotions } from '../../data/mockPromotions'

// ─────────────────────────────────────────────
// Requêtes de lecture — promotions
// ─────────────────────────────────────────────

function rowToPromotion(row: Record<string, unknown>): Promotion {
  return {
    id:              row.id               as string,
    label:           row.label            as string,
    discountPercent: row.discount_percent as number,
    productIds:      row.product_ids      as string[] | undefined,
    categoryIds:     row.category_ids     as string[] | undefined,
    startDate:       row.start_date       as string | undefined,
    endDate:         row.end_date         as string | undefined,
  }
}

// Promotions actives (date en cours ou sans date de fin)
export async function fetchActivePromotions(): Promise<QueryResult<Promotion[]>> {
  if (isMockMode) {
    const today = new Date().toISOString().slice(0, 10)
    const active = mockPromotions.filter(
      (p) => !p.endDate || p.endDate >= today
    )
    return { data: active, error: null }
  }

  const today = new Date().toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .or(`end_date.is.null,end_date.gte.${today}`)
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data: data.map(rowToPromotion), error: null }
}

// Toutes les promotions — pour l'admin
export async function fetchAllPromotions(): Promise<QueryResult<Promotion[]>> {
  if (isMockMode) return { data: mockPromotions, error: null }

  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data: data.map(rowToPromotion), error: null }
}

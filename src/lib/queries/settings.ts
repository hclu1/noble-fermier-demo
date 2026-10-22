// Path: src/lib/queries/settings.ts

import { supabase, isMockMode } from '../supabase'
import type { QueryResult } from '../supabase'
import type { ShopSettings, SocialLink } from '../../types'
import { brandConfig } from '../../config/brandConfig'

// ─────────────────────────────────────────────
// Requêtes de lecture — réglages de la boutique
// La table shop_settings a une seule ligne (id = 1).
// En mode mock : retourne brandConfig directement.
// ─────────────────────────────────────────────

export async function fetchShopSettings(): Promise<QueryResult<ShopSettings>> {
  if (isMockMode) return { data: brandConfig, error: null }

  const { data, error } = await supabase
    .from('shop_settings')
    .select('*')
    .single()

  if (error) return { data: null, error: error.message }

  const settings: ShopSettings = {
    name:         data.name           as string,
    tagline:      data.tagline        as string | undefined,
    logoUrl:      data.logo_url       as string | undefined,
    address: {
      street: data.address_street as string,
      zip:    data.address_zip    as string,
      city:   data.address_city   as string,
    },
    phone:        data.phone          as string | undefined,
    email:        data.email          as string | undefined,
    openingHours: data.opening_hours  as string[],
    socialLinks:  data.social_links   as SocialLink[],
    primaryColor: data.primary_color  as string | undefined,
  }

  return { data: settings, error: null }
}

// Path: src/config/packs.ts

// ─────────────────────────────────────────────
// Définition des packs commerciaux du produit
// Modifier ici pour ajouter/retirer des features
// ─────────────────────────────────────────────

export type PackName = 'basic' | 'pro' | 'premium'

// Liste de toutes les features possibles dans l'application
export type Feature =
  | 'home'
  | 'catalog'
  | 'product'
  | 'contact'
  | 'content'
  | 'promotions'
  | 'banners'
  | 'auth'
  | 'account'
  | 'orderHistory'
  | 'orderStatus'
  | 'cart'
  | 'checkout'
  | 'delivery'
  | 'admin'
  | 'settings'

// Chaque pack active un ensemble de features
export const PACKS: Record<PackName, Feature[]> = {
  basic: [
    'home',
    'catalog',
    'product',
    'contact',
    'admin',
  ],

  pro: [
    'home',
    'catalog',
    'product',
    'contact',
    'content',
    'promotions',
    'banners',
    'auth',
    'account',
    'orderHistory',
    'orderStatus',
    'admin',
    'settings',
  ],

  premium: [
    'home',
    'catalog',
    'product',
    'contact',
    'content',
    'promotions',
    'banners',
    'auth',
    'account',
    'orderHistory',
    'orderStatus',
    'cart',
    'checkout',
    'delivery',
    'admin',
    'settings',
  ],
}

// Pack actif pour ce client — à modifier par client
export const CURRENT_PACK: PackName = 'pro'

// Vérifie si une feature est active dans le pack courant
export function hasFeature(feature: Feature): boolean {
  return PACKS[CURRENT_PACK].includes(feature)
}

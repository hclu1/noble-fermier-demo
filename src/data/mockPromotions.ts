// Path: src/data/mockPromotions.ts

import type { Promotion } from '../types'

// Promotions de démonstration — remplacées par Supabase plus tard
export const mockPromotions: Promotion[] = [
  {
    id: 'promo-1',
    label: 'Fraises -15%',
    discountPercent: 15,
    productIds: ['p-2'],
    categoryIds: [],
    startDate: '2026-03-01',
    endDate:   '2026-04-30',
  },
  {
    id: 'promo-2',
    label: 'Légumes de saison -10%',
    discountPercent: 10,
    productIds: [],
    categoryIds: ['cat-2'],
    startDate: '2026-03-15',
    endDate:   '2026-05-15',
  },
  {
    id: 'promo-3',
    label: 'Panier découverte -5%',
    discountPercent: 5,
    productIds: ['p-11', 'p-12'],
    categoryIds: [],
    startDate: '2026-04-01',
    endDate:   '2026-04-30',
  },
]

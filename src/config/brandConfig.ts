// Path: src/config/brandConfig.ts

import type { ShopSettings } from '../types'

// ─────────────────────────────────────────────
// Configuration de la boutique Noble Fermier
// À dupliquer et adapter pour chaque client
// ─────────────────────────────────────────────

// Emoji associé à chaque slug de catégorie — personnalisable par client
export const CATEGORY_EMOJIS: Record<string, string> = {
  fruits:  '🍓',
  legumes: '🥦',
  herbes:  '🌿',
  paniers: '🧺',
}

export const brandConfig: ShopSettings = {
  name: 'Noble Fermier',
  tagline: 'Les saveurs de la terre, à votre porte.',
  logoUrl: '', // URL du logo — laisser vide pour afficher l'initiale

  address: {
    street: '12 rue des Maraîchers',
    zip: '69003',
    city: 'Lyon',
  },

  phone: '04 72 00 00 00',
  email: 'bonjour@noblefermier.fr',

  openingHours: [
    'Lundi – Vendredi : 8h – 19h',
    'Samedi : 7h – 14h',
    'Dimanche : Fermé',
  ],

  socialLinks: [
    { platform: 'Instagram', url: 'https://instagram.com/noblefermier' },
    { platform: 'Facebook',  url: 'https://facebook.com/noblefermier' },
  ],
}

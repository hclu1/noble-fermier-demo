// Path: src/types/index.ts

// ─────────────────────────────────────────────
// Types métier partagés dans tout le projet
// ─────────────────────────────────────────────

// ─── Produit ───
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number          // prix en euros
  unit: string           // ex: "kg", "la pièce", "la botte"
  categoryId: string
  imageUrl?: string
  isFeatured?: boolean   // affiché sur l'accueil
  isAvailable?: boolean  // en stock
  promotionId?: string   // lié à une promo active
}

// ─── Catégorie ───
export interface Category {
  id: string
  name: string
  slug: string
  imageUrl?: string
  order?: number         // ordre d'affichage
}

// ─── Promotion ───
export interface Promotion {
  id: string
  label: string          // ex: "Promo -20%"
  discountPercent: number
  productIds?: string[]  // si vide : s'applique à tout
  categoryIds?: string[]
  startDate?: string
  endDate?: string
}

// ─── Client (profil utilisateur) ───
export interface Profile {
  id: string             // correspond à auth.users.id dans Supabase
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: {
    street: string
    zip: string
    city: string
  }
  createdAt: string
}

// ─── Commande ───
export interface Order {
  id: string
  profileId: string
  status: OrderStatus
  items: OrderItem[]
  totalPrice: number
  deliveryMode: 'pickup' | 'delivery'
  note?: string
  createdAt: string
  updatedAt: string
}

export type OrderStatus =
  | 'pending'     // en attente
  | 'confirmed'   // confirmée
  | 'ready'       // prête à récupérer
  | 'delivered'   // livrée
  | 'cancelled'   // annulée

// ─── Ligne de commande ───
export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string    // copie du nom au moment de la commande
  quantity: number
  unitPrice: number
  unit: string
}

// ─── Page de contenu ───
export interface ContentPage {
  id: string
  slug: string           // ex: "a-propos", "cgv", "mentions-legales"
  title: string
  body: string           // HTML ou markdown
  updatedAt: string
}

// ─── Bannière publicitaire ───
export interface Banner {
  id: string
  imageUrl: string
  altText: string
  linkUrl?: string
  position: 'home-top' | 'home-mid' | 'catalog-top'
  isActive: boolean
}

// ─── Réglages boutique ───
export interface ShopSettings {
  name: string
  tagline?: string
  logoUrl?: string
  address: {
    street: string
    zip: string
    city: string
  }
  phone?: string
  email?: string
  openingHours: string[]
  socialLinks: SocialLink[]
  primaryColor?: string    // couleur principale (hex) — modifiable par shop_admin
}

// ─── Branding structurel (platform_admin uniquement) ───
export interface Branding {
  primaryColor: string     // couleur principale par défaut du design system
  secondaryColor: string
  backgroundColor: string
  fontHeading: string      // ex: "Playfair Display"
  fontBody: string         // ex: "Nunito"
  heroImageUrl?: string
}

export interface SocialLink {
  platform: string       // ex: "Facebook", "Instagram"
  url: string
}

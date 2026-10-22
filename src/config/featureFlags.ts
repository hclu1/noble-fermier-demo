// Path: src/config/featureFlags.ts

// ─────────────────────────────────────────────
// Options activables individuellement par client
// S'ajoutent au-dessus du pack choisi
// ─────────────────────────────────────────────

export interface FeatureFlags {
  // Affichage
  showPricesPublicly: boolean    // si false : prix masqués sans connexion
  showStockStatus: boolean       // afficher "en stock" / "rupture"
  showPromoBadges: boolean       // afficher les badges "Promo" sur les cartes

  // Fonctionnel
  enableContactForm: boolean     // formulaire de contact actif
  enableNewsletterSignup: boolean // inscription newsletter dans le footer
  enableProductSearch: boolean   // barre de recherche dans le catalogue

  // Commercial
  enableDelivery: boolean        // option livraison à domicile
  enablePickup: boolean          // option retrait en magasin
  enableMinimumOrder: boolean    // montant minimum de commande
  minimumOrderAmount: number     // montant en euros si enableMinimumOrder
}

// Configuration Noble Fermier
// Modifier ici selon ce qui est activé pour ce client
export const featureFlags: FeatureFlags = {
  showPricesPublicly: true,
  showStockStatus: true,
  showPromoBadges: true,

  enableContactForm: true,
  enableNewsletterSignup: false,
  enableProductSearch: true,

  enableDelivery: false,
  enablePickup: true,
  enableMinimumOrder: false,
  minimumOrderAmount: 0,
}

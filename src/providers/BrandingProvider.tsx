// Path: src/providers/BrandingProvider.tsx

import { useEffect } from 'react'
import { fetchShopSettings } from '../lib/queries/settings'
import { adminFetchBranding } from '../lib/queries/admin'

// ─────────────────────────────────────────────
// BrandingProvider
//
// Se monte une seule fois au démarrage de l'app.
// Lit les couleurs depuis Supabase (ou les mocks) et les injecte
// dans les CSS custom properties de :root.
//
// Priorité des couleurs :
//   1. variables.css        → valeur par défaut (toujours présente)
//   2. branding             → couleurs structurelles du concepteur
//   3. settings.primaryColor → couleur principale du shop_admin (priorité max)
//
// Le rendu n'est pas bloqué : l'app démarre avec les valeurs CSS par défaut
// et les variables sont écrasées dès que les données arrivent.
// ─────────────────────────────────────────────

function setCssVar(name: string, value: string | null | undefined) {
  if (value) document.documentElement.style.setProperty(name, value)
}

export default function BrandingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Lecture en parallèle — branding structurel + réglages boutique
    Promise.all([
      adminFetchBranding(),
      fetchShopSettings(),
    ]).then(([brandingRes, settingsRes]) => {

      // ── Couleurs du branding structurel (platform_admin) ──
      if (brandingRes.data) {
        setCssVar('--color-primary', brandingRes.data.primaryColor)
        setCssVar('--color-cta',     brandingRes.data.secondaryColor)
        setCssVar('--color-bg',      brandingRes.data.backgroundColor)
      }

      // ── Couleur principale du shop_admin (priorité max, écrase le branding) ──
      if (settingsRes.data?.primaryColor) {
        setCssVar('--color-primary', settingsRes.data.primaryColor)
      }
    })
  }, [])

  return <>{children}</>
}

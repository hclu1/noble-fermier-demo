// ══════════════════════════════════════════════════════════════════════════
//  ADMINISTRATION — PERSONNALISATION CLIENT
//  Fichier : src/admin-perso/AdminPersoContext.tsx
//
//  Connexion : utilisateur = Hclu1  |  mot de passe = 3131
//  Accès     : bouton ⚙️ en bas de chaque page du site
//
//  Ce contexte stocke TOUTES les personnalisations dans le localStorage
//  du navigateur. Aucune dépendance à Supabase.
// ══════════════════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'

// ─── Identifiants admin ───────────────────────────────────────────────────
const ADMIN_USERNAME = 'Hclu1'
const ADMIN_PASSWORD = '3131'
const STORAGE_KEY    = 'noble-fermier-perso-v1'

// ─── Types ────────────────────────────────────────────────────────────────

export interface PersoProduct {
  id: string
  name: string
  description: string
  price: number
  unit: string
  imageUrl: string
  categoryId: string
  isFeatured: boolean
  isAvailable: boolean
}

export interface PersoColors {
  primary:    string   // couleur principale (vert)
  primaryLight: string
  cta:        string   // bouton CTA (orange)
  bg:         string   // fond général
  surface:    string   // cartes
  heading:    string   // couleur des titres
  text:       string   // texte courant
}

export interface PersoTexts {
  shopName:       string
  tagline:        string
  heroTitle:      string
  heroSubtitle:   string
  heroEyebrow:    string
  ctaBandText:    string
  heroButtonMain: string
  heroButtonSec:  string
}

export interface PersoData {
  colors:   PersoColors
  texts:    PersoTexts
  products: PersoProduct[]   // liste complète, remplace les données mock si définie
}

// Valeurs par défaut (reprend les valeurs actuelles du site)
export const DEFAULT_COLORS: PersoColors = {
  primary:      '#2D6A4F',
  primaryLight: '#52B788',
  cta:          '#F4845F',
  bg:           '#FEFAE0',
  surface:      '#F8F4E3',
  heading:      '#1B4332',
  text:         '#2C2C2C',
}

export const DEFAULT_TEXTS: PersoTexts = {
  shopName:       'Noble Fermier',
  tagline:        'Les saveurs de la terre, à votre porte.',
  heroTitle:      'La fraîcheur du marché,\nà votre porte.',
  heroSubtitle:   'Les saveurs de la terre, à votre porte.',
  heroEyebrow:    'Primeur local · Lyon',
  ctaBandText:    'Une question ? On est là du lundi au samedi.',
  heroButtonMain: 'Découvrir nos produits',
  heroButtonSec:  'Nous contacter',
}

const DEFAULT_DATA: PersoData = {
  colors:   DEFAULT_COLORS,
  texts:    DEFAULT_TEXTS,
  products: [],   // vide = utilise les données mock d'origine
}

// ─── Contexte ─────────────────────────────────────────────────────────────

interface AdminPersoContextValue {
  isAdminLoggedIn: boolean
  perso: PersoData
  login:  (username: string, password: string) => boolean
  logout: () => void
  saveColors:   (c: PersoColors)   => void
  saveTexts:    (t: PersoTexts)    => void
  saveProducts: (p: PersoProduct[]) => void
  reset: () => void
}

const AdminPersoContext = createContext<AdminPersoContextValue | null>(null)

export function useAdminPerso(): AdminPersoContextValue {
  const ctx = useContext(AdminPersoContext)
  if (!ctx) throw new Error('useAdminPerso doit être utilisé dans <AdminPersoProvider>')
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────

export function AdminPersoProvider({ children }: { children: ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('admin-perso-auth') === 'true'
  })

  const [perso, setPerso] = useState<PersoData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return { ...DEFAULT_DATA, ...JSON.parse(raw) }
    } catch { /* ignore */ }
    return DEFAULT_DATA
  })

  // Applique les CSS variables à chaque changement de couleurs
  useEffect(() => {
    const c = perso.colors
    const root = document.documentElement
    root.style.setProperty('--color-primary',       c.primary)
    root.style.setProperty('--color-primary-light', c.primaryLight)
    root.style.setProperty('--color-primary-dark',  c.heading)
    root.style.setProperty('--color-cta',           c.cta)
    root.style.setProperty('--color-bg',            c.bg)
    root.style.setProperty('--color-surface',       c.surface)
    root.style.setProperty('--color-heading',       c.heading)
    root.style.setProperty('--color-text',          c.text)
    root.style.setProperty('--color-text-on-dark',  c.bg)
  }, [perso.colors])

  function persist(data: PersoData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setPerso(data)
  }

  function login(username: string, password: string): boolean {
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true)
      sessionStorage.setItem('admin-perso-auth', 'true')
      return true
    }
    return false
  }

  function logout() {
    setIsAdminLoggedIn(false)
    sessionStorage.removeItem('admin-perso-auth')
  }

  const saveColors = useCallback((c: PersoColors) => {
    persist({ ...perso, colors: c })
  }, [perso])

  const saveTexts = useCallback((t: PersoTexts) => {
    persist({ ...perso, texts: t })
  }, [perso])

  const saveProducts = useCallback((p: PersoProduct[]) => {
    persist({ ...perso, products: p })
  }, [perso])

  function reset() {
    localStorage.removeItem(STORAGE_KEY)
    setPerso(DEFAULT_DATA)
  }

  return (
    <AdminPersoContext.Provider value={{
      isAdminLoggedIn, perso, login, logout,
      saveColors, saveTexts, saveProducts, reset,
    }}>
      {children}
    </AdminPersoContext.Provider>
  )
}

// Path: src/features/auth/AuthContext.tsx

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../types'

// ─────────────────────────────────────────────
// Contexte d'authentification — branché sur Supabase Auth
//
// Supabase gère la session automatiquement (cookies / localStorage).
// onAuthStateChange() écoute les changements de connexion en temps réel.
//
// En développement sans .env.local :
//   - Mode mock activé automatiquement
//   - Login avec marie.dupont@exemple.fr / demo1234
//   - Aucun appel Supabase réel
// ─────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
  profile: Profile
  isAdmin: boolean          // true si shop_admin ou platform_admin
  isPlatformAdmin: boolean  // true uniquement si platform_admin (concepteur SaaS)
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ error: string | null }>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updateProfile: (data: Partial<Profile>) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth() doit être utilisé à l'intérieur de <AuthProvider>")
  return ctx
}

// ─── Détection du mode mock ───
// Actif en développement quand VITE_SUPABASE_URL n'est pas configuré
const isMockMode = import.meta.env.DEV && !import.meta.env.VITE_SUPABASE_URL

// ─── Utilisateur de démonstration ───
// Utilisé uniquement en mode mock (DEV sans Supabase)
const MOCK_USER: AuthUser = {
  id: 'mock-user-1',
  email: 'marie.dupont@exemple.fr',
  isAdmin: true,         // true en mode DEV pour pouvoir tester l'admin sans Supabase
  isPlatformAdmin: true, // true en mode DEV pour tester les sections concepteur
  profile: {
    id: 'mock-user-1',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@exemple.fr',
    phone: '06 00 00 00 00',
    address: {
      street: '8 rue des Lilas',
      zip: '69003',
      city: 'Lyon',
    },
    createdAt: '2026-01-01T00:00:00Z',
  },
}

// ─── Provider ───
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,      setUser]    = useState<AuthUser | null>(null)
  // En mode mock : pas de session à restaurer, on démarre directement sans chargement
  const [isLoading, setLoading] = useState(!isMockMode)

  useEffect(() => {
    // En mode mock, rien à faire : pas de Supabase, isLoading déjà false
    if (isMockMode) return

    // ─── Écoute les changements de session Supabase ───
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const authUser = await buildAuthUser(session.user.id, session.user.email!)
          setUser(authUser)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  // ─── login ───
  async function login(email: string, password: string): Promise<{ error: string | null }> {
    // Mode mock : accepte uniquement les identifiants de démonstration
    if (isMockMode) {
      if (email === MOCK_USER.email && password === 'demo1234') {
        setUser(MOCK_USER)
        return { error: null }
      }
      return { error: 'Identifiants incorrects. En mode démo : marie.dupont@exemple.fr / demo1234' }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  // ─── logout ───
  async function logout(): Promise<void> {
    if (isMockMode) {
      setUser(null)
      return
    }
    await supabase.auth.signOut()
  }

  // ─── resetPassword ───
  async function resetPassword(email: string): Promise<{ error: string | null }> {
    if (isMockMode) {
      // Simule l'envoi en mode mock
      console.info('[Mock] Email de réinitialisation simulé pour :', email)
      return { error: null }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nouveau-mot-de-passe`,
    })
    if (error) return { error: error.message }
    return { error: null }
  }

  // ─── updateProfile ───
  async function updateProfile(data: Partial<Profile>): Promise<{ error: string | null }> {
    if (!user) return { error: 'Non connecté.' }

    // Mode mock : mise à jour locale uniquement (pas de Supabase)
    if (isMockMode) {
      setUser((prev) =>
        prev ? { ...prev, profile: { ...prev.profile, ...data } } : null
      )
      return { error: null }
    }

    // Conversion camelCase → snake_case pour Supabase
    const supabaseData: Record<string, unknown> = {}
    if (data.firstName !== undefined) supabaseData.first_name = data.firstName
    if (data.lastName  !== undefined) supabaseData.last_name  = data.lastName
    if (data.phone     !== undefined) supabaseData.phone      = data.phone
    if (data.address   !== undefined) {
      supabaseData.address_street = data.address.street
      supabaseData.address_zip    = data.address.zip
      supabaseData.address_city   = data.address.city
    }

    const { error } = await supabase
      .from('profiles')
      .update(supabaseData)
      .eq('id', user.id)

    if (error) return { error: error.message }

    setUser((prev) =>
      prev ? { ...prev, profile: { ...prev.profile, ...data } } : null
    )

    return { error: null }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─────────────────────────────────────────────
// Construit un AuthUser à partir de l'id Supabase
// Lit le profil dans la table profiles + vérifie le rôle admin
// Utilisé uniquement quand Supabase est configuré
// ─────────────────────────────────────────────
async function buildAuthUser(userId: string, email: string): Promise<AuthUser> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  const profile: Profile = data
    ? {
        id:        data.id,
        firstName: data.first_name,
        lastName:  data.last_name,
        email:     data.email ?? email,
        phone:     data.phone,
        address: data.address_street
          ? { street: data.address_street, zip: data.address_zip, city: data.address_city }
          : undefined,
        createdAt: data.created_at,
      }
    : {
        id: userId, firstName: '', lastName: '',
        email, createdAt: new Date().toISOString(),
      }

  // Le rôle admin est stocké dans profiles.role
  // La RLS Supabase garantit qu'un non-admin ne peut pas se donner ce rôle
  const isAdmin         = data?.role === 'shop_admin' || data?.role === 'platform_admin'
  const isPlatformAdmin = data?.role === 'platform_admin'

  return { id: userId, email, profile, isAdmin, isPlatformAdmin }
}

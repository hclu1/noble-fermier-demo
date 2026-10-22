// Path: src/features/admin/AdminRoute.tsx

import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

interface AdminRouteProps {
  children: React.ReactNode
}

// Garde de route pour les pages admin
// IMPORTANT : ce check frontend n'est que de l'UX (redirection).
// La vraie sécurité est dans les RLS Supabase côté base de données.
// Un utilisateur non admin ne pourra pas lire/écrire les données même en contournant cette page.
export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Chargement…</p>
      </div>
    )
  }

  // Non connecté → page de connexion
  if (!user) {
    return <Navigate to="/connexion" state={{ from: '/admin' }} replace />
  }

  // Connecté mais pas admin → accueil
  if (!user.isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

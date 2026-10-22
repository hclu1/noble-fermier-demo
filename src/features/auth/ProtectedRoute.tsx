// Path: src/features/auth/ProtectedRoute.tsx

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

// Garde de route — redirige vers /connexion si l'utilisateur n'est pas connecté
// Mémorise l'URL en cours pour y revenir après connexion (param "from")
// Exemple dans App.tsx :
//   <Route path="/mon-compte" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  // On attend que la session soit restaurée depuis le localStorage
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Chargement…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/connexion"
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  return <>{children}</>
}

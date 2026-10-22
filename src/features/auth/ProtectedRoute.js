import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
// Path: src/features/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
// Garde de route — redirige vers /connexion si l'utilisateur n'est pas connecté
// Mémorise l'URL en cours pour y revenir après connexion (param "from")
// Exemple dans App.tsx :
//   <Route path="/mon-compte" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
export default function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuth();
    const location = useLocation();
    // On attend que la session soit restaurée depuis le localStorage
    if (isLoading) {
        return (_jsx("div", { style: { display: 'flex', justifyContent: 'center', padding: '4rem' }, children: _jsx("p", { style: { color: 'var(--color-text-muted)' }, children: "Chargement\u2026" }) }));
    }
    if (!user) {
        return (_jsx(Navigate, { to: "/connexion", state: { from: location.pathname }, replace: true }));
    }
    return _jsx(_Fragment, { children: children });
}

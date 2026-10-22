import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
// Path: src/features/admin/AdminRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
// Garde de route pour les pages admin
// IMPORTANT : ce check frontend n'est que de l'UX (redirection).
// La vraie sécurité est dans les RLS Supabase côté base de données.
// Un utilisateur non admin ne pourra pas lire/écrire les données même en contournant cette page.
export default function AdminRoute({ children }) {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return (_jsx("div", { style: { display: 'flex', justifyContent: 'center', padding: '4rem' }, children: _jsx("p", { style: { color: 'var(--color-text-muted)' }, children: "Chargement\u2026" }) }));
    }
    // Non connecté → page de connexion
    if (!user) {
        return _jsx(Navigate, { to: "/connexion", state: { from: '/admin' }, replace: true });
    }
    // Connecté mais pas admin → accueil
    if (!user.isAdmin) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}

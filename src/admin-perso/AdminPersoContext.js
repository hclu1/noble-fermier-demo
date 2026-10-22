import { jsx as _jsx } from "react/jsx-runtime";
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
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
// ─── Identifiants admin ───────────────────────────────────────────────────
const ADMIN_USERNAME = 'Hclu1';
const ADMIN_PASSWORD = '3131';
const STORAGE_KEY = 'noble-fermier-perso-v1';
// Valeurs par défaut (reprend les valeurs actuelles du site)
export const DEFAULT_COLORS = {
    primary: '#2D6A4F',
    primaryLight: '#52B788',
    cta: '#F4845F',
    bg: '#FEFAE0',
    surface: '#F8F4E3',
    heading: '#1B4332',
    text: '#2C2C2C',
};
export const DEFAULT_TEXTS = {
    shopName: 'Noble Fermier',
    tagline: 'Les saveurs de la terre, à votre porte.',
    heroTitle: 'La fraîcheur du marché,\nà votre porte.',
    heroSubtitle: 'Les saveurs de la terre, à votre porte.',
    heroEyebrow: 'Primeur local · Lyon',
    ctaBandText: 'Une question ? On est là du lundi au samedi.',
    heroButtonMain: 'Découvrir nos produits',
    heroButtonSec: 'Nous contacter',
};
const DEFAULT_DATA = {
    colors: DEFAULT_COLORS,
    texts: DEFAULT_TEXTS,
    products: [], // vide = utilise les données mock d'origine
};
const AdminPersoContext = createContext(null);
export function useAdminPerso() {
    const ctx = useContext(AdminPersoContext);
    if (!ctx)
        throw new Error('useAdminPerso doit être utilisé dans <AdminPersoProvider>');
    return ctx;
}
// ─── Provider ─────────────────────────────────────────────────────────────
export function AdminPersoProvider({ children }) {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
        return sessionStorage.getItem('admin-perso-auth') === 'true';
    });
    const [perso, setPerso] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw)
                return { ...DEFAULT_DATA, ...JSON.parse(raw) };
        }
        catch { /* ignore */ }
        return DEFAULT_DATA;
    });
    // Applique les CSS variables à chaque changement de couleurs
    useEffect(() => {
        const c = perso.colors;
        const root = document.documentElement;
        root.style.setProperty('--color-primary', c.primary);
        root.style.setProperty('--color-primary-light', c.primaryLight);
        root.style.setProperty('--color-primary-dark', c.heading);
        root.style.setProperty('--color-cta', c.cta);
        root.style.setProperty('--color-bg', c.bg);
        root.style.setProperty('--color-surface', c.surface);
        root.style.setProperty('--color-heading', c.heading);
        root.style.setProperty('--color-text', c.text);
        root.style.setProperty('--color-text-on-dark', c.bg);
    }, [perso.colors]);
    function persist(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setPerso(data);
    }
    function login(username, password) {
        if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            setIsAdminLoggedIn(true);
            sessionStorage.setItem('admin-perso-auth', 'true');
            return true;
        }
        return false;
    }
    function logout() {
        setIsAdminLoggedIn(false);
        sessionStorage.removeItem('admin-perso-auth');
    }
    const saveColors = useCallback((c) => {
        persist({ ...perso, colors: c });
    }, [perso]);
    const saveTexts = useCallback((t) => {
        persist({ ...perso, texts: t });
    }, [perso]);
    const saveProducts = useCallback((p) => {
        persist({ ...perso, products: p });
    }, [perso]);
    function reset() {
        localStorage.removeItem(STORAGE_KEY);
        setPerso(DEFAULT_DATA);
    }
    return (_jsx(AdminPersoContext.Provider, { value: {
            isAdminLoggedIn, perso, login, logout,
            saveColors, saveTexts, saveProducts, reset,
        }, children: children }));
}

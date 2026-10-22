// Path: src/config/routesConfig.ts
import { hasFeature } from './packs';
// Toutes les routes possibles, dans l'ordre de la nav
// RÈGLE : n'ajouter une route ici que si la page correspondante existe dans App.tsx
const ALL_ROUTES = [
    // ─── Navigation visible dans le header ───
    { path: '/', label: 'Accueil', feature: 'home', showInNav: true },
    { path: '/catalogue', label: 'Catalogue', feature: 'catalog', showInNav: true },
    { path: '/contact', label: 'Contact', feature: 'contact', showInNav: true },
    { path: '/mon-compte', label: 'Mon compte', feature: 'account', showInNav: true },
    // ─── Routes sans lien nav (pages accessibles par URL directe) ───
    { path: '/produit/:slug', label: '', feature: 'product', showInNav: false },
    { path: '/p/:slug', label: '', feature: 'content', showInNav: false },
    { path: '/connexion', label: '', feature: 'auth', showInNav: false },
    { path: '/mes-commandes', label: '', feature: 'orderHistory', showInNav: false },
    { path: '/admin', label: '', feature: 'admin', showInNav: false },
    // ─── À activer quand les pages seront créées (Pack Premium) ───
    // { path: '/panier',    label: 'Panier',    feature: 'cart',     showInNav: true  },
    // { path: '/commande',  label: '',          feature: 'checkout', showInNav: false },
    // { path: '/promotions',label: 'Promos',    feature: 'promotions', showInNav: true },
];
// Routes filtrées selon le pack actif
export const activeRoutes = ALL_ROUTES.filter((r) => hasFeature(r.feature));

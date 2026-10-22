import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// Path: src/features/admin/AdminLayout.tsx
import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { brandConfig } from '../../config/brandConfig';
import styles from './AdminLayout.module.css';
// Layout de l'espace admin — remplace PageLayout pour toutes les pages /admin/*
// Contient : topbar + sidebar desktop + menu mobile + zone de contenu
export default function AdminLayout() {
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const closeMobile = () => setMobileOpen(false);
    return (_jsxs("div", { className: styles.shell, children: [_jsxs("header", { className: styles.topbar, children: [_jsxs("div", { className: styles.topbarLeft, children: [_jsx("button", { className: styles.menuToggle, onClick: () => setMobileOpen((prev) => !prev), "aria-label": mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu', "aria-expanded": mobileOpen, children: mobileOpen ? '✕' : '☰' }), _jsxs(Link, { to: "/admin/produits", className: styles.brand, children: [_jsx("span", { className: styles.brandIcon, children: "\uD83C\uDF3F" }), _jsxs("span", { className: styles.brandName, children: ["Admin \u2014 ", brandConfig.name] })] })] }), _jsxs("div", { className: styles.topbarRight, children: [_jsx("span", { className: styles.userEmail, children: user?.email }), _jsx(Link, { to: "/", className: styles.siteLink, children: "Voir le site \u2192" }), _jsx("button", { className: styles.logoutBtn, onClick: () => logout(), children: "D\u00E9connexion" })] })] }), _jsxs("div", { className: styles.body, children: [_jsxs("nav", { className: `${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`, "aria-label": "Navigation admin", children: [_jsx("p", { className: styles.sidebarLabel, children: "Gestion" }), _jsx(NavLink, { to: "/admin/commandes", className: navClass, onClick: closeMobile, children: "\uD83D\uDCCB Commandes" }), _jsx(NavLink, { to: "/admin/produits", className: navClass, onClick: closeMobile, children: "\uD83D\uDCE6 Produits" }), _jsx(NavLink, { to: "/admin/promotions", className: navClass, onClick: closeMobile, children: "\uD83C\uDFF7\uFE0F Promotions" }), _jsx(NavLink, { to: "/admin/contenu", className: navClass, onClick: closeMobile, children: "\uD83D\uDCC4 Contenu" }), _jsx(NavLink, { to: "/admin/reglages", className: navClass, onClick: closeMobile, children: "\u2699\uFE0F R\u00E9glages" }), user?.isPlatformAdmin && (_jsxs(_Fragment, { children: [_jsx("p", { className: `${styles.sidebarLabel} ${styles.sidebarLabelTop}`, children: "Concepteur" }), _jsx(NavLink, { to: "/admin/branding", className: navClass, onClick: closeMobile, children: "\uD83C\uDFA8 Branding" })] })), _jsxs("div", { className: styles.mobileFooter, children: [_jsx(Link, { to: "/", className: styles.mobileSiteLink, onClick: closeMobile, children: "Voir le site \u2192" }), _jsx("button", { className: styles.mobileLogout, onClick: () => { logout(); closeMobile(); }, children: "D\u00E9connexion" })] })] }), mobileOpen && (_jsx("div", { className: styles.overlay, onClick: closeMobile, "aria-hidden": "true" })), _jsx("main", { className: styles.main, children: _jsx(Outlet, {}) })] })] }));
}
// Classe CSS active/inactive pour les liens de la sidebar
function navClass({ isActive }) {
    return isActive
        ? `${styles.navLink} ${styles.active}`
        : styles.navLink;
}

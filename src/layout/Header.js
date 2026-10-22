import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/layout/Header.tsx
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../features/cart/CartContext';
import { brandConfig } from '../config/brandConfig';
import { activeRoutes } from '../config/routesConfig';
import Container from './Container';
import styles from './Header.module.css';
// Header principal de la boutique
// Navigation dynamique selon les routes activées dans routesConfig
export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    // On ne garde que les routes marquées comme visibles dans la nav
    const navLinks = activeRoutes.filter((r) => r.showInNav);
    const { totalItems } = useCart();
    return (_jsx("header", { className: styles.header, children: _jsxs(Container, { children: [_jsxs("div", { className: styles.inner, children: [_jsxs(Link, { to: "/", className: styles.brand, children: [brandConfig.logoUrl ? (_jsx("img", { src: brandConfig.logoUrl, alt: brandConfig.name, className: styles.logo })) : (_jsx("span", { className: styles.logoPlaceholder, children: brandConfig.name.charAt(0) })), _jsx("span", { className: styles.brandName, children: brandConfig.name })] }), _jsx("nav", { className: styles.nav, "aria-label": "Navigation principale", children: navLinks.map((route) => (_jsx(NavLink, { to: route.path, className: ({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink, children: route.label }, route.path))) }), _jsxs("div", { className: styles.actions, children: [_jsxs(Link, { to: "/panier", className: styles.cartLink, "aria-label": "Voir le panier", children: [_jsx("span", { className: styles.cartIcon, children: "\uD83D\uDED2" }), totalItems > 0 && (_jsx("span", { className: styles.cartBadge, children: totalItems }))] }), _jsx("button", { className: styles.menuButton, onClick: () => setMenuOpen((prev) => !prev), "aria-label": menuOpen ? 'Fermer le menu' : 'Ouvrir le menu', "aria-expanded": menuOpen, children: _jsx("span", { className: styles.hamburger }) })] })] }), menuOpen && (_jsx("nav", { className: styles.mobileNav, "aria-label": "Menu mobile", children: navLinks.map((route) => (_jsx(NavLink, { to: route.path, className: ({ isActive }) => isActive ? `${styles.mobileLink} ${styles.active}` : styles.mobileLink, onClick: () => setMenuOpen(false), children: route.label }, route.path))) }))] }) }));
}

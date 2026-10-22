import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/demo/components/DemoHeader.tsx
import { Link, useLocation } from 'react-router-dom';
import styles from './DemoHeader.module.css';
export default function DemoHeader() {
    const location = useLocation();
    const prefix = location.pathname.startsWith('/demo') ? '/demo' : '';
    function isActive(path) {
        const target = prefix ? `${prefix}${path === '/' ? '' : path}` : path;
        if (path === '/' && (location.pathname === '/' || location.pathname === '/demo' || location.pathname === '/demo/'))
            return true;
        if (path !== '/' && location.pathname.startsWith(target))
            return true;
        return false;
    }
    return (_jsx("header", { className: styles.header, children: _jsxs("div", { className: styles.inner, children: [_jsxs(Link, { to: prefix ? `${prefix}` : '/', className: styles.brand, children: [_jsx("span", { className: styles.logoIcon, children: "\uD83E\uDDFA" }), _jsx("span", { className: styles.brandName, children: "Noble Fermier \u2014 Mode D\u00E9mo" })] }), _jsxs("nav", { className: styles.nav, "aria-label": "Navigation d\u00E9mo", children: [_jsx(Link, { to: prefix ? `${prefix}` : '/', className: `${styles.navLink} ${isActive('/') ? styles.active : ''}`, children: "Accueil" }), _jsx(Link, { to: `${prefix}/catalogue`, className: `${styles.navLink} ${isActive('/catalogue') || location.pathname.includes('/produit') ? styles.active : ''}`, children: "Catalogue & Rayons" }), _jsx(Link, { to: `${prefix}/commandes`, className: `${styles.navLink} ${isActive('/commandes') ? styles.active : ''}`, children: "Suivi Commandes" }), _jsx(Link, { to: `${prefix}/contact`, className: `${styles.navLink} ${isActive('/contact') ? styles.active : ''}`, children: "Horaires & Contact" })] }), _jsx("div", { className: styles.actions, children: _jsxs(Link, { to: `${prefix}/admin-preview`, className: styles.adminBtn, children: [_jsx("span", { children: "\u2699\uFE0F" }), " Aper\u00E7u Admin"] }) })] }) }));
}

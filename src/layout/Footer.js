import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/layout/Footer.tsx
import { Link } from 'react-router-dom';
import { brandConfig } from '../config/brandConfig';
import { APP_VERSION } from '../config/appConfig';
import Container from './Container';
import AdminGearButton from '../admin-perso/AdminGearButton';
import styles from './Footer.module.css';
// Footer de la boutique
// Affiche les infos du magasin depuis brandConfig
export default function Footer() {
    const year = new Date().getFullYear();
    return (_jsx("footer", { className: styles.footer, children: _jsxs(Container, { children: [_jsxs("div", { className: styles.grid, children: [_jsxs("div", { className: styles.column, children: [_jsx("p", { className: styles.brandName, children: brandConfig.name }), _jsx("p", { className: styles.tagline, children: brandConfig.tagline }), brandConfig.address && (_jsxs("address", { className: styles.address, children: [brandConfig.address.street, _jsx("br", {}), brandConfig.address.zip, " ", brandConfig.address.city] })), brandConfig.phone && (_jsx("a", { href: `tel:${brandConfig.phone}`, className: styles.contact, children: brandConfig.phone }))] }), brandConfig.openingHours && (_jsxs("div", { className: styles.column, children: [_jsx("p", { className: styles.columnTitle, children: "Horaires" }), brandConfig.openingHours.map((line, i) => (_jsx("p", { className: styles.hours, children: line }, i)))] })), _jsxs("div", { className: styles.column, children: [_jsx("p", { className: styles.columnTitle, children: "Informations" }), _jsxs("nav", { "aria-label": "Liens l\u00E9gaux", children: [_jsx(Link, { to: "/contact", className: styles.footerLink, children: "Contact" }), _jsx(Link, { to: "/mentions-legales", className: styles.footerLink, children: "Mentions l\u00E9gales" }), _jsx(Link, { to: "/confidentialite", className: styles.footerLink, children: "Confidentialit\u00E9" })] })] })] }), _jsxs("div", { className: styles.bottom, children: [_jsxs("p", { className: styles.copyright, children: ["\u00A9 ", year, " ", brandConfig.name, ". Tous droits r\u00E9serv\u00E9s.", _jsxs("span", { className: styles.version, children: ["v", APP_VERSION] })] }), brandConfig.socialLinks && brandConfig.socialLinks.length > 0 && (_jsx("div", { className: styles.socials, children: brandConfig.socialLinks.map((social) => (_jsx("a", { href: social.url, className: styles.socialLink, target: "_blank", rel: "noopener noreferrer", "aria-label": social.platform, children: social.platform }, social.platform))) })), _jsx("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: _jsx(AdminGearButton, {}) })] })] }) }));
}

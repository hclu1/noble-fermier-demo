import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/demo/components/DemoBanner.tsx
import styles from './DemoBanner.module.css';
export default function DemoBanner() {
    const appalacarteUrl = import.meta.env.VITE_APPALACARTE_URL || 'https://appalacarte.fr';
    return (_jsx("aside", { className: styles.banner, "aria-label": "Banni\u00E8re d\u2019information mode d\u00E9mo", children: _jsxs("div", { className: styles.inner, children: [_jsxs("div", { className: styles.left, children: [_jsx("span", { className: styles.badge, children: "D\u00E9mo" }), _jsxs("span", { className: styles.text, children: ["Mode d\u00E9mo \u2014 ", _jsx("span", { className: styles.highlight, children: "donn\u00E9es d\u2019exemple" })] })] }), _jsx("div", { className: styles.right, children: _jsx("a", { href: appalacarteUrl, target: "_blank", rel: "noopener noreferrer", className: styles.backBtn, title: "Revenir vers le catalogue de vitrines Appalacarte", children: "\u2190 Retour \u00E0 Appalacarte" }) })] }) }));
}

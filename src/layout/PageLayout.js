import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/layout/PageLayout.tsx
import Header from './Header';
import Footer from './Footer';
import styles from './PageLayout.module.css';
// Enveloppe globale de chaque page
// Toutes les pages passent par ce composant
export default function PageLayout({ children }) {
    return (_jsxs("div", { className: styles.layout, children: [_jsx(Header, {}), _jsx("main", { className: styles.main, children: children }), _jsx(Footer, {})] }));
}

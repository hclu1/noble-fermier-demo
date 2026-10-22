import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/NotFoundPage.tsx
import { Link } from 'react-router-dom';
import Container from '../layout/Container';
import Button from '../components/ui/Button';
import styles from './NotFoundPage.module.css';
// Page 404 — affiché sur toute URL non reconnue
export default function NotFoundPage() {
    return (_jsx(Container, { narrow: true, children: _jsxs("div", { className: styles.page, children: [_jsx("span", { className: styles.code, children: "404" }), _jsx("h1", { className: styles.title, children: "Page introuvable" }), _jsx("p", { className: styles.text, children: "La page que vous cherchez n'existe pas ou a \u00E9t\u00E9 d\u00E9plac\u00E9e." }), _jsx(Link, { to: "/", children: _jsx(Button, { size: "lg", variant: "primary", children: "Retour \u00E0 l'accueil" }) })] }) }));
}

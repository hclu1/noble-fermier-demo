import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/content/ContentPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { fetchContentPageBySlug } from '../../lib/queries/content';
import Container from '../../layout/Container';
import styles from './ContentPage.module.css';
import homeStyles from '../home/HomePage.module.css';
// Résout le slug depuis les paramètres d'URL ou depuis le pathname.
// Gère à la fois /p/:slug et les routes fixes (/mentions-legales, /confidentialite).
function resolveSlug(slug) {
    if (slug)
        return slug;
    return window.location.pathname.replace(/^\//, '');
}
export default function ContentPage() {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const resolvedSlug = resolveSlug(slug);
    useEffect(() => {
        fetchContentPageBySlug(resolvedSlug).then(({ data, error: fetchErr }) => {
            if (fetchErr)
                setError(fetchErr);
            else if (data)
                setPage(data);
            setIsLoading(false);
        });
    }, [resolvedSlug]);
    if (isLoading) {
        return (_jsx(Container, { narrow: true, children: _jsxs("article", { className: styles.article, style: { paddingTop: 'var(--space-8)' }, children: [_jsx("div", { className: `${homeStyles.skeleton}`, style: { height: '40px', width: '60%', marginBottom: 'var(--space-4)' } }), _jsx("div", { className: `${homeStyles.skeleton}`, style: { height: '20px', width: '40%', marginBottom: 'var(--space-8)' } }), Array.from({ length: 5 }).map((_, i) => (_jsx("div", { className: `${homeStyles.skeleton}`, style: { height: '20px', width: '100%', marginBottom: 'var(--space-2)' } }, i)))] }) }));
    }
    if (error) {
        return (_jsx(Container, { narrow: true, children: _jsxs("article", { className: styles.article, style: { padding: 'var(--space-20) 0', textAlign: 'center' }, children: [_jsx("p", { style: { color: 'var(--color-accent)' }, children: error }), _jsx("nav", { className: styles.back, style: { marginTop: 'var(--space-8)', justifyContent: 'center' }, children: _jsx(Link, { to: "/", className: styles.backLink, children: "\u2190 Retour \u00E0 l'accueil" }) })] }) }));
    }
    // Page introuvable → redirection accueil
    if (!page)
        return _jsx(Navigate, { to: "/", replace: true });
    return (_jsx(Container, { narrow: true, children: _jsxs("article", { className: styles.article, children: [_jsx("nav", { className: styles.back, children: _jsx(Link, { to: "/", className: styles.backLink, children: "\u2190 Retour \u00E0 l'accueil" }) }), _jsxs("header", { className: styles.header, children: [_jsx("h1", { className: styles.title, children: page.title }), _jsxs("p", { className: styles.date, children: ["Derni\u00E8re mise \u00E0 jour :", ' ', new Date(page.updatedAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })] })] }), _jsx("div", { className: styles.body, dangerouslySetInnerHTML: { __html: page.body } })] }) }));
}

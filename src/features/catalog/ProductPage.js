import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// Path: src/features/catalog/ProductPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, Navigate } from 'react-router-dom';
import { fetchProductBySlug, fetchCategories } from '../../lib/queries/products';
import { featureFlags } from '../../config/featureFlags';
import { hasFeature } from '../../config/packs';
import Container from '../../layout/Container';
import Button from '../../components/ui/Button';
import styles from './ProductPage.module.css';
import homeStyles from '../home/HomePage.module.css';
export default function ProductPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!slug) {
            setIsLoading(false);
            return;
        }
        Promise.all([
            fetchProductBySlug(slug),
            fetchCategories(),
        ]).then(([prodResult, catResult]) => {
            if (prodResult.error) {
                setError(prodResult.error);
            }
            else if (prodResult.data) {
                setProduct(prodResult.data);
            }
            if (catResult.data)
                setCategories(catResult.data);
            setIsLoading(false);
        });
    }, [slug]);
    if (isLoading) {
        return (_jsx(Container, { children: _jsx("div", { className: styles.page, style: { paddingTop: 'var(--space-8)' }, children: _jsxs("div", { className: styles.layout, children: [_jsx("div", { className: `${homeStyles.skeleton}`, style: { aspectRatio: '1', borderRadius: 'var(--radius-xl)' } }), _jsxs("div", { className: styles.info, children: [_jsx("div", { className: `${homeStyles.skeleton}`, style: { height: '40px', width: '60%' } }), _jsx("div", { className: `${homeStyles.skeleton}`, style: { height: '20px', width: '40%' } }), _jsx("div", { className: `${homeStyles.skeleton}`, style: { height: '20px', width: '30%' } }), _jsx("div", { className: `${homeStyles.skeleton}`, style: { height: '100px', width: '100%', marginTop: 'var(--space-4)' } })] })] }) }) }));
    }
    if (error) {
        return (_jsx(Container, { children: _jsxs("div", { className: styles.page, style: { padding: 'var(--space-20) 0', textAlign: 'center' }, children: [_jsx("p", { style: { color: 'var(--color-accent)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }, children: error }), _jsx(Button, { variant: "secondary", onClick: () => navigate('/catalogue'), children: "Retour au catalogue" })] }) }));
    }
    // Produit introuvable → redirection catalogue
    if (!product)
        return _jsx(Navigate, { to: "/catalogue", replace: true });
    const category = categories.find((c) => c.id === product.categoryId);
    const isUnavailable = product.isAvailable === false;
    return (_jsx(Container, { children: _jsxs("div", { className: styles.page, children: [_jsxs("nav", { className: styles.breadcrumb, "aria-label": "Fil d'Ariane", children: [_jsx(Link, { to: "/", className: styles.breadcrumbLink, children: "Accueil" }), _jsx("span", { className: styles.breadcrumbSep, children: "\u203A" }), _jsx(Link, { to: "/catalogue", className: styles.breadcrumbLink, children: "Catalogue" }), category && (_jsxs(_Fragment, { children: [_jsx("span", { className: styles.breadcrumbSep, children: "\u203A" }), _jsx(Link, { to: `/catalogue?categorie=${category.slug}`, className: styles.breadcrumbLink, children: category.name })] })), _jsx("span", { className: styles.breadcrumbSep, children: "\u203A" }), _jsx("span", { className: styles.breadcrumbCurrent, children: product.name })] }), _jsxs("div", { className: styles.layout, children: [_jsxs("div", { className: styles.imageWrapper, children: [product.imageUrl ? (_jsx("img", { src: product.imageUrl, alt: product.name, className: styles.image })) : (_jsx("div", { className: styles.imagePlaceholder, "aria-hidden": "true", children: _jsx("span", { children: "\uD83E\uDD66" }) })), product.promotionId && featureFlags.showPromoBadges && (_jsx("span", { className: styles.badgePromo, children: "Promotion" }))] }), _jsxs("div", { className: styles.info, children: [category && (_jsx(Link, { to: `/catalogue?categorie=${category.slug}`, className: styles.categoryTag, children: category.name })), _jsx("h1", { className: styles.name, children: product.name }), featureFlags.showStockStatus && (_jsx("p", { className: isUnavailable ? styles.unavailable : styles.available, children: isUnavailable ? '✗ Rupture de stock' : '✓ En stock' })), featureFlags.showPricesPublicly ? (_jsxs("div", { className: styles.priceBlock, children: [_jsxs("span", { className: styles.price, children: [product.price.toFixed(2), " \u20AC"] }), _jsxs("span", { className: styles.unit, children: ["/ ", product.unit] })] })) : (_jsx("p", { className: styles.priceHidden, children: "Prix sur demande" })), _jsx("p", { className: styles.description, children: product.description }), _jsxs("div", { className: styles.actions, children: [hasFeature('cart') ? (_jsx(Button, { size: "lg", variant: "primary", fullWidth: true, disabled: isUnavailable, children: isUnavailable ? 'Indisponible' : 'Ajouter au panier' })) : (_jsx(Button, { size: "lg", variant: "primary", fullWidth: true, onClick: () => navigate('/contact'), children: "Nous contacter pour commander" })), _jsx(Button, { size: "lg", variant: "secondary", fullWidth: true, onClick: () => navigate('/catalogue'), children: "\u2190 Retour au catalogue" })] })] })] })] }) }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/demo/pages/DemoProductPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDemoProducts, fetchDemoPromotions } from '../lib/demoQueries';
import { useDemoContext } from '../context/DemoContext';
import styles from './DemoProductPage.module.css';
export default function DemoProductPage() {
    const { slug } = useParams();
    const { triggerDemoNotice } = useDemoContext();
    const [product, setProduct] = useState(null);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function loadProduct() {
            setLoading(true);
            const [prodRes, promoRes] = await Promise.all([
                fetchDemoProducts(),
                fetchDemoPromotions(),
            ]);
            if (prodRes.data) {
                const found = prodRes.data.find((p) => p.slug === slug);
                setProduct(found || null);
            }
            if (promoRes.data) {
                setPromotions(promoRes.data);
            }
            setLoading(false);
        }
        loadProduct();
    }, [slug]);
    if (loading) {
        return (_jsx("div", { className: styles.container, children: _jsx("div", { style: { textAlign: 'center', padding: '4rem', color: '#6b7280' }, children: "Chargement de la fiche produit..." }) }));
    }
    if (!product) {
        return (_jsx("div", { className: styles.container, children: _jsxs("div", { style: { textAlign: 'center', padding: '4rem' }, children: [_jsx("h2", { children: "Produit non trouv\u00E9" }), _jsx("p", { style: { color: '#6b7280', margin: '1rem 0' }, children: "Ce produit n\u2019existe pas ou a \u00E9t\u00E9 retir\u00E9 des \u00E9tals." }), _jsx(Link, { to: "/catalogue", className: styles.backLink, children: "\u2190 Revenir au catalogue" })] }) }));
    }
    const promo = promotions.find((pr) => pr.productIds && pr.productIds.includes(product.id));
    return (_jsxs("div", { className: styles.container, children: [_jsx(Link, { to: "/catalogue", className: styles.backLink, children: "\u2190 Retour aux rayons primeurs" }), _jsxs("div", { className: styles.layout, children: [_jsxs("div", { className: styles.imageBox, children: [product.imageUrl ? (_jsx("img", { src: product.imageUrl, alt: product.name, className: styles.image })) : (_jsx("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '4rem' }, children: "\uD83E\uDDFA" })), promo && (_jsxs("span", { className: styles.badge, children: ["Promo -", promo.discountPercent, "%"] }))] }), _jsxs("div", { className: styles.details, children: [_jsx("h1", { className: styles.title, children: product.name }), _jsxs("div", { className: styles.priceRow, children: [_jsxs("span", { className: styles.price, children: [product.price.toFixed(2), " \u20AC"] }), _jsxs("span", { className: styles.unit, children: ["TTC / la ", product.unit] })] }), _jsx("p", { className: styles.description, children: product.description || 'Produit frais rigoureusement sélectionné par notre équipe selon arrivage maraîcher.' }), _jsxs("div", { className: styles.guarantees, children: [_jsxs("div", { className: styles.guaranteeItem, children: [_jsx("span", { children: "\uD83C\uDF3F" }), _jsxs("span", { children: [_jsx("strong", { children: "Origine garantie :" }), " Mara\u00EEchage local & r\u00E9colte raisonn\u00E9e"] })] }), _jsxs("div", { className: styles.guaranteeItem, children: [_jsx("span", { children: "\u2744\uFE0F" }), _jsxs("span", { children: [_jsx("strong", { children: "Fra\u00EEcheur :" }), " Livr\u00E9 ou pr\u00E9par\u00E9 sous 24h"] })] }), _jsxs("div", { className: styles.guaranteeItem, children: [_jsx("span", { children: "\u2696\uFE0F" }), _jsxs("span", { children: [_jsx("strong", { children: "Pes\u00E9e pr\u00E9cise :" }), " Ajustement au gramme pr\u00E8s en boutique"] })] })] }), _jsxs("div", { className: styles.btnGroup, children: [_jsxs("button", { type: "button", className: styles.cartBtn, onClick: () => triggerDemoNotice(`Ajout au panier de ${product.name}`), children: [_jsx("span", { children: "\uD83E\uDDFA" }), " Ajouter \u00E0 mon panier (D\u00E9mo)"] }), _jsx("button", { type: "button", className: styles.fastOrderBtn, onClick: () => triggerDemoNotice(`Validation de commande express pour ${product.name}`), children: "\u26A1 Commander en retrait express 2h" })] })] })] })] }));
}

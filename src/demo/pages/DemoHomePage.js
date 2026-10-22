import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/demo/pages/DemoHomePage.tsx
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchDemoProducts, fetchDemoCategories } from '../lib/demoQueries';
import DemoProductCard from '../components/DemoProductCard';
import styles from './DemoHomePage.module.css';
export default function DemoHomePage() {
    const location = useLocation();
    const prefix = location.pathname.startsWith('/demo') ? '/demo' : '';
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const [prodRes, catRes] = await Promise.all([
                fetchDemoProducts(),
                fetchDemoCategories(),
            ]);
            if (prodRes.data) {
                setFeaturedProducts(prodRes.data.filter((p) => p.isFeatured).slice(0, 8));
            }
            if (catRes.data) {
                setCategories(catRes.data);
            }
            setLoading(false);
        }
        loadData();
    }, []);
    return (_jsxs("div", { children: [_jsx("section", { className: styles.hero, children: _jsxs("div", { className: styles.heroContent, children: [_jsx("span", { className: styles.heroTag, children: "\uD83C\uDF31 Fra\u00EEcheur & Terroir en Direct \u00B7 D\u00E9mo Appalacarte" }), _jsx("h1", { className: styles.heroTitle, children: "Noble Fermier \u2014 Mode D\u00E9mo" }), _jsx("p", { className: styles.heroSubtitle, children: "Fruits cueillis \u00E0 maturit\u00E9, l\u00E9gumes de pleine terre et paniers compos\u00E9s. Pr\u00E9sentation interactive de l'application primeur pour votre vitrine." }), _jsxs("div", { className: styles.heroActions, children: [_jsxs(Link, { to: `${prefix}/catalogue`, className: styles.primaryBtn, children: ["D\u00E9couvrir le Catalogue (", featuredProducts.length > 0 ? '28' : '...', " produits)"] }), _jsx(Link, { to: `${prefix}/commandes`, className: styles.secondaryBtn, children: "Voir une commande test" })] })] }) }), _jsxs("section", { className: styles.section, children: [_jsxs("div", { className: styles.sectionHeader, children: [_jsx("h2", { className: styles.sectionTitle, children: "Nos Rayons de Saison" }), _jsx("p", { className: styles.sectionSubtitle, children: "S\u00E9lectionnez une cat\u00E9gorie pour explorer les \u00E9tals" })] }), _jsx("div", { className: styles.categoryGrid, children: categories.map((cat) => (_jsxs(Link, { to: `${prefix}/catalogue?cat=${cat.id}`, className: styles.categoryCard, children: [cat.imageUrl && (_jsx("img", { src: cat.imageUrl, alt: cat.name, className: styles.categoryImg, loading: "lazy" })), _jsx("div", { className: styles.categoryOverlay, children: _jsx("span", { className: styles.categoryName, children: cat.name }) })] }, cat.id))) })] }), _jsxs("section", { className: styles.section, children: [_jsxs("div", { className: styles.sectionHeader, children: [_jsx("h2", { className: styles.sectionTitle, children: "Arrivages & S\u00E9lections du Moment" }), _jsx("p", { className: styles.sectionSubtitle, children: "Les p\u00E9pites de nos producteurs partenaires" })] }), loading ? (_jsx("div", { style: { textAlign: 'center', padding: '3rem', color: '#6b7280' }, children: "Chargement des \u00E9tals..." })) : (_jsx("div", { className: styles.productGrid, children: featuredProducts.map((p) => (_jsx(DemoProductCard, { product: p, promotionLabel: p.promotionId ? 'Offre Découverte' : undefined }, p.id))) }))] }), _jsx("section", { className: styles.valuesBanner, children: _jsxs("div", { className: styles.valuesInner, children: [_jsxs("div", { className: styles.valueItem, children: [_jsx("div", { className: styles.valueIcon, children: "\uD83D\uDE9C" }), _jsx("h4", { children: "100% Circuits Courts" }), _jsx("p", { children: "Partenariats directs avec nos mara\u00EEchers locaux pour une r\u00E9mun\u00E9ration juste." })] }), _jsxs("div", { className: styles.valueItem, children: [_jsx("div", { className: styles.valueIcon, children: "\u2600\uFE0F" }), _jsx("h4", { children: "Cueillette \u00E0 Maturit\u00E9" }), _jsx("p", { children: "Pas de m\u00FBrissement artificiel : le vrai go\u00FBt du soleil dans votre assiette." })] }), _jsxs("div", { className: styles.valueItem, children: [_jsx("div", { className: styles.valueIcon, children: "\uD83E\uDDFA" }), _jsx("h4", { children: "Click & Collect Express" }), _jsx("p", { children: "Vos cagettes pr\u00E9par\u00E9es en 2h chrono et pr\u00EAtes \u00E0 \u00EAtre retir\u00E9es en boutique." })] })] }) })] }));
}

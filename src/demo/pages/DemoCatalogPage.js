import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/demo/pages/DemoCatalogPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchDemoProducts, fetchDemoCategories, fetchDemoPromotions } from '../lib/demoQueries';
import DemoProductCard from '../components/DemoProductCard';
import styles from './DemoCatalogPage.module.css';
export default function DemoCatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const selectedCategoryId = searchParams.get('cat') || 'all';
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const [prodRes, catRes, promoRes] = await Promise.all([
                fetchDemoProducts(),
                fetchDemoCategories(),
                fetchDemoPromotions(),
            ]);
            if (prodRes.data)
                setProducts(prodRes.data);
            if (catRes.data)
                setCategories(catRes.data);
            if (promoRes.data)
                setPromotions(promoRes.data);
            setLoading(false);
        }
        loadData();
    }, []);
    function handleSelectCategory(catId) {
        if (catId === 'all') {
            searchParams.delete('cat');
            setSearchParams(searchParams);
        }
        else {
            setSearchParams({ cat: catId });
        }
    }
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchCat = selectedCategoryId === 'all' || p.categoryId === selectedCategoryId;
            const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchCat && matchSearch;
        });
    }, [products, selectedCategoryId, searchTerm]);
    const promoMap = useMemo(() => {
        const map = new Map();
        promotions.forEach((pr) => {
            if (pr.productIds) {
                pr.productIds.forEach((pid) => map.set(pid, `-${pr.discountPercent}%`));
            }
        });
        return map;
    }, [promotions]);
    return (_jsxs("div", { className: styles.page, children: [_jsxs("header", { className: styles.header, children: [_jsx("h1", { className: styles.title, children: "L\u2019\u00C9tal Primeur & Mara\u00EEcher" }), _jsx("p", { className: styles.subtitle, children: "Fruits, l\u00E9gumes, herbes aromatiques et paniers fra\u00EEcheur en direct de nos producteurs." })] }), _jsxs("div", { className: styles.toolbar, children: [_jsxs("div", { className: styles.searchBox, children: [_jsx("span", { className: styles.searchIcon, children: "\uD83D\uDD0D" }), _jsx("input", { type: "search", placeholder: "Rechercher une vari\u00E9t\u00E9, un fruit, une herbe...", className: styles.searchInput, value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), _jsxs("div", { className: styles.categoryPills, children: [_jsxs("button", { type: "button", className: `${styles.pill} ${selectedCategoryId === 'all' ? styles.activePill : ''}`, onClick: () => handleSelectCategory('all'), children: ["Tous les produits (", products.length, ")"] }), categories.map((c) => (_jsx("button", { type: "button", className: `${styles.pill} ${selectedCategoryId === c.id ? styles.activePill : ''}`, onClick: () => handleSelectCategory(c.id), children: c.name }, c.id)))] })] }), _jsxs("div", { className: styles.countInfo, children: [filteredProducts.length, " r\u00E9f\u00E9rence", filteredProducts.length > 1 ? 's' : '', " disponible", filteredProducts.length > 1 ? 's' : ''] }), loading ? (_jsx("div", { style: { textAlign: 'center', padding: '4rem 1rem', color: '#6b7280' }, children: "Chargement du catalogue d\u00E9mo..." })) : filteredProducts.length === 0 ? (_jsxs("div", { className: styles.emptyState, children: [_jsx("div", { className: styles.emptyIcon, children: "\uD83E\uDD55" }), _jsx("h3", { children: "Aucun produit trouv\u00E9 pour cette recherche" }), _jsx("p", { style: { color: '#6b7280' }, children: "Essayez un autre mot-cl\u00E9 ou r\u00E9initialisez les filtres." }), _jsx("button", { type: "button", className: styles.resetBtn, onClick: () => {
                            setSearchTerm('');
                            handleSelectCategory('all');
                        }, children: "R\u00E9initialiser les filtres" })] })) : (_jsx("div", { className: styles.productGrid, children: filteredProducts.map((p) => (_jsx(DemoProductCard, { product: p, promotionLabel: promoMap.get(p.id) }, p.id))) }))] }));
}

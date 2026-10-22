import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/catalog/CatalogPage.tsx
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../../lib/queries/products';
import { featureFlags } from '../../config/featureFlags';
import Container from '../../layout/Container';
import ProductCard from './components/ProductCard';
import styles from './CatalogPage.module.css';
import homeStyles from '../home/HomePage.module.css';
export default function CatalogPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        Promise.all([
            fetchProducts(),
            fetchCategories()
        ]).then(([prodRes, catRes]) => {
            if (prodRes.error || catRes.error) {
                setError(prodRes.error || catRes.error);
            }
            else {
                if (prodRes.data)
                    setProducts(prodRes.data);
                if (catRes.data)
                    setCategories(catRes.data);
            }
            setIsLoading(false);
        });
    }, []);
    const activeCategorySlug = searchParams.get('categorie') ?? 'all';
    // Filtrage côté client : catégorie + recherche textuelle
    const filteredProducts = useMemo(() => {
        let result = products;
        if (activeCategorySlug !== 'all') {
            const cat = categories.find((c) => c.slug === activeCategorySlug);
            if (cat)
                result = result.filter((p) => p.categoryId === cat.id);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter((p) => p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q));
        }
        return result;
    }, [products, categories, activeCategorySlug, search]);
    function handleCategoryClick(slug) {
        if (slug === 'all')
            searchParams.delete('categorie');
        else
            searchParams.set('categorie', slug);
        setSearchParams(searchParams);
    }
    return (_jsx(Container, { children: _jsxs("div", { className: styles.page, children: [_jsxs("div", { className: styles.header, children: [_jsx("h1", { className: styles.title, children: "Notre catalogue" }), _jsx("p", { className: styles.subtitle, children: "Produits frais, de saison, s\u00E9lectionn\u00E9s chaque matin." })] }), featureFlags.enableProductSearch && (_jsx("div", { className: styles.searchWrapper, children: _jsx("input", { type: "search", placeholder: "Rechercher un produit\u2026", value: search, onChange: (e) => setSearch(e.target.value), className: styles.searchInput, "aria-label": "Rechercher un produit" }) })), _jsxs("div", { className: styles.filters, role: "tablist", "aria-label": "Filtrer par cat\u00E9gorie", children: [_jsx("button", { role: "tab", "aria-selected": activeCategorySlug === 'all', className: `${styles.filterBtn} ${activeCategorySlug === 'all' ? styles.active : ''}`, onClick: () => handleCategoryClick('all'), children: "Tout voir" }), categories.map((cat) => (_jsx("button", { role: "tab", "aria-selected": activeCategorySlug === cat.slug, className: `${styles.filterBtn} ${activeCategorySlug === cat.slug ? styles.active : ''}`, onClick: () => handleCategoryClick(cat.slug), children: cat.name }, cat.id)))] }), _jsx("p", { className: styles.count, children: isLoading ? 'Chargement…' : `${filteredProducts.length} produit${filteredProducts.length !== 1 ? 's' : ''}` }), isLoading ? (_jsx("div", { className: styles.grid, children: Array.from({ length: 6 }).map((_, i) => (_jsx("div", { className: `${homeStyles.skeleton} ${homeStyles.skeletonCard}` }, i))) })) : error ? (_jsx("div", { className: styles.statusError, children: error })) : filteredProducts.length > 0 ? (_jsx("div", { className: styles.grid, children: filteredProducts.map((product) => {
                        const category = categories.find((c) => c.id === product.categoryId);
                        return (_jsx(ProductCard, { product: product, category: category, hasPromo: !!product.promotionId }, product.id));
                    }) })) : (_jsxs("div", { className: styles.empty, children: [_jsx("span", { className: styles.emptyIcon, children: "\uD83D\uDD0D" }), _jsx("p", { children: "Aucun produit trouv\u00E9 pour cette recherche." })] }))] }) }));
}

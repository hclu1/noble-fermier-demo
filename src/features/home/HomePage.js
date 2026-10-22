import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// Path: src/features/home/HomePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFeaturedProducts, fetchCategories } from '../../lib/queries/products';
import { brandConfig, CATEGORY_EMOJIS } from '../../config/brandConfig';
import { useAdminPerso } from '../../admin-perso/AdminPersoContext';
import Container from '../../layout/Container';
import ProductCard from '../catalog/components/ProductCard';
import Button from '../../components/ui/Button';
import styles from './HomePage.module.css';
export default function HomePage() {
    const navigate = useNavigate();
    const { perso } = useAdminPerso();
    const t = perso.texts; // textes personnalisés (ou valeurs par défaut)
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        Promise.all([
            fetchFeaturedProducts(),
            fetchCategories()
        ]).then(([prodRes, catRes]) => {
            if (prodRes.error || catRes.error) {
                setError(prodRes.error || catRes.error);
            }
            else {
                if (prodRes.data)
                    setFeaturedProducts(prodRes.data);
                if (catRes.data)
                    setCategories(catRes.data);
            }
            setIsLoading(false);
        });
    }, []);
    return (_jsxs("div", { className: styles.page, children: [_jsxs("section", { className: styles.hero, children: [_jsx(Container, { children: _jsxs("div", { className: styles.heroContent, children: [_jsx("p", { className: styles.heroEyebrow, children: t.heroEyebrow || `Primeur local · ${brandConfig.address?.city ?? 'France'}` }), _jsx("h1", { className: styles.heroTitle, children: t.heroTitle
                                        ? t.heroTitle.split('\n').map((line, i, arr) => i < arr.length - 1 ? _jsxs("span", { children: [line, _jsx("br", {})] }, i) : _jsx("em", { children: line }, i))
                                        : _jsxs(_Fragment, { children: [_jsx("span", { children: "La fra\u00EEcheur du march\u00E9," }), _jsx("br", {}), _jsx("em", { children: "\u00E0 votre porte." })] }) }), _jsx("p", { className: styles.heroSubtitle, children: t.heroSubtitle || brandConfig.tagline }), _jsxs("div", { className: styles.heroActions, children: [_jsx(Button, { size: "lg", variant: "primary", onClick: () => navigate('/catalogue'), children: t.heroButtonMain || 'Découvrir nos produits' }), _jsx(Button, { size: "lg", variant: "ghost", onClick: () => navigate('/contact'), children: t.heroButtonSec || 'Nous contacter' })] })] }) }), _jsx("div", { className: styles.heroDecor, "aria-hidden": "true", children: "\uD83C\uDF43" })] }), _jsx("section", { className: styles.section, children: _jsxs(Container, { children: [_jsx("h2", { className: styles.sectionTitle, children: "Nos rayons" }), _jsx("p", { className: styles.sectionSubtitle, children: "Du champ \u00E0 votre table \u2014 fruits, l\u00E9gumes, herbes et paniers compos\u00E9s." }), _jsx("div", { className: styles.categoryGrid, children: isLoading ? (Array.from({ length: 4 }).map((_, i) => (_jsx("div", { className: `${styles.categoryCard} ${styles.skeleton}`, style: { height: '120px' } }, i)))) : error ? (_jsx("p", { style: { color: 'var(--color-accent)' }, children: "Impossible de charger les rayons." })) : (categories.map((cat) => (_jsxs("button", { className: styles.categoryCard, onClick: () => navigate(`/catalogue?categorie=${cat.slug}`), children: [cat.imageUrl ? (_jsx("img", { src: cat.imageUrl, alt: cat.name, className: styles.categoryImg, loading: "lazy" })) : (_jsx("span", { className: styles.categoryEmoji, children: CATEGORY_EMOJIS[cat.slug] ?? '🌱' })), _jsx("span", { className: styles.categoryName, children: cat.name })] }, cat.id)))) })] }) }), _jsx("section", { className: `${styles.section} ${styles.sectionAlt}`, children: _jsxs(Container, { children: [_jsxs("div", { className: styles.sectionHeader, children: [_jsxs("div", { children: [_jsx("h2", { className: styles.sectionTitle, children: "Nos coups de c\u0153ur" }), _jsx("p", { className: styles.sectionSubtitle, children: "Une s\u00E9lection du moment, choisie par notre \u00E9quipe." })] }), _jsx(Button, { variant: "secondary", onClick: () => navigate('/catalogue'), children: "Tout voir" })] }), _jsx("div", { className: styles.productGrid, children: isLoading ? (Array.from({ length: 3 }).map((_, i) => (_jsx("div", { className: `${styles.skeleton} ${styles.skeletonCard}` }, i)))) : error ? (_jsx("p", { style: { color: 'var(--color-accent)' }, children: "Impossible de charger les produits." })) : (featuredProducts.map((product) => {
                                const category = categories.find((c) => c.id === product.categoryId);
                                return (_jsx(ProductCard, { product: product, category: category, hasPromo: !!product.promotionId }, product.id));
                            })) })] }) }), _jsx("section", { className: styles.section, children: _jsxs(Container, { children: [_jsxs("h2", { className: styles.sectionTitle, children: ["Pourquoi ", brandConfig.name, " ?"] }), _jsx("div", { className: styles.argumentGrid, children: ARGUMENTS.map((arg) => (_jsxs("div", { className: styles.argumentCard, children: [_jsx("span", { className: styles.argumentIcon, children: arg.icon }), _jsx("h3", { className: styles.argumentTitle, children: arg.title }), _jsx("p", { className: styles.argumentText, children: arg.text })] }, arg.title))) })] }) }), _jsx("section", { className: styles.ctaBand, children: _jsxs(Container, { children: [_jsx("p", { className: styles.ctaText, children: t.ctaBandText || 'Une question ? On est là du lundi au samedi.' }), _jsx(Button, { variant: "primary", size: "lg", onClick: () => navigate('/contact'), children: "Nous \u00E9crire" })] }) })] }));
}
// ─── Argumentaire commercial — générique primeur ───
const ARGUMENTS = [
    {
        icon: '🌱',
        title: 'Produits locaux',
        text: 'Nos producteurs sont sélectionnés dans un rayon de 200 km, pour garantir fraîcheur et traçabilité.',
    },
    {
        icon: '🤝',
        title: 'Circuits courts',
        text: 'Pas d\'intermédiaires. Du producteur à vous, directement. Un prix juste pour tous.',
    },
    {
        icon: '🗓️',
        title: 'Retrait rapide',
        text: 'Commandez avant 18h, votre panier est prêt le lendemain matin dès l\'ouverture.',
    },
    {
        icon: '💚',
        title: 'Saison garantie',
        text: 'Nous ne proposons que des produits de saison. Goût naturel, aucun compromis.',
    },
];

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/demo/pages/DemoAdminPreviewPage.tsx
import { useEffect, useState } from 'react';
import { fetchDemoProducts, fetchDemoCategories } from '../lib/demoQueries';
import { useDemoContext } from '../context/DemoContext';
import styles from './DemoAdminPreviewPage.module.css';
export default function DemoAdminPreviewPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const { triggerDemoNotice } = useDemoContext();
    useEffect(() => {
        async function load() {
            const [pRes, cRes] = await Promise.all([
                fetchDemoProducts(),
                fetchDemoCategories(),
            ]);
            if (pRes.data)
                setProducts(pRes.data);
            if (cRes.data)
                setCategories(cRes.data);
        }
        load();
    }, []);
    const categoryMap = new Map();
    categories.forEach((c) => categoryMap.set(c.id, c.name));
    return (_jsxs("div", { className: styles.page, children: [_jsxs("header", { className: styles.header, children: [_jsxs("div", { children: [_jsx("h1", { className: styles.title, children: "Aper\u00E7u Tableau de Bord G\u00E9rant" }), _jsx("p", { className: styles.subtitle, children: "D\u00E9monstration de l'espace d'administration : catalogue, prix, stocks et r\u00E9approvisionnements." })] }), _jsxs("div", { className: styles.adminBadge, children: [_jsx("span", { children: "\uD83D\uDD12" }), " Lecture Seule (Mode D\u00E9mo)"] })] }), _jsxs("div", { className: styles.statsGrid, children: [_jsxs("div", { className: styles.statCard, children: [_jsx("div", { className: styles.statLabel, children: "R\u00E9f\u00E9rences Actives" }), _jsx("div", { className: styles.statValue, children: products.length })] }), _jsxs("div", { className: styles.statCard, children: [_jsx("div", { className: styles.statLabel, children: "Rayons / Cat\u00E9gories" }), _jsx("div", { className: styles.statValue, children: categories.length })] }), _jsxs("div", { className: styles.statCard, children: [_jsx("div", { className: styles.statLabel, children: "Commandes du Jour (D\u00E9mo)" }), _jsx("div", { className: styles.statValue, children: "12" })] }), _jsxs("div", { className: styles.statCard, children: [_jsx("div", { className: styles.statLabel, children: "Chiffre d\u2019Affaires D\u00E9mo" }), _jsx("div", { className: styles.statValue, children: "384,50 \u20AC" })] })] }), _jsxs("div", { className: styles.tableCard, children: [_jsxs("div", { className: styles.tableHeader, children: [_jsx("h2", { className: styles.tableTitle, children: "Gestion des Articles & Prix de Vente" }), _jsxs("button", { type: "button", className: styles.createBtn, onClick: () => triggerDemoNotice('Création d’un nouvel article'), children: [_jsx("span", { children: "+" }), " Nouvel Article"] })] }), _jsx("div", { style: { overflowX: 'auto' }, children: _jsxs("table", { className: styles.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: styles.th, children: "Article" }), _jsx("th", { className: styles.th, children: "Rayon" }), _jsx("th", { className: styles.th, children: "Prix unitaire" }), _jsx("th", { className: styles.th, children: "Unit\u00E9" }), _jsx("th", { className: styles.th, children: "Statut" }), _jsx("th", { className: styles.th, style: { textAlign: 'right' }, children: "Actions" })] }) }), _jsx("tbody", { children: products.slice(0, 10).map((prod) => (_jsxs("tr", { className: styles.row, children: [_jsx("td", { className: styles.td, children: _jsx("strong", { children: prod.name }) }), _jsx("td", { className: styles.td, children: categoryMap.get(prod.categoryId) || 'Rayon principal' }), _jsx("td", { className: styles.td, children: _jsxs("strong", { children: [prod.price.toFixed(2), " \u20AC"] }) }), _jsx("td", { className: styles.td, children: prod.unit }), _jsx("td", { className: styles.td, children: _jsx("span", { style: { color: '#059669', fontWeight: 600, fontSize: '0.85rem' }, children: "\u25CF En stock" }) }), _jsxs("td", { className: styles.td, style: { textAlign: 'right' }, children: [_jsx("button", { type: "button", className: styles.actionIconBtn, onClick: () => triggerDemoNotice(`Modification du prix de ${prod.name}`), title: "Modifier", children: "\u270F\uFE0F \u00C9diter" }), _jsx("button", { type: "button", className: styles.actionIconBtn, onClick: () => triggerDemoNotice(`Ajustement du stock de ${prod.name}`), title: "Ajuster le stock", children: "\uD83D\uDCE6 Stock" })] })] }, prod.id))) })] }) })] })] }));
}

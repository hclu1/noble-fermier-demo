import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ══════════════════════════════════════════════════════════════════════════
//  PANNEAU PRINCIPAL D'ADMINISTRATION CLIENT
//  Fichier : src/admin-perso/AdminPersoPanel.tsx
//
//  Accessible via : http://localhost:5173/admin-perso
//  Après connexion avec la roue dentée ⚙️ (Hclu1 / 3131)
//
//  Onglets disponibles :
//    🎨 Couleurs      — modifier les couleurs du site en temps réel
//    📝 Textes        — titres, accroche, boutons de la page d'accueil
//    📦 Produits      — nom, prix, description, image de chaque produit
//    🔧 Réinitialiser — revenir aux valeurs par défaut
// ══════════════════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminPerso, DEFAULT_COLORS, DEFAULT_TEXTS, } from './AdminPersoContext';
import { mockProducts, mockCategories } from '../data/mockProducts';
import ImagePicker from './ImagePicker';
import { isLocalImage, getLocalImageKey, loadImageFromDB } from './imageStorage';
import styles from './AdminPersoPanel.module.css';
export default function AdminPersoPanel() {
    const navigate = useNavigate();
    const { isAdminLoggedIn, perso, logout, saveColors, saveTexts, saveProducts } = useAdminPerso();
    const [tab, setTab] = useState('colors');
    // Redirige si pas connecté
    useEffect(() => {
        if (!isAdminLoggedIn)
            navigate('/', { replace: true });
    }, [isAdminLoggedIn, navigate]);
    if (!isAdminLoggedIn)
        return null;
    function handleLogout() {
        logout();
        navigate('/');
    }
    return (_jsxs("div", { className: styles.shell, children: [_jsxs("header", { className: styles.topbar, children: [_jsxs("div", { className: styles.topbarLeft, children: [_jsx("span", { style: { fontSize: '1.4rem' }, children: "\u2699\uFE0F" }), _jsx("span", { className: styles.topbarTitle, children: "Administration \u2014 Personnalisation" })] }), _jsxs("div", { className: styles.topbarRight, children: [_jsx(Link, { to: "/", className: styles.siteLink, children: "\u2190 Voir le site" }), _jsx("button", { className: styles.logoutBtn, onClick: handleLogout, children: "D\u00E9connexion" })] })] }), _jsxs("div", { className: styles.body, children: [_jsxs("nav", { className: styles.sidebar, children: [_jsx("p", { className: styles.sidebarLabel, children: "Personnalisation" }), _jsx(TabBtn, { label: "\uD83C\uDFA8 Couleurs", id: "colors", active: tab, setTab: setTab }), _jsx(TabBtn, { label: "\uD83D\uDCDD Textes", id: "texts", active: tab, setTab: setTab }), _jsx(TabBtn, { label: "\uD83D\uDCE6 Produits", id: "products", active: tab, setTab: setTab }), _jsx("p", { className: styles.sidebarLabel, children: "Outils" }), _jsx(TabBtn, { label: "\uD83D\uDD04 R\u00E9initialiser", id: "reset", active: tab, setTab: setTab })] }), _jsxs("main", { className: styles.main, children: [tab === 'colors' && _jsx(ColorsTab, { colors: perso.colors, save: saveColors }), tab === 'texts' && _jsx(TextsTab, { texts: perso.texts, save: saveTexts }), tab === 'products' && _jsx(ProductsTab, { products: perso.products, save: saveProducts }), tab === 'reset' && _jsx(ResetTab, {})] })] })] }));
}
// ─── Composant bouton onglet ───────────────────────────────────────────────
function TabBtn({ label, id, active, setTab }) {
    return (_jsx("button", { className: `${styles.navBtn} ${active === id ? styles.activeTab : ''}`, onClick: () => setTab(id), children: label }));
}
// ══════════════════════════════════════════════════════════════════════════
//  ONGLET COULEURS
// ══════════════════════════════════════════════════════════════════════════
function ColorsTab({ colors, save }) {
    const [form, setForm] = useState(colors);
    const [saved, setSaved] = useState(false);
    function set(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }
    function handleSave() {
        save(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }
    function handleReset() {
        setForm(DEFAULT_COLORS);
        save(DEFAULT_COLORS);
    }
    const colorFields = [
        { key: 'primary', label: 'Couleur principale', hint: 'Vert de la marque, navbar, titres actifs' },
        { key: 'primaryLight', label: 'Couleur claire', hint: 'Survol, focus, accents doux' },
        { key: 'cta', label: 'Bouton principal (CTA)', hint: 'Orange — appel à l\'action' },
        { key: 'bg', label: 'Fond général', hint: 'Couleur de fond de toute la page' },
        { key: 'surface', label: 'Fond des cartes', hint: 'Cartes produits, panneaux' },
        { key: 'heading', label: 'Couleur des titres', hint: 'H1, H2, H3 du site' },
        { key: 'text', label: 'Texte courant', hint: 'Corps de texte principal' },
    ];
    return (_jsxs("div", { children: [_jsxs("div", { className: styles.pageHeader, children: [_jsx("h1", { className: styles.pageTitle, children: "\uD83C\uDFA8 Couleurs du site" }), _jsx("p", { className: styles.pageSubtitle, children: "Modifiez les couleurs en temps r\u00E9el. Les changements s'affichent imm\u00E9diatement sur le site." })] }), saved && _jsx("p", { className: styles.savedBanner, children: "\u2705 Couleurs enregistr\u00E9es avec succ\u00E8s !" }), _jsxs("div", { className: styles.card, children: [_jsx("h2", { className: styles.cardTitle, children: "\uD83C\uDFA8 Palette de couleurs" }), _jsx("div", { className: styles.grid, children: colorFields.map(({ key, label, hint }) => (_jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: label }), _jsxs("div", { className: styles.colorRow, children: [_jsx("input", { type: "color", className: styles.colorPicker, value: form[key], onChange: (e) => set(key, e.target.value) }), _jsx("input", { className: styles.input, type: "text", value: form[key], onChange: (e) => set(key, e.target.value), placeholder: "#2D6A4F" })] }), _jsx("span", { style: { fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.3)' }, children: hint })] }, key))) }), _jsx("div", { className: styles.colorPreview, style: { background: form.primary, color: form.bg, marginTop: 'var(--space-6)' }, children: "Aper\u00E7u : texte sur fond principal" }), _jsx("div", { className: styles.colorPreview, style: { background: form.cta, color: '#fff' }, children: "Aper\u00E7u : bouton CTA" })] }), _jsxs("div", { className: styles.actionRow, children: [_jsx("button", { className: styles.btnPrimary, onClick: handleSave, children: "\uD83D\uDCBE Enregistrer les couleurs" }), _jsx("button", { className: styles.btnSecondary, onClick: handleReset, children: "R\u00E9initialiser par d\u00E9faut" })] })] }));
}
// ══════════════════════════════════════════════════════════════════════════
//  ONGLET TEXTES
// ══════════════════════════════════════════════════════════════════════════
function TextsTab({ texts, save }) {
    const [form, setForm] = useState(texts);
    const [saved, setSaved] = useState(false);
    function set(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }
    function handleSave() {
        save(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }
    function handleReset() {
        setForm(DEFAULT_TEXTS);
        save(DEFAULT_TEXTS);
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: styles.pageHeader, children: [_jsx("h1", { className: styles.pageTitle, children: "\uD83D\uDCDD Textes du site" }), _jsx("p", { className: styles.pageSubtitle, children: "Modifiez le nom de la boutique, l'accroche, les titres et les boutons de la page d'accueil." })] }), saved && _jsx("p", { className: styles.savedBanner, children: "\u2705 Textes enregistr\u00E9s avec succ\u00E8s !" }), _jsxs("div", { className: styles.card, children: [_jsx("h2", { className: styles.cardTitle, children: "\uD83C\uDFEA Identit\u00E9 de la boutique" }), _jsxs("div", { className: styles.grid, children: [_jsx(TextField, { label: "Nom de la boutique", value: form.shopName, set: (v) => set('shopName', v) }), _jsx(TextField, { label: "Slogan", value: form.tagline, set: (v) => set('tagline', v) })] })] }), _jsxs("div", { className: styles.card, children: [_jsx("h2", { className: styles.cardTitle, children: "\uD83C\uDFE0 Page d'accueil \u2014 Section H\u00E9ro" }), _jsxs("div", { className: styles.grid, children: [_jsx(TextField, { label: "Accroche courte (au-dessus)", value: form.heroEyebrow, set: (v) => set('heroEyebrow', v) }), _jsx(TextField, { label: "Bouton principal", value: form.heroButtonMain, set: (v) => set('heroButtonMain', v) }), _jsxs("div", { className: `${styles.field} ${styles.gridFull}`, children: [_jsx("label", { className: styles.label, children: "Grand titre (h\u00E9ro)" }), _jsx("textarea", { className: `${styles.input} ${styles.textarea}`, value: form.heroTitle, onChange: (e) => set('heroTitle', e.target.value), rows: 3 })] }), _jsxs("div", { className: `${styles.field} ${styles.gridFull}`, children: [_jsx("label", { className: styles.label, children: "Sous-titre (h\u00E9ro)" }), _jsx("textarea", { className: `${styles.input} ${styles.textarea}`, value: form.heroSubtitle, onChange: (e) => set('heroSubtitle', e.target.value), rows: 2 })] }), _jsx(TextField, { label: "Bouton secondaire", value: form.heroButtonSec, set: (v) => set('heroButtonSec', v) }), _jsx(TextField, { label: "Bandeau bas de page", value: form.ctaBandText, set: (v) => set('ctaBandText', v) })] })] }), _jsxs("div", { className: styles.actionRow, children: [_jsx("button", { className: styles.btnPrimary, onClick: handleSave, children: "\uD83D\uDCBE Enregistrer les textes" }), _jsx("button", { className: styles.btnSecondary, onClick: handleReset, children: "R\u00E9initialiser par d\u00E9faut" })] })] }));
}
function TextField({ label, value, set }) {
    return (_jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: label }), _jsx("input", { className: styles.input, type: "text", value: value, onChange: (e) => set(e.target.value) })] }));
}
// ══════════════════════════════════════════════════════════════════════════
//  ONGLET PRODUITS
// ══════════════════════════════════════════════════════════════════════════
function ProductsTab({ products: savedProducts, save, }) {
    // Fusionne les mock avec les overrides sauvegardés
    const baseProducts = mockProducts.map((p) => {
        const override = savedProducts.find((sp) => sp.id === p.id);
        return override ?? {
            id: p.id,
            name: p.name,
            description: p.description ?? '',
            price: p.price,
            unit: p.unit,
            imageUrl: p.imageUrl ?? '',
            categoryId: p.categoryId,
            isFeatured: p.isFeatured ?? false,
            isAvailable: p.isAvailable ?? true,
        };
    });
    const [products, setProducts] = useState(baseProducts);
    const [expanded, setExpanded] = useState(null);
    const [saved, setSaved] = useState(false);
    function update(id, key, value) {
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)));
    }
    function handleSave() {
        save(products);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }
    function getCatName(catId) {
        return mockCategories.find((c) => c.id === catId)?.name ?? '—';
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: styles.pageHeader, children: [_jsx("h1", { className: styles.pageTitle, children: "\uD83D\uDCE6 Produits" }), _jsx("p", { className: styles.pageSubtitle, children: "Cliquez sur un produit pour modifier son nom, prix, description et image." })] }), saved && _jsx("p", { className: styles.savedBanner, children: "\u2705 Produits enregistr\u00E9s avec succ\u00E8s !" }), _jsxs("div", { className: styles.card, children: [_jsxs("h2", { className: styles.cardTitle, children: ["\uD83D\uDCCB Liste des produits (", products.length, ")"] }), _jsx("div", { className: styles.productList, children: products.map((product) => (_jsxs("div", { children: [_jsxs("div", { className: `${styles.productItem} ${expanded === product.id ? styles.expanded : ''}`, onClick: () => setExpanded(expanded === product.id ? null : product.id), children: [_jsx(ProductThumb, { imageUrl: product.imageUrl, name: product.name }), _jsxs("div", { className: styles.productInfo, children: [_jsx("div", { className: styles.productName, children: product.name }), _jsxs("div", { className: styles.productMeta, children: [getCatName(product.categoryId), " \u00B7 ", product.price.toFixed(2), " \u20AC ", product.unit, ' ', _jsx("span", { className: product.isAvailable ? `${styles.badge} ${styles.badgeGreen}` : `${styles.badge} ${styles.badgeRed}`, children: product.isAvailable ? 'En stock' : 'Rupture' })] })] }), _jsx("span", { className: styles.expandIcon, children: "\u203A" })] }), expanded === product.id && (_jsx("div", { className: styles.productForm, children: _jsxs("div", { className: styles.grid, children: [_jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Nom du produit" }), _jsx("input", { className: styles.input, value: product.name, onChange: (e) => update(product.id, 'name', e.target.value) })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Prix (\u20AC)" }), _jsx("input", { className: styles.input, type: "number", step: "0.01", min: "0", value: product.price, onChange: (e) => update(product.id, 'price', parseFloat(e.target.value) || 0) })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Unit\u00E9 (ex : le kg, la pi\u00E8ce)" }), _jsx("input", { className: styles.input, value: product.unit, onChange: (e) => update(product.id, 'unit', e.target.value) })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "En stock" }), _jsxs("select", { className: styles.input, value: product.isAvailable ? 'oui' : 'non', onChange: (e) => update(product.id, 'isAvailable', e.target.value === 'oui'), children: [_jsx("option", { value: "oui", children: "\u2705 En stock" }), _jsx("option", { value: "non", children: "\u274C Rupture de stock" })] })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Produit vedette (accueil)" }), _jsxs("select", { className: styles.input, value: product.isFeatured ? 'oui' : 'non', onChange: (e) => update(product.id, 'isFeatured', e.target.value === 'oui'), children: [_jsx("option", { value: "oui", children: "\u2B50 Affich\u00E9 en vedette" }), _jsx("option", { value: "non", children: "Non affich\u00E9 en vedette" })] })] }), _jsxs("div", { className: `${styles.field} ${styles.gridFull}`, children: [_jsx("label", { className: styles.label, children: "Description" }), _jsx("textarea", { className: `${styles.input} ${styles.textarea}`, rows: 3, value: product.description, onChange: (e) => update(product.id, 'description', e.target.value) })] }), _jsxs("div", { className: `${styles.field} ${styles.gridFull}`, children: [_jsxs("label", { className: styles.label, children: ["\uD83D\uDCF8 Photo du produit", _jsx("span", { style: { fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }, children: "(la photo sera nomm\u00E9e d'apr\u00E8s le nom du produit)" })] }), _jsx(ImagePicker, { productName: product.name, productId: product.id, currentUrl: product.imageUrl, onImageSaved: (url) => update(product.id, 'imageUrl', url) }), _jsxs("details", { style: { marginTop: 'var(--space-3)' }, children: [_jsx("summary", { style: {
                                                                    fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.3)',
                                                                    cursor: 'pointer', userSelect: 'none'
                                                                }, children: "Ou coller une URL d'image externe" }), _jsx("input", { className: styles.input, type: "url", value: isLocalImage(product.imageUrl) ? '' : product.imageUrl, onChange: (e) => update(product.id, 'imageUrl', e.target.value), placeholder: "https://images.unsplash.com/\u2026", style: { marginTop: 'var(--space-2)' } })] })] })] }) }))] }, product.id))) })] }), _jsx("div", { className: styles.actionRow, children: _jsx("button", { className: styles.btnPrimary, onClick: handleSave, children: "\uD83D\uDCBE Enregistrer tous les produits" }) })] }));
}
// ══════════════════════════════════════════════════════════════════════════
//  ONGLET RÉINITIALISER
// ══════════════════════════════════════════════════════════════════════════
function ResetTab() {
    const { reset } = useAdminPerso();
    const navigate = useNavigate();
    const [done, setDone] = useState(false);
    function handleReset() {
        if (window.confirm('Remettre TOUTES les personnalisations à zéro ? Cette action est irréversible.')) {
            reset();
            setDone(true);
            setTimeout(() => navigate('/'), 1500);
        }
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: styles.pageHeader, children: [_jsx("h1", { className: styles.pageTitle, children: "\uD83D\uDD04 R\u00E9initialisation" }), _jsx("p", { className: styles.pageSubtitle, children: "Remet le site \u00E0 ses valeurs d'origine (couleurs, textes, produits)." })] }), done && _jsx("p", { className: styles.savedBanner, children: "\u2705 R\u00E9initialisation effectu\u00E9e. Retour au site\u2026" }), _jsxs("div", { className: styles.card, children: [_jsx("h2", { className: styles.cardTitle, children: "\u26A0\uFE0F Remettre \u00E0 z\u00E9ro" }), _jsxs("p", { style: { color: 'rgba(255,255,255,0.5)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }, children: ["Cette action supprime ", _jsx("strong", { style: { color: '#fff' }, children: "toutes les personnalisations" }), " enregistr\u00E9es dans le navigateur (couleurs, textes, modifications des produits). Elle n'affecte pas les donn\u00E9es Supabase si elles sont configur\u00E9es."] }), _jsx("button", { className: styles.btnDanger, onClick: handleReset, children: "\uD83D\uDDD1\uFE0F R\u00E9initialiser toutes les personnalisations" })] })] }));
}
// ══════════════════════════════════════════════════════════════════════════
//  MINIATURE PRODUIT — Charge l'image depuis IndexedDB si locale
//  Évite de passer des grandes data-URL en props (performance)
// ══════════════════════════════════════════════════════════════════════════
function ProductThumb({ imageUrl, name }) {
    const [src, setSrc] = useState(null);
    useEffect(() => {
        if (!imageUrl) {
            setSrc(null);
            return;
        }
        if (isLocalImage(imageUrl)) {
            loadImageFromDB(getLocalImageKey(imageUrl))
                .then((data) => setSrc(data ?? null))
                .catch(() => setSrc(null));
        }
        else {
            setSrc(imageUrl);
        }
    }, [imageUrl]);
    return (_jsx("div", { className: styles.productThumb, children: src
            ? _jsx("img", { src: src, alt: name, style: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' } })
            : _jsx("span", { children: "\uD83C\uDF3F" }) }));
}

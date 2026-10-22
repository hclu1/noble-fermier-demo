import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/admin/promotions/AdminPromotionsPage.tsx
import { useState, useEffect } from 'react';
import { fetchAllPromotions } from '../../../lib/queries/promotions';
import { fetchProducts, fetchCategories } from '../../../lib/queries/products';
import { adminCreatePromotion, adminUpdatePromotion, adminDeletePromotion } from '../../../lib/queries/admin';
import Button from '../../../components/ui/Button';
import styles from './AdminPromotionsPage.module.css';
const EMPTY_FORM = {
    label: '', discountPercent: 10,
    productIds: [], categoryIds: [],
    startDate: '', endDate: '',
};
export default function AdminPromotionsPage() {
    const [promotions, setPromotions] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    useEffect(() => {
        fetchAllPromotions().then(({ data }) => { if (data)
            setPromotions(data); });
        fetchProducts().then(({ data }) => { if (data)
            setProducts(data); });
        fetchCategories().then(({ data }) => { if (data)
            setCategories(data); });
    }, []);
    const isFormOpen = isAdding || editingId !== null;
    function handleEdit(promo) {
        const { id, ...rest } = promo;
        setForm(rest);
        setEditingId(id);
        setIsAdding(false);
    }
    function handleAdd() {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setIsAdding(true);
    }
    function handleCancel() {
        setEditingId(null);
        setIsAdding(false);
    }
    async function handleSave(e) {
        e.preventDefault();
        if (isAdding) {
            const { data: created } = await adminCreatePromotion(form);
            if (created)
                setPromotions((prev) => [created, ...prev]);
        }
        else if (editingId) {
            const currentId = editingId;
            const { data: updated } = await adminUpdatePromotion(currentId, form);
            if (updated)
                setPromotions((prev) => prev.map((p) => (p.id === currentId ? updated : p)));
        }
        handleCancel();
    }
    async function handleDelete(id) {
        if (!window.confirm('Supprimer cette promotion ?'))
            return;
        const { error } = await adminDeletePromotion(id);
        if (!error)
            setPromotions((prev) => prev.filter((p) => p.id !== id));
    }
    function toggleId(ids, id, checked) {
        return checked ? [...ids, id] : ids.filter((i) => i !== id);
    }
    return (_jsxs("div", { className: styles.page, children: [_jsxs("div", { className: styles.header, children: [_jsxs("div", { children: [_jsx("h1", { className: styles.title, children: "Promotions" }), _jsxs("p", { className: styles.count, children: [promotions.length, " promotion(s)"] })] }), !isFormOpen && (_jsx(Button, { variant: "primary", onClick: handleAdd, children: "+ Ajouter une promotion" }))] }), isFormOpen && (_jsxs("form", { onSubmit: handleSave, className: styles.form, children: [_jsx("h2", { className: styles.formTitle, children: isAdding ? 'Nouvelle promotion' : 'Modifier la promotion' }), _jsxs("div", { className: styles.formGrid, children: [_jsxs("div", { className: `${styles.field} ${styles.fieldFull}`, children: [_jsx("label", { className: styles.label, children: "Libell\u00E9 *" }), _jsx("input", { className: styles.input, required: true, value: form.label, onChange: (e) => setForm((p) => ({ ...p, label: e.target.value })), placeholder: "ex : Fraises -15 %" })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "R\u00E9duction (%)" }), _jsx("input", { className: styles.input, type: "number", min: "1", max: "100", value: form.discountPercent, onChange: (e) => setForm((p) => ({ ...p, discountPercent: parseInt(e.target.value) || 0 })) })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Date de d\u00E9but" }), _jsx("input", { className: styles.input, type: "date", value: form.startDate ?? '', onChange: (e) => setForm((p) => ({ ...p, startDate: e.target.value })) })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Date de fin" }), _jsx("input", { className: styles.input, type: "date", value: form.endDate ?? '', onChange: (e) => setForm((p) => ({ ...p, endDate: e.target.value })) })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Cat\u00E9gories cibl\u00E9es" }), _jsx("div", { className: styles.checkboxGroup, children: categories.map((cat) => (_jsxs("label", { className: styles.checkboxLabel, children: [_jsx("input", { type: "checkbox", checked: (form.categoryIds ?? []).includes(cat.id), onChange: (e) => setForm((p) => ({
                                                        ...p,
                                                        categoryIds: toggleId(p.categoryIds ?? [], cat.id, e.target.checked),
                                                    })) }), cat.name] }, cat.id))) })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Produits cibl\u00E9s" }), _jsx("div", { className: styles.checkboxGroup, children: products.map((prod) => (_jsxs("label", { className: styles.checkboxLabel, children: [_jsx("input", { type: "checkbox", checked: (form.productIds ?? []).includes(prod.id), onChange: (e) => setForm((p) => ({
                                                        ...p,
                                                        productIds: toggleId(p.productIds ?? [], prod.id, e.target.checked),
                                                    })) }), prod.name] }, prod.id))) })] })] }), _jsxs("div", { className: styles.formActions, children: [_jsx(Button, { type: "submit", variant: "primary", children: isAdding ? 'Créer' : 'Enregistrer' }), _jsx(Button, { type: "button", variant: "ghost", onClick: handleCancel, children: "Annuler" })] })] })), _jsxs("div", { className: styles.tableWrapper, children: [_jsxs("table", { className: styles.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: styles.th, children: "Libell\u00E9" }), _jsx("th", { className: styles.th, children: "R\u00E9duction" }), _jsx("th", { className: styles.th, children: "Du" }), _jsx("th", { className: styles.th, children: "Au" }), _jsx("th", { className: styles.th, children: "Cible" }), _jsx("th", { className: styles.th, children: "Actions" })] }) }), _jsx("tbody", { children: promotions.map((promo) => (_jsxs("tr", { className: styles.tr, children: [_jsx("td", { className: styles.td, children: _jsx("span", { className: styles.promoLabel, children: promo.label }) }), _jsx("td", { className: styles.td, children: _jsxs("span", { className: styles.discount, children: ["-", promo.discountPercent, " %"] }) }), _jsx("td", { className: styles.td, children: formatDate(promo.startDate) }), _jsx("td", { className: styles.td, children: formatDate(promo.endDate) }), _jsx("td", { className: styles.td, children: _jsx("span", { className: styles.target, children: buildTargetLabel(promo) }) }), _jsx("td", { className: styles.td, children: _jsxs("div", { className: styles.actions, children: [_jsx(Button, { size: "sm", variant: "secondary", onClick: () => handleEdit(promo), disabled: isFormOpen, children: "Modifier" }), _jsx(Button, { size: "sm", variant: "ghost", onClick: () => handleDelete(promo.id), disabled: isFormOpen, children: "Supprimer" })] }) })] }, promo.id))) })] }), promotions.length === 0 && (_jsx("p", { className: styles.empty, children: "Aucune promotion pour l'instant." }))] })] }));
}
function formatDate(date) {
    if (!date)
        return '—';
    return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}
function buildTargetLabel(promo) {
    const cats = (promo.categoryIds ?? []).length;
    const prods = (promo.productIds ?? []).length;
    if (cats === 0 && prods === 0)
        return 'Tout le catalogue';
    const parts = [];
    if (cats > 0)
        parts.push(`${cats} catégorie(s)`);
    if (prods > 0)
        parts.push(`${prods} produit(s)`);
    return parts.join(', ');
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/admin/products/AdminProductsPage.tsx
import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../../../lib/queries/products';
import { adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '../../../lib/queries/admin';
import { slugify } from '../../../lib/slugify';
import Button from '../../../components/ui/Button';
import styles from './AdminProductsPage.module.css';
const EMPTY_FORM = {
    name: '', slug: '', description: '', price: 0,
    unit: 'le kg', categoryId: '',
    isFeatured: false, isAvailable: true,
};
export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    useEffect(() => {
        fetchProducts().then(({ data }) => { if (data)
            setProducts(data); });
        fetchCategories().then(({ data }) => { if (data)
            setCategories(data); });
    }, []);
    const isFormOpen = isAdding || editingId !== null;
    function handleEdit(product) {
        const { id, ...rest } = product;
        setForm(rest);
        setEditingId(id);
        setIsAdding(false);
    }
    function handleAdd() {
        setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? '' });
        setEditingId(null);
        setIsAdding(true);
    }
    function handleCancel() {
        setEditingId(null);
        setIsAdding(false);
    }
    async function handleSave(e) {
        e.preventDefault();
        const data = { ...form, slug: slugify(form.name) };
        if (isAdding) {
            const { data: created } = await adminCreateProduct(data);
            if (created)
                setProducts((prev) => [...prev, created]);
        }
        else if (editingId) {
            const currentId = editingId;
            const { data: updated } = await adminUpdateProduct(currentId, data);
            if (updated)
                setProducts((prev) => prev.map((p) => (p.id === currentId ? updated : p)));
        }
        handleCancel();
    }
    async function handleDelete(id) {
        if (!window.confirm('Supprimer ce produit ?'))
            return;
        const { error } = await adminDeleteProduct(id);
        if (!error)
            setProducts((prev) => prev.filter((p) => p.id !== id));
    }
    return (_jsxs("div", { className: styles.page, children: [_jsxs("div", { className: styles.header, children: [_jsxs("div", { children: [_jsx("h1", { className: styles.title, children: "Produits" }), _jsxs("p", { className: styles.count, children: [products.length, " produit(s)"] })] }), !isFormOpen && (_jsx(Button, { variant: "primary", onClick: handleAdd, children: "+ Ajouter un produit" }))] }), isFormOpen && (_jsxs("form", { onSubmit: handleSave, className: styles.form, children: [_jsx("h2", { className: styles.formTitle, children: isAdding ? 'Nouveau produit' : 'Modifier le produit' }), _jsxs("div", { className: styles.formGrid, children: [_jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Nom *" }), _jsx("input", { className: styles.input, required: true, value: form.name, onChange: (e) => setForm((p) => ({ ...p, name: e.target.value })), placeholder: "Tomates anciennes" })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Cat\u00E9gorie" }), _jsx("select", { className: styles.input, value: form.categoryId, onChange: (e) => setForm((p) => ({ ...p, categoryId: e.target.value })), children: categories.map((cat) => (_jsx("option", { value: cat.id, children: cat.name }, cat.id))) })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Prix (\u20AC) *" }), _jsx("input", { className: styles.input, type: "number", min: "0", step: "0.01", required: true, value: form.price, onChange: (e) => setForm((p) => ({ ...p, price: parseFloat(e.target.value) || 0 })) })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Unit\u00E9" }), _jsx("input", { className: styles.input, value: form.unit, onChange: (e) => setForm((p) => ({ ...p, unit: e.target.value })), placeholder: "le kg, la pi\u00E8ce\u2026" })] }), _jsxs("div", { className: `${styles.field} ${styles.fieldFull}`, children: [_jsx("label", { className: styles.label, children: "Description" }), _jsx("textarea", { className: styles.input, rows: 3, value: form.description, onChange: (e) => setForm((p) => ({ ...p, description: e.target.value })) })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "URL image" }), _jsx("input", { className: styles.input, type: "url", value: form.imageUrl ?? '', onChange: (e) => setForm((p) => ({ ...p, imageUrl: e.target.value })), placeholder: "https://\u2026" })] }), _jsxs("div", { className: styles.checkboxGroup, children: [_jsxs("label", { className: styles.checkboxLabel, children: [_jsx("input", { type: "checkbox", checked: form.isFeatured ?? false, onChange: (e) => setForm((p) => ({ ...p, isFeatured: e.target.checked })) }), "Produit vedette (affich\u00E9 sur l'accueil)"] }), _jsxs("label", { className: styles.checkboxLabel, children: [_jsx("input", { type: "checkbox", checked: form.isAvailable ?? true, onChange: (e) => setForm((p) => ({ ...p, isAvailable: e.target.checked })) }), "En stock"] })] })] }), _jsxs("div", { className: styles.formActions, children: [_jsx(Button, { type: "submit", variant: "primary", children: isAdding ? 'Créer le produit' : 'Enregistrer' }), _jsx(Button, { type: "button", variant: "ghost", onClick: handleCancel, children: "Annuler" })] })] })), _jsxs("div", { className: styles.tableWrapper, children: [_jsxs("table", { className: styles.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: styles.th, children: "Nom" }), _jsx("th", { className: styles.th, children: "Cat\u00E9gorie" }), _jsx("th", { className: styles.th, children: "Prix" }), _jsx("th", { className: styles.th, children: "Unit\u00E9" }), _jsx("th", { className: styles.th, children: "Vedette" }), _jsx("th", { className: styles.th, children: "Stock" }), _jsx("th", { className: styles.th, children: "Actions" })] }) }), _jsx("tbody", { children: products.map((product) => {
                                    const cat = categories.find((c) => c.id === product.categoryId);
                                    return (_jsxs("tr", { className: styles.tr, children: [_jsx("td", { className: styles.td, children: _jsx("span", { className: styles.productName, children: product.name }) }), _jsx("td", { className: styles.td, children: cat?.name ?? '—' }), _jsxs("td", { className: styles.td, children: [product.price.toFixed(2), " \u20AC"] }), _jsx("td", { className: styles.td, children: product.unit }), _jsx("td", { className: styles.td, children: product.isFeatured
                                                    ? _jsx("span", { className: styles.badgeYes, children: "Oui" })
                                                    : _jsx("span", { className: styles.badgeNo, children: "Non" }) }), _jsx("td", { className: styles.td, children: product.isAvailable !== false
                                                    ? _jsx("span", { className: styles.badgeYes, children: "En stock" })
                                                    : _jsx("span", { className: styles.badgeNo, children: "Rupture" }) }), _jsx("td", { className: styles.td, children: _jsxs("div", { className: styles.actions, children: [_jsx(Button, { size: "sm", variant: "secondary", onClick: () => handleEdit(product), disabled: isFormOpen, children: "Modifier" }), _jsx(Button, { size: "sm", variant: "ghost", onClick: () => handleDelete(product.id), disabled: isFormOpen, children: "Supprimer" })] }) })] }, product.id));
                                }) })] }), products.length === 0 && (_jsx("p", { className: styles.empty, children: "Aucun produit pour l'instant." }))] })] }));
}

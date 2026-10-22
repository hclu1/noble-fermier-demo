import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/admin/content/AdminContentPage.tsx
import { useState, useEffect } from 'react';
import { fetchAllContentPages } from '../../../lib/queries/content';
import { adminCreateContentPage, adminUpdateContentPage, adminDeleteContentPage } from '../../../lib/queries/admin';
import { sanitizeHtml } from '../../../lib/sanitizeHtml';
import { slugify } from '../../../lib/slugify';
import Button from '../../../components/ui/Button';
import styles from './AdminContentPage.module.css';
const EMPTY_FORM = {
    slug: '', title: '', body: '',
};
export default function AdminContentPage() {
    const [pages, setPages] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    useEffect(() => {
        fetchAllContentPages().then(({ data }) => { if (data)
            setPages(data); });
    }, []);
    const isFormOpen = isAdding || editingId !== null;
    function handleEdit(page) {
        setForm({ slug: page.slug, title: page.title, body: page.body });
        setEditingId(page.id);
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
        // Sanitisation du HTML avant sauvegarde (protection XSS)
        const safeForm = { ...form, body: sanitizeHtml(form.body) };
        if (isAdding) {
            const { data: created } = await adminCreateContentPage(safeForm);
            if (created)
                setPages((prev) => [...prev, created]);
        }
        else if (editingId) {
            const currentId = editingId;
            const { data: updated } = await adminUpdateContentPage(currentId, safeForm);
            if (updated)
                setPages((prev) => prev.map((p) => (p.id === currentId ? updated : p)));
        }
        handleCancel();
    }
    async function handleDelete(id) {
        if (!window.confirm('Supprimer cette page de contenu ?'))
            return;
        const { error } = await adminDeleteContentPage(id);
        if (!error)
            setPages((prev) => prev.filter((p) => p.id !== id));
    }
    return (_jsxs("div", { className: styles.page, children: [_jsxs("div", { className: styles.header, children: [_jsxs("div", { children: [_jsx("h1", { className: styles.title, children: "Pages de contenu" }), _jsxs("p", { className: styles.count, children: [pages.length, " page(s)"] })] }), !isFormOpen && (_jsx(Button, { variant: "primary", onClick: handleAdd, children: "+ Ajouter une page" }))] }), isFormOpen && (_jsxs("form", { onSubmit: handleSave, className: styles.form, children: [_jsx("h2", { className: styles.formTitle, children: isAdding ? 'Nouvelle page' : 'Modifier la page' }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Titre *" }), _jsx("input", { className: styles.input, required: true, value: form.title, onChange: (e) => setForm((p) => ({ ...p, title: e.target.value })), placeholder: "\u00C0 propos" })] }), _jsxs("div", { className: styles.field, children: [_jsxs("label", { className: styles.label, children: ["Slug (URL) *", ' ', _jsx("span", { className: styles.labelHint, children: "\u2014 accessible sur /p/votre-slug" })] }), _jsx("input", { className: styles.input, required: true, value: form.slug, onChange: (e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) })), placeholder: "a-propos" })] }), _jsxs("div", { className: styles.field, children: [_jsxs("label", { className: styles.label, children: ["Contenu (HTML)", _jsx("span", { className: styles.labelHint, children: " \u2014 balises h2, p, ul, a autoris\u00E9es" })] }), _jsx("textarea", { className: `${styles.input} ${styles.editor}`, rows: 14, value: form.body, onChange: (e) => setForm((p) => ({ ...p, body: e.target.value })), placeholder: "<p>Votre contenu ici\u2026</p>" })] }), _jsxs("div", { className: styles.formActions, children: [_jsx(Button, { type: "submit", variant: "primary", children: isAdding ? 'Créer la page' : 'Enregistrer' }), _jsx(Button, { type: "button", variant: "ghost", onClick: handleCancel, children: "Annuler" })] })] })), _jsxs("div", { className: styles.tableWrapper, children: [_jsxs("table", { className: styles.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: styles.th, children: "Titre" }), _jsx("th", { className: styles.th, children: "Slug (URL)" }), _jsx("th", { className: styles.th, children: "Derni\u00E8re mise \u00E0 jour" }), _jsx("th", { className: styles.th, children: "Actions" })] }) }), _jsx("tbody", { children: pages.map((page) => (_jsxs("tr", { className: styles.tr, children: [_jsx("td", { className: styles.td, children: _jsx("span", { className: styles.pageTitle, children: page.title }) }), _jsx("td", { className: styles.td, children: _jsxs("code", { className: styles.slug, children: ["/p/", page.slug] }) }), _jsx("td", { className: styles.td, children: new Date(page.updatedAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric', month: 'long', year: 'numeric',
                                            }) }), _jsx("td", { className: styles.td, children: _jsxs("div", { className: styles.actions, children: [_jsx(Button, { size: "sm", variant: "secondary", onClick: () => handleEdit(page), disabled: isFormOpen, children: "Modifier" }), _jsx(Button, { size: "sm", variant: "ghost", onClick: () => handleDelete(page.id), disabled: isFormOpen, children: "Supprimer" })] }) })] }, page.id))) })] }), pages.length === 0 && (_jsx("p", { className: styles.empty, children: "Aucune page de contenu." }))] })] }));
}

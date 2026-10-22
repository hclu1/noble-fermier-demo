import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/admin/settings/AdminSettingsPage.tsx
import { useState, useEffect } from 'react';
import { fetchShopSettings } from '../../../lib/queries/settings';
import { adminUpdateSettings } from '../../../lib/queries/admin';
import { brandConfig } from '../../../config/brandConfig';
import Button from '../../../components/ui/Button';
import styles from './AdminSettingsPage.module.css';
export default function AdminSettingsPage() {
    const [form, setForm] = useState(brandConfig);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    // Charge les réglages depuis Supabase (ou brandConfig en mode mock)
    useEffect(() => {
        fetchShopSettings().then(({ data }) => { if (data)
            setForm(data); });
    }, []);
    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        const { error } = await adminUpdateSettings(form);
        setSaving(false);
        if (!error) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    }
    function updateHour(index, value) {
        const updated = [...form.openingHours];
        updated[index] = value;
        setForm((p) => ({ ...p, openingHours: updated }));
    }
    function addHour() {
        setForm((p) => ({ ...p, openingHours: [...p.openingHours, ''] }));
    }
    function removeHour(index) {
        setForm((p) => ({ ...p, openingHours: p.openingHours.filter((_, i) => i !== index) }));
    }
    function updateSocial(index, field, value) {
        const updated = [...form.socialLinks];
        updated[index] = { ...updated[index], [field]: value };
        setForm((p) => ({ ...p, socialLinks: updated }));
    }
    function addSocial() {
        setForm((p) => ({ ...p, socialLinks: [...p.socialLinks, { platform: '', url: '' }] }));
    }
    function removeSocial(index) {
        setForm((p) => ({ ...p, socialLinks: p.socialLinks.filter((_, i) => i !== index) }));
    }
    return (_jsxs("div", { className: styles.page, children: [_jsxs("div", { className: styles.header, children: [_jsx("h1", { className: styles.title, children: "R\u00E9glages de la boutique" }), _jsx("p", { className: styles.subtitle, children: "Ces informations apparaissent dans le header, le footer et la page contact." })] }), saved && _jsx("p", { className: styles.savedBanner, role: "status", children: "\u2713 R\u00E9glages enregistr\u00E9s." }), _jsxs("form", { onSubmit: handleSubmit, className: styles.form, children: [_jsxs("section", { className: styles.section, children: [_jsx("h2", { className: styles.sectionTitle, children: "Identit\u00E9" }), _jsxs("div", { className: styles.grid, children: [_jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Nom de la boutique *" }), _jsx("input", { className: styles.input, required: true, value: form.name, onChange: (e) => setForm((p) => ({ ...p, name: e.target.value })) })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Slogan" }), _jsx("input", { className: styles.input, value: form.tagline ?? '', onChange: (e) => setForm((p) => ({ ...p, tagline: e.target.value })) })] }), _jsxs("div", { className: `${styles.field} ${styles.fieldFull}`, children: [_jsx("label", { className: styles.label, children: "URL du logo" }), _jsx("input", { className: styles.input, type: "url", value: form.logoUrl ?? '', onChange: (e) => setForm((p) => ({ ...p, logoUrl: e.target.value })), placeholder: "https://\u2026" })] }), _jsxs("div", { className: styles.field, children: [_jsxs("label", { className: styles.label, children: ["Couleur principale", _jsx("span", { className: styles.labelHint, children: " \u2014 boutons et accents (ex : #2D6A4F)" })] }), _jsxs("div", { className: styles.colorRow, children: [_jsx("input", { type: "color", className: styles.colorPicker, value: form.primaryColor ?? '#2D6A4F', onChange: (e) => setForm((p) => ({ ...p, primaryColor: e.target.value })) }), _jsx("input", { className: styles.input, type: "text", value: form.primaryColor ?? '', onChange: (e) => setForm((p) => ({ ...p, primaryColor: e.target.value })), placeholder: "#2D6A4F" })] })] })] })] }), _jsxs("section", { className: styles.section, children: [_jsx("h2", { className: styles.sectionTitle, children: "Contact" }), _jsxs("div", { className: styles.grid, children: [_jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "T\u00E9l\u00E9phone" }), _jsx("input", { className: styles.input, type: "tel", value: form.phone ?? '', onChange: (e) => setForm((p) => ({ ...p, phone: e.target.value })) })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Email" }), _jsx("input", { className: styles.input, type: "email", value: form.email ?? '', onChange: (e) => setForm((p) => ({ ...p, email: e.target.value })) })] })] })] }), _jsxs("section", { className: styles.section, children: [_jsx("h2", { className: styles.sectionTitle, children: "Adresse" }), _jsxs("div", { className: styles.grid, children: [_jsxs("div", { className: `${styles.field} ${styles.fieldFull}`, children: [_jsx("label", { className: styles.label, children: "Rue" }), _jsx("input", { className: styles.input, value: form.address.street, onChange: (e) => setForm((p) => ({ ...p, address: { ...p.address, street: e.target.value } })) })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Code postal" }), _jsx("input", { className: styles.input, value: form.address.zip, onChange: (e) => setForm((p) => ({ ...p, address: { ...p.address, zip: e.target.value } })) })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Ville" }), _jsx("input", { className: styles.input, value: form.address.city, onChange: (e) => setForm((p) => ({ ...p, address: { ...p.address, city: e.target.value } })) })] })] })] }), _jsxs("section", { className: styles.section, children: [_jsx("h2", { className: styles.sectionTitle, children: "Horaires d'ouverture" }), _jsxs("div", { className: styles.listField, children: [form.openingHours.map((line, i) => (_jsxs("div", { className: styles.listRow, children: [_jsx("input", { className: styles.input, value: line, onChange: (e) => updateHour(i, e.target.value), placeholder: "Lundi \u2013 Vendredi : 8h \u2013 19h" }), _jsx("button", { type: "button", className: styles.removeBtn, onClick: () => removeHour(i), "aria-label": "Supprimer", children: "\u2715" })] }, i))), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: addHour, children: "+ Ajouter un horaire" })] })] }), _jsxs("section", { className: styles.section, children: [_jsx("h2", { className: styles.sectionTitle, children: "R\u00E9seaux sociaux" }), _jsxs("div", { className: styles.listField, children: [form.socialLinks.map((social, i) => (_jsxs("div", { className: styles.socialRow, children: [_jsx("input", { className: styles.input, value: social.platform, onChange: (e) => updateSocial(i, 'platform', e.target.value), placeholder: "Instagram" }), _jsx("input", { className: `${styles.input} ${styles.inputUrl}`, type: "url", value: social.url, onChange: (e) => updateSocial(i, 'url', e.target.value), placeholder: "https://\u2026" }), _jsx("button", { type: "button", className: styles.removeBtn, onClick: () => removeSocial(i), "aria-label": "Supprimer", children: "\u2715" })] }, i))), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: addSocial, children: "+ Ajouter un r\u00E9seau" })] })] }), _jsx("div", { className: styles.saveRow, children: _jsx(Button, { type: "submit", size: "lg", variant: "primary", disabled: saving, children: saving ? 'Enregistrement…' : 'Enregistrer les réglages' }) })] })] }));
}

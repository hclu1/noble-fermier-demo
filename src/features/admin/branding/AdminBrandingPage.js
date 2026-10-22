import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/admin/branding/AdminBrandingPage.tsx
import { useState, useEffect } from 'react';
import { adminFetchBranding, adminUpdateBranding } from '../../../lib/queries/admin';
import Button from '../../../components/ui/Button';
import styles from './AdminBrandingPage.module.css';
// Page réservée au platform_admin (concepteur SaaS).
// Permet de modifier les couleurs structurelles, les polices et l'image héro.
// La RLS Supabase bloque toute écriture par un shop_admin, même directe via l'API.
const DEFAULT_BRANDING = {
    primaryColor: '#2D6A4F',
    secondaryColor: '#F4845F',
    backgroundColor: '#FEFAE0',
    fontHeading: 'Playfair Display',
    fontBody: 'Nunito',
    heroImageUrl: '',
};
export default function AdminBrandingPage() {
    const [form, setForm] = useState(DEFAULT_BRANDING);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        adminFetchBranding().then(({ data }) => { if (data)
            setForm(data); });
    }, []);
    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        const { error } = await adminUpdateBranding(form);
        setSaving(false);
        if (error) {
            setError(error);
        }
        else {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    }
    return (_jsxs("div", { className: styles.page, children: [_jsxs("div", { className: styles.header, children: [_jsx("h1", { className: styles.title, children: "Branding" }), _jsx("p", { className: styles.subtitle, children: "Identit\u00E9 visuelle structurelle \u2014 couleurs du design system, polices et image h\u00E9ro." })] }), _jsx("p", { className: styles.notice, children: "\uD83D\uDD12 Cette section est r\u00E9serv\u00E9e au concepteur. Les modifications s'appliquent \u00E0 l'ensemble du site." }), saved && _jsx("p", { className: styles.savedBanner, role: "status", children: "\u2713 Branding enregistr\u00E9." }), error && _jsxs("p", { className: styles.errorBanner, role: "alert", children: ["Erreur : ", error] }), _jsxs("form", { onSubmit: handleSubmit, className: styles.form, children: [_jsxs("section", { className: styles.section, children: [_jsx("h2", { className: styles.sectionTitle, children: "Couleurs" }), _jsxs("div", { className: styles.grid, children: [_jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Couleur primaire" }), _jsxs("div", { className: styles.colorRow, children: [_jsx("input", { type: "color", className: styles.colorPicker, value: form.primaryColor, onChange: (e) => setForm((p) => ({ ...p, primaryColor: e.target.value })) }), _jsx("input", { className: styles.input, type: "text", value: form.primaryColor, onChange: (e) => setForm((p) => ({ ...p, primaryColor: e.target.value })), placeholder: "#2D6A4F" })] })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Couleur secondaire (CTA)" }), _jsxs("div", { className: styles.colorRow, children: [_jsx("input", { type: "color", className: styles.colorPicker, value: form.secondaryColor, onChange: (e) => setForm((p) => ({ ...p, secondaryColor: e.target.value })) }), _jsx("input", { className: styles.input, type: "text", value: form.secondaryColor, onChange: (e) => setForm((p) => ({ ...p, secondaryColor: e.target.value })), placeholder: "#F4845F" })] })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Couleur de fond" }), _jsxs("div", { className: styles.colorRow, children: [_jsx("input", { type: "color", className: styles.colorPicker, value: form.backgroundColor, onChange: (e) => setForm((p) => ({ ...p, backgroundColor: e.target.value })) }), _jsx("input", { className: styles.input, type: "text", value: form.backgroundColor, onChange: (e) => setForm((p) => ({ ...p, backgroundColor: e.target.value })), placeholder: "#FEFAE0" })] })] })] })] }), _jsxs("section", { className: styles.section, children: [_jsx("h2", { className: styles.sectionTitle, children: "Polices" }), _jsx("p", { className: styles.sectionHint, children: "Noms exacts de polices Google Fonts (ex : \"Playfair Display\", \"Nunito\")." }), _jsxs("div", { className: styles.grid, children: [_jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Police des titres" }), _jsx("input", { className: styles.input, value: form.fontHeading, onChange: (e) => setForm((p) => ({ ...p, fontHeading: e.target.value })), placeholder: "Playfair Display" })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Police du corps" }), _jsx("input", { className: styles.input, value: form.fontBody, onChange: (e) => setForm((p) => ({ ...p, fontBody: e.target.value })), placeholder: "Nunito" })] })] })] }), _jsxs("section", { className: styles.section, children: [_jsx("h2", { className: styles.sectionTitle, children: "Image h\u00E9ro" }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "URL de l'image (page d'accueil)" }), _jsx("input", { className: styles.input, type: "url", value: form.heroImageUrl ?? '', onChange: (e) => setForm((p) => ({ ...p, heroImageUrl: e.target.value })), placeholder: "https://\u2026" })] }), form.heroImageUrl && (_jsx("img", { src: form.heroImageUrl, alt: "Aper\u00E7u h\u00E9ro", className: styles.heroPreview }))] }), _jsx("div", { className: styles.saveRow, children: _jsx(Button, { type: "submit", size: "lg", variant: "primary", disabled: saving, children: saving ? 'Enregistrement…' : 'Enregistrer le branding' }) })] })] }));
}

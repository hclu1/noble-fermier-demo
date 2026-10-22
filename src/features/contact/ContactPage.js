import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/contact/ContactPage.tsx
import { useState } from 'react';
import { brandConfig } from '../../config/brandConfig';
import Container from '../../layout/Container';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import styles from './ContactPage.module.css';
// Page contact — formulaire + infos boutique
// Le formulaire est fonctionnel côté UI, l'envoi réel nécessitera Supabase ou un service email
export default function ContactPage() {
    const [status, setStatus] = useState('idle');
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
    });
    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('sending');
        // TODO : envoyer via Supabase Edge Function ou service email
        // Pour l'instant on simule un délai
        await new Promise((r) => setTimeout(r, 800));
        setStatus('success');
    }
    return (_jsx(Container, { children: _jsxs("div", { className: styles.page, children: [_jsxs("div", { className: styles.header, children: [_jsx("h1", { className: styles.title, children: "Nous contacter" }), _jsx("p", { className: styles.subtitle, children: "Une question, une commande sp\u00E9ciale ? On vous r\u00E9pond sous 24h." })] }), _jsxs("div", { className: styles.layout, children: [_jsx("div", { children: status === 'success' ? (_jsxs(Card, { padding: "lg", className: styles.successCard, children: [_jsx("span", { className: styles.successIcon, children: "\u2713" }), _jsx("h2", { className: styles.successTitle, children: "Message envoy\u00E9 !" }), _jsx("p", { children: "Merci pour votre message. Nous vous r\u00E9pondrons dans les meilleurs d\u00E9lais." }), _jsx(Button, { variant: "secondary", onClick: () => {
                                            setStatus('idle');
                                            setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' });
                                        }, children: "Envoyer un autre message" })] })) : (_jsxs("form", { onSubmit: handleSubmit, className: styles.form, noValidate: true, children: [_jsxs("div", { className: styles.row, children: [_jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: "firstName", className: styles.label, children: "Pr\u00E9nom *" }), _jsx("input", { id: "firstName", name: "firstName", type: "text", required: true, value: form.firstName, onChange: handleChange, className: styles.input, placeholder: "Marie" })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: "lastName", className: styles.label, children: "Nom *" }), _jsx("input", { id: "lastName", name: "lastName", type: "text", required: true, value: form.lastName, onChange: handleChange, className: styles.input, placeholder: "Dupont" })] })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: "email", className: styles.label, children: "Email *" }), _jsx("input", { id: "email", name: "email", type: "email", required: true, value: form.email, onChange: handleChange, className: styles.input, placeholder: "marie@exemple.fr" })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: "subject", className: styles.label, children: "Sujet" }), _jsxs("select", { id: "subject", name: "subject", value: form.subject, onChange: handleChange, className: styles.input, children: [_jsx("option", { value: "", children: "Choisir un sujet\u2026" }), _jsx("option", { value: "commande", children: "Question sur une commande" }), _jsx("option", { value: "produit", children: "Information produit" }), _jsx("option", { value: "disponibilite", children: "Disponibilit\u00E9" }), _jsx("option", { value: "autre", children: "Autre" })] })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: "message", className: styles.label, children: "Message *" }), _jsx("textarea", { id: "message", name: "message", required: true, rows: 5, value: form.message, onChange: handleChange, className: `${styles.input} ${styles.textarea}`, placeholder: "Votre message\u2026" })] }), status === 'error' && (_jsx("p", { className: styles.errorMessage, children: "Une erreur est survenue. Veuillez r\u00E9essayer." })), _jsx(Button, { type: "submit", size: "lg", variant: "primary", fullWidth: true, disabled: status === 'sending', children: status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message' })] })) }), _jsx("aside", { className: styles.aside, children: _jsxs(Card, { padding: "lg", children: [_jsx("h2", { className: styles.asideTitle, children: "Retrouvez-nous" }), brandConfig.address && (_jsxs("div", { className: styles.infoBlock, children: [_jsx("span", { className: styles.infoIcon, children: "\uD83D\uDCCD" }), _jsxs("div", { children: [_jsx("p", { className: styles.infoLabel, children: "Adresse" }), _jsx("p", { children: brandConfig.address.street }), _jsxs("p", { children: [brandConfig.address.zip, " ", brandConfig.address.city] })] })] })), brandConfig.phone && (_jsxs("div", { className: styles.infoBlock, children: [_jsx("span", { className: styles.infoIcon, children: "\uD83D\uDCDE" }), _jsxs("div", { children: [_jsx("p", { className: styles.infoLabel, children: "T\u00E9l\u00E9phone" }), _jsx("a", { href: `tel:${brandConfig.phone}`, className: styles.infoLink, children: brandConfig.phone })] })] })), brandConfig.email && (_jsxs("div", { className: styles.infoBlock, children: [_jsx("span", { className: styles.infoIcon, children: "\u2709\uFE0F" }), _jsxs("div", { children: [_jsx("p", { className: styles.infoLabel, children: "Email" }), _jsx("a", { href: `mailto:${brandConfig.email}`, className: styles.infoLink, children: brandConfig.email })] })] })), brandConfig.openingHours && (_jsxs("div", { className: styles.infoBlock, children: [_jsx("span", { className: styles.infoIcon, children: "\uD83D\uDD50" }), _jsxs("div", { children: [_jsx("p", { className: styles.infoLabel, children: "Horaires" }), brandConfig.openingHours.map((line, i) => (_jsx("p", { children: line }, i)))] })] }))] }) })] })] }) }));
}

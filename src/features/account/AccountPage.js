import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/account/AccountPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import Container from '../../layout/Container';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import styles from './AccountPage.module.css';
// Page Mon compte — affichage et édition du profil
// Sections : identité, adresse, sécurité (changement de mot de passe), déconnexion
export default function AccountPage() {
    const { user, logout, updateProfile } = useAuth();
    const [editMode, setEditMode] = useState('none');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    // Formulaire identité
    const [identity, setIdentity] = useState({
        firstName: user?.profile.firstName ?? '',
        lastName: user?.profile.lastName ?? '',
        phone: user?.profile.phone ?? '',
    });
    // Formulaire adresse
    const [address, setAddress] = useState({
        street: user?.profile.address?.street ?? '',
        zip: user?.profile.address?.zip ?? '',
        city: user?.profile.address?.city ?? '',
    });
    if (!user)
        return null;
    async function handleSaveIdentity(e) {
        e.preventDefault();
        setSaving(true);
        await updateProfile(identity);
        setSaving(false);
        setSaved(true);
        setEditMode('none');
        setTimeout(() => setSaved(false), 3000);
    }
    async function handleSaveAddress(e) {
        e.preventDefault();
        setSaving(true);
        await updateProfile({ address });
        setSaving(false);
        setSaved(true);
        setEditMode('none');
        setTimeout(() => setSaved(false), 3000);
    }
    async function handleLogout() {
        await logout();
    }
    return (_jsx(Container, { children: _jsxs("div", { className: styles.page, children: [_jsxs("div", { className: styles.header, children: [_jsxs("div", { children: [_jsx("h1", { className: styles.title, children: "Mon compte" }), _jsxs("p", { className: styles.welcome, children: ["Bonjour, ", _jsx("strong", { children: user.profile.firstName }), " \uD83D\uDC4B"] })] }), _jsxs("div", { className: styles.headerActions, children: [_jsx(Link, { to: "/mes-commandes", children: _jsx(Button, { variant: "secondary", children: "Mes commandes" }) }), _jsx(Button, { variant: "ghost", onClick: handleLogout, children: "Se d\u00E9connecter" })] })] }), saved && (_jsx("p", { className: styles.savedBanner, role: "status", children: "\u2713 Modifications enregistr\u00E9es." })), _jsxs("div", { className: styles.grid, children: [_jsxs(Card, { padding: "lg", children: [_jsxs("div", { className: styles.sectionHeader, children: [_jsx("h2", { className: styles.sectionTitle, children: "Identit\u00E9" }), editMode !== 'identity' && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setEditMode('identity'), children: "Modifier" }))] }), editMode === 'identity' ? (_jsxs("form", { onSubmit: handleSaveIdentity, className: styles.form, children: [_jsxs("div", { className: styles.row, children: [_jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Pr\u00E9nom" }), _jsx("input", { className: styles.input, value: identity.firstName, onChange: (e) => setIdentity((p) => ({ ...p, firstName: e.target.value })), required: true })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Nom" }), _jsx("input", { className: styles.input, value: identity.lastName, onChange: (e) => setIdentity((p) => ({ ...p, lastName: e.target.value })), required: true })] })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "T\u00E9l\u00E9phone" }), _jsx("input", { className: styles.input, type: "tel", value: identity.phone, onChange: (e) => setIdentity((p) => ({ ...p, phone: e.target.value })) })] }), _jsxs("div", { className: styles.formActions, children: [_jsx(Button, { type: "submit", variant: "primary", size: "sm", disabled: saving, children: saving ? 'Enregistrement…' : 'Enregistrer' }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setEditMode('none'), children: "Annuler" })] })] })) : (_jsxs("dl", { className: styles.infoList, children: [_jsx(InfoRow, { label: "Pr\u00E9nom", value: user.profile.firstName }), _jsx(InfoRow, { label: "Nom", value: user.profile.lastName }), _jsx(InfoRow, { label: "Email", value: user.email }), _jsx(InfoRow, { label: "T\u00E9l\u00E9phone", value: user.profile.phone ?? '—' })] }))] }), _jsxs(Card, { padding: "lg", children: [_jsxs("div", { className: styles.sectionHeader, children: [_jsx("h2", { className: styles.sectionTitle, children: "Adresse de retrait" }), editMode !== 'address' && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setEditMode('address'), children: "Modifier" }))] }), editMode === 'address' ? (_jsxs("form", { onSubmit: handleSaveAddress, className: styles.form, children: [_jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Rue" }), _jsx("input", { className: styles.input, value: address.street, onChange: (e) => setAddress((p) => ({ ...p, street: e.target.value })) })] }), _jsxs("div", { className: styles.row, children: [_jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Code postal" }), _jsx("input", { className: styles.input, value: address.zip, onChange: (e) => setAddress((p) => ({ ...p, zip: e.target.value })) })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: "Ville" }), _jsx("input", { className: styles.input, value: address.city, onChange: (e) => setAddress((p) => ({ ...p, city: e.target.value })) })] })] }), _jsxs("div", { className: styles.formActions, children: [_jsx(Button, { type: "submit", variant: "primary", size: "sm", disabled: saving, children: saving ? 'Enregistrement…' : 'Enregistrer' }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setEditMode('none'), children: "Annuler" })] })] })) : (_jsxs("dl", { className: styles.infoList, children: [_jsx(InfoRow, { label: "Rue", value: user.profile.address?.street ?? '—' }), _jsx(InfoRow, { label: "Code postal", value: user.profile.address?.zip ?? '—' }), _jsx(InfoRow, { label: "Ville", value: user.profile.address?.city ?? '—' })] }))] }), _jsxs(Card, { padding: "lg", children: [_jsx("h2", { className: styles.sectionTitle, children: "S\u00E9curit\u00E9" }), _jsx("p", { className: styles.securityText, children: "Pour changer votre mot de passe, utilisez le lien de r\u00E9initialisation." }), _jsx(Link, { to: "/mot-de-passe-oublie", children: _jsx(Button, { variant: "secondary", size: "sm", children: "R\u00E9initialiser le mot de passe" }) })] }), _jsxs(Card, { padding: "lg", children: [_jsx("h2", { className: styles.sectionTitle, children: "Mon compte" }), _jsxs("p", { className: styles.securityText, children: ["Membre depuis le", ' ', new Date(user.profile.createdAt).toLocaleDateString('fr-FR', {
                                            month: 'long',
                                            year: 'numeric',
                                        }), "."] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: handleLogout, children: "Se d\u00E9connecter" })] })] })] }) }));
}
// ─── Composant ligne d'info ───
function InfoRow({ label, value }) {
    return (_jsxs("div", { className: styles.infoRow, children: [_jsx("dt", { className: styles.infoLabel, children: label }), _jsx("dd", { className: styles.infoValue, children: value })] }));
}

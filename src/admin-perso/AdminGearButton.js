import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ══════════════════════════════════════════════════════════════════════════
//  ROUE DENTÉE — Bouton d'accès à l'administration client
//  Fichier : src/admin-perso/AdminGearButton.tsx
//
//  Ce bouton ⚙️ est discret, placé dans le footer.
//  Un clic ouvre la modale de connexion admin.
//  Identifiants : Hclu1 / 3131
// ══════════════════════════════════════════════════════════════════════════
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminPerso } from './AdminPersoContext';
import styles from './AdminGearButton.module.css';
export default function AdminGearButton() {
    const { login, isAdminLoggedIn, logout } = useAdminPerso();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    function handleOpen() {
        if (isAdminLoggedIn) {
            // Déjà connecté → aller directement au panneau
            navigate('/admin-perso');
        }
        else {
            setOpen(true);
            setUsername('');
            setPassword('');
            setError('');
        }
    }
    function handleClose() {
        setOpen(false);
        setError('');
    }
    function handleSubmit(e) {
        e.preventDefault();
        const ok = login(username, password);
        if (ok) {
            setOpen(false);
            navigate('/admin-perso');
        }
        else {
            setError('Identifiants incorrects. Veuillez réessayer.');
        }
    }
    function handleLogout() {
        logout();
        navigate('/');
    }
    return (_jsxs(_Fragment, { children: [_jsx("button", { id: "admin-gear-button", className: `${styles.gearBtn} ${isAdminLoggedIn ? styles.active : ''}`, onClick: handleOpen, title: isAdminLoggedIn ? 'Panneau admin — cliquer pour ouvrir' : 'Administration', "aria-label": "Acc\u00E8s administration", children: "\u2699\uFE0F" }), open && (_jsx("div", { className: styles.overlay, onClick: handleClose, role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: styles.modal, onClick: (e) => e.stopPropagation(), children: [_jsx("button", { className: styles.closeBtn, onClick: handleClose, "aria-label": "Fermer", children: "\u2715" }), _jsx("div", { className: styles.modalIcon, children: "\u2699\uFE0F" }), _jsx("h2", { className: styles.modalTitle, children: "Administration" }), _jsx("p", { className: styles.modalSub, children: "Espace r\u00E9serv\u00E9 \u2014 saisissez vos identifiants" }), _jsxs("form", { onSubmit: handleSubmit, className: styles.form, noValidate: true, children: [_jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, htmlFor: "admin-username", children: "Nom d'utilisateur" }), _jsx("input", { id: "admin-username", className: styles.input, type: "text", autoComplete: "username", autoFocus: true, value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Hclu1", required: true })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, htmlFor: "admin-password", children: "Mot de passe" }), _jsx("input", { id: "admin-password", className: styles.input, type: "password", autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022", required: true })] }), error && _jsx("p", { className: styles.error, role: "alert", children: error }), _jsx("button", { className: styles.submitBtn, type: "submit", children: "Se connecter" })] })] }) })), isAdminLoggedIn && (_jsx("button", { style: {
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 'var(--text-xs)', color: 'var(--color-cta)',
                    textDecoration: 'underline', padding: 0,
                }, onClick: handleLogout, title: "Se d\u00E9connecter de l'admin", children: "Quitter l'admin" }))] }));
}

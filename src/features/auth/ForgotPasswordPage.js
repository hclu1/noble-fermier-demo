import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/auth/ForgotPasswordPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import Container from '../../layout/Container';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import styles from './ForgotPasswordPage.module.css';
// Page mot de passe oublié
// Envoie un email de réinitialisation via resetPassword()
// TODO Supabase : la fonction resetPassword() appellera
//   supabase.auth.resetPasswordForEmail(email, { redirectTo: '...' })
export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setStatus('sending');
        const { error: resetError } = await resetPassword(email);
        if (resetError) {
            setError(resetError);
            setStatus('error');
            return;
        }
        setStatus('sent');
    }
    return (_jsx(Container, { narrow: true, children: _jsx("div", { className: styles.page, children: _jsxs("div", { className: styles.wrapper, children: [_jsxs("div", { className: styles.header, children: [_jsx("h1", { className: styles.title, children: "Mot de passe oubli\u00E9" }), _jsx("p", { className: styles.subtitle, children: "Renseignez votre email pour recevoir un lien de r\u00E9initialisation." })] }), _jsx(Card, { padding: "lg", children: status === 'sent' ? (
                        /* ─── État succès ─── */
                        _jsxs("div", { className: styles.success, children: [_jsx("span", { className: styles.successIcon, children: "\u2709\uFE0F" }), _jsx("h2", { className: styles.successTitle, children: "Email envoy\u00E9 !" }), _jsxs("p", { className: styles.successText, children: ["Si un compte existe pour ", _jsx("strong", { children: email }), ", vous recevrez un lien de r\u00E9initialisation dans quelques minutes. V\u00E9rifiez aussi vos spams."] }), _jsx(Link, { to: "/connexion", children: _jsx(Button, { variant: "secondary", fullWidth: true, children: "Retour \u00E0 la connexion" }) })] })) : (
                        /* ─── Formulaire ─── */
                        _jsxs("form", { onSubmit: handleSubmit, className: styles.form, noValidate: true, children: [_jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: "email", className: styles.label, children: "Adresse email" }), _jsx("input", { id: "email", type: "email", required: true, autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), className: styles.input, placeholder: "marie@exemple.fr", disabled: status === 'sending' })] }), error && (_jsx("p", { className: styles.error, role: "alert", children: error })), _jsx(Button, { type: "submit", size: "lg", variant: "primary", fullWidth: true, disabled: status === 'sending', children: status === 'sending' ? 'Envoi en cours…' : 'Envoyer le lien' }), _jsx(Link, { to: "/connexion", className: styles.backLink, children: "\u2190 Retour \u00E0 la connexion" })] })) })] }) }) }));
}

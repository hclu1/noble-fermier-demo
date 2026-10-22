import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/auth/LoginPage.tsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import Container from '../../layout/Container';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import styles from './LoginPage.module.css';
// Page de connexion — email + mot de passe
// Redirige vers la page demandée avant la connexion (ou /mon-compte)
// Identifiants de démo : marie.dupont@exemple.fr / demo1234
export default function LoginPage() {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    // Page à afficher après connexion (mémorisée par ProtectedRoute)
    const redirectTo = location.state?.from ?? '/mon-compte';
    // Si déjà connecté, on redirige directement
    if (user) {
        navigate(redirectTo, { replace: true });
        return null;
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const { error: loginError } = await login(email, password);
        if (loginError) {
            setError(loginError);
            setLoading(false);
            return;
        }
        navigate(redirectTo, { replace: true });
    }
    return (_jsx(Container, { narrow: true, children: _jsx("div", { className: styles.page, children: _jsxs("div", { className: styles.wrapper, children: [_jsxs("div", { className: styles.header, children: [_jsx("h1", { className: styles.title, children: "Connexion" }), _jsx("p", { className: styles.subtitle, children: "Acc\u00E9dez \u00E0 votre espace client Noble Fermier." })] }), _jsx(Card, { padding: "lg", children: _jsxs("form", { onSubmit: handleSubmit, className: styles.form, noValidate: true, children: [_jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: "email", className: styles.label, children: "Adresse email" }), _jsx("input", { id: "email", type: "email", required: true, autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), className: styles.input, placeholder: "marie@exemple.fr", disabled: loading })] }), _jsxs("div", { className: styles.field, children: [_jsxs("div", { className: styles.labelRow, children: [_jsx("label", { htmlFor: "password", className: styles.label, children: "Mot de passe" }), _jsx(Link, { to: "/mot-de-passe-oublie", className: styles.forgotLink, children: "Mot de passe oubli\u00E9 ?" })] }), _jsx("input", { id: "password", type: "password", required: true, autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value), className: styles.input, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", disabled: loading })] }), error && (_jsx("p", { className: styles.error, role: "alert", children: error })), _jsx(Button, { type: "submit", size: "lg", variant: "primary", fullWidth: true, disabled: loading, children: loading ? 'Connexion en cours…' : 'Se connecter' })] }) }), import.meta.env.DEV && (_jsxs("div", { className: styles.demo, children: [_jsx("p", { className: styles.demoLabel, children: "Compte de d\u00E9monstration" }), _jsxs("p", { children: ["Email : ", _jsx("strong", { children: "marie.dupont@exemple.fr" })] }), _jsxs("p", { children: ["Mot de passe : ", _jsx("strong", { children: "demo1234" })] })] }))] }) }) }));
}

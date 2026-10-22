import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/cart/CheckoutPage.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import Container from '../../layout/Container';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import styles from './CheckoutPage.module.css';
export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    if (items.length === 0) {
        return (_jsx(Container, { narrow: true, children: _jsxs("div", { style: { textAlign: 'center', padding: 'var(--space-20) 0' }, children: [_jsx("p", { children: "Votre panier est vide." }), _jsx(Link, { to: "/catalogue", children: _jsx(Button, { variant: "secondary", style: { marginTop: 'var(--space-4)' }, children: "Retour au catalogue" }) })] }) }));
    }
    function handleConfirm() {
        // Simulation de création de commande
        alert('Commande validée ! (Simulation)');
        clearCart();
        navigate('/mes-commandes');
    }
    return (_jsx(Container, { narrow: true, children: _jsxs("div", { className: styles.page, children: [_jsx("h1", { className: styles.title, children: "Finalisation de commande" }), _jsx("div", { className: styles.layout, children: _jsxs(Card, { padding: "lg", children: [_jsx("h2", { className: styles.sectionTitle, children: "Votre commande" }), _jsxs("div", { className: styles.summary, children: [_jsxs("div", { className: styles.row, children: [_jsxs("span", { children: ["Produits (", items.length, ")"] }), _jsxs("span", { children: [totalPrice.toFixed(2), " \u20AC"] })] }), _jsxs("div", { className: `${styles.row} ${styles.total}`, children: [_jsx("span", { children: "Total \u00E0 r\u00E9gler" }), _jsxs("span", { children: [totalPrice.toFixed(2), " \u20AC"] })] })] }), _jsx("p", { className: styles.notice, children: "En cliquant sur \"Confirmer\", vous validez votre commande en retrait magasin. Le paiement s'effectue sur place." }), _jsx(Button, { variant: "primary", fullWidth: true, size: "lg", onClick: handleConfirm, children: "Confirmer la commande" }), _jsx(Link, { to: "/panier", style: { display: 'block', textAlign: 'center', marginTop: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }, children: "Modifier mon panier" })] }) })] }) }));
}

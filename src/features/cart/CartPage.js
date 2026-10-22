import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/cart/CartPage.tsx
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import Container from '../../layout/Container';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import styles from './CartPage.module.css';
export default function CartPage() {
    const { items, totalPrice, updateQuantity, removeFromCart } = useCart();
    if (items.length === 0) {
        return (_jsx(Container, { narrow: true, children: _jsxs("div", { className: styles.empty, children: [_jsx("span", { className: styles.emptyIcon, children: "\uD83D\uDED2" }), _jsx("h1", { className: styles.title, children: "Votre panier est vide" }), _jsx("p", { className: styles.text, children: "D\u00E9couvrez nos produits frais et locaux pour commencer vos achats." }), _jsx(Link, { to: "/catalogue", children: _jsx(Button, { variant: "primary", children: "Voir le catalogue" }) })] }) }));
    }
    return (_jsx(Container, { children: _jsxs("div", { className: styles.page, children: [_jsx("h1", { className: styles.title, children: "Mon Panier" }), _jsxs("div", { className: styles.layout, children: [_jsx("div", { className: styles.items, children: items.map((item) => (_jsx(Card, { className: styles.itemCard, children: _jsxs("div", { className: styles.itemRow, children: [_jsxs("div", { className: styles.itemInfo, children: [_jsx("h3", { className: styles.itemName, children: item.product.name }), _jsxs("p", { className: styles.itemPrice, children: [item.product.price.toFixed(2), " \u20AC / ", item.product.unit] })] }), _jsxs("div", { className: styles.itemActions, children: [_jsxs("div", { className: styles.quantity, children: [_jsx("button", { onClick: () => updateQuantity(item.product.id, item.quantity - 1), className: styles.qtyBtn, children: "-" }), _jsx("span", { className: styles.qtyValue, children: item.quantity }), _jsx("button", { onClick: () => updateQuantity(item.product.id, item.quantity + 1), className: styles.qtyBtn, children: "+" })] }), _jsxs("span", { className: styles.itemTotal, children: [(item.product.price * item.quantity).toFixed(2), " \u20AC"] }), _jsx("button", { onClick: () => removeFromCart(item.product.id), className: styles.removeBtn, "aria-label": "Supprimer", children: "\uD83D\uDDD1\uFE0F" })] })] }) }, item.product.id))) }), _jsx("aside", { className: styles.summary, children: _jsxs(Card, { padding: "lg", children: [_jsx("h2", { className: styles.summaryTitle, children: "R\u00E9capitulatif" }), _jsxs("div", { className: styles.summaryRow, children: [_jsx("span", { children: "Total" }), _jsxs("span", { className: styles.summaryTotal, children: [totalPrice.toFixed(2), " \u20AC"] })] }), _jsx(Link, { to: "/commande", children: _jsx(Button, { variant: "primary", fullWidth: true, size: "lg", children: "Passer la commande" }) })] }) })] })] }) }));
}

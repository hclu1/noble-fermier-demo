import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// Path: src/features/account/components/OrderCard.tsx
import { useState } from 'react';
import OrderStatusBadge from './OrderStatusBadge';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import styles from './OrderCard.module.css';
// Carte de commande — résumé + détail dépliable
// Affiche : numéro, date, statut, total, et les lignes de commande
export default function OrderCard({ order }) {
    const [isOpen, setIsOpen] = useState(false);
    const formattedDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const deliveryLabel = order.deliveryMode === 'pickup' ? 'Retrait en magasin' : 'Livraison';
    return (_jsxs(Card, { className: styles.card, padding: "md", children: [_jsxs("div", { className: styles.header, children: [_jsxs("div", { className: styles.meta, children: [_jsxs("span", { className: styles.orderId, children: ["Commande #", order.id.replace('ord-', '')] }), _jsx("span", { className: styles.date, children: formattedDate })] }), _jsxs("div", { className: styles.right, children: [_jsx(OrderStatusBadge, { status: order.status }), _jsxs("span", { className: styles.total, children: [order.totalPrice.toFixed(2), " \u20AC"] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsOpen((prev) => !prev), "aria-expanded": isOpen, "aria-label": isOpen ? 'Masquer les détails' : 'Voir les détails', children: isOpen ? '▲ Masquer' : '▼ Détails' })] })] }), isOpen && (_jsxs("div", { className: styles.detail, children: [_jsxs("div", { className: styles.deliveryMode, children: [_jsx("span", { children: "\uD83D\uDCE6" }), _jsx("span", { children: deliveryLabel })] }), _jsxs("table", { className: styles.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: styles.th, children: "Produit" }), _jsx("th", { className: styles.th, children: "Qt\u00E9" }), _jsx("th", { className: styles.th, children: "Prix unitaire" }), _jsx("th", { className: styles.th, children: "Sous-total" })] }) }), _jsx("tbody", { children: order.items.map((item) => (_jsxs("tr", { className: styles.tr, children: [_jsxs("td", { className: styles.td, children: [_jsx("span", { className: styles.productName, children: item.productName }), _jsx("span", { className: styles.productUnit, children: item.unit })] }), _jsx("td", { className: styles.td, children: item.quantity }), _jsxs("td", { className: styles.td, children: [item.unitPrice.toFixed(2), " \u20AC"] }), _jsxs("td", { className: styles.td, children: [(item.quantity * item.unitPrice).toFixed(2), " \u20AC"] })] }, item.id))) })] }), order.note && (_jsxs("div", { className: styles.note, children: [_jsx("span", { className: styles.noteLabel, children: "Note :" }), _jsx("span", { children: order.note })] })), _jsxs("div", { className: styles.totalRow, children: [_jsx("span", { children: "Total" }), _jsxs("span", { className: styles.totalAmount, children: [order.totalPrice.toFixed(2), " \u20AC"] })] })] }))] }));
}

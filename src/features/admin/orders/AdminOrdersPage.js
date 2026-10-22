import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/admin/orders/AdminOrdersPage.tsx
import { useState, useEffect } from 'react';
import { adminFetchAllOrders, adminUpdateOrderStatus } from '../../../lib/queries/admin';
import Button from '../../../components/ui/Button';
import styles from './AdminOrdersPage.module.css';
// ─── Progression des statuts ───
// Chaque statut a un libellé affiché et une action possible vers le statut suivant.
const STATUS_LABEL = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    ready: 'Prête à retirer',
    delivered: 'Livrée',
    cancelled: 'Annulée',
};
const NEXT_STATUS = {
    pending: 'confirmed',
    confirmed: 'ready',
    ready: 'delivered',
};
const NEXT_ACTION_LABEL = {
    pending: 'Confirmer',
    confirmed: 'Prête à retirer',
    ready: 'Livrée',
};
export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        adminFetchAllOrders().then(({ data, error }) => {
            if (data)
                setOrders(data);
            if (error)
                setError(error);
            setIsLoading(false);
        });
    }, []);
    async function handleStatusChange(order, newStatus) {
        setUpdatingId(order.id);
        setError(null);
        const { error } = await adminUpdateOrderStatus(order.id, newStatus);
        if (!error) {
            setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)));
        }
        else {
            setError(error);
        }
        setUpdatingId(null);
    }
    return (_jsxs("div", { className: styles.page, children: [_jsx("div", { className: styles.header, children: _jsxs("div", { children: [_jsx("h1", { className: styles.title, children: "Commandes" }), _jsxs("p", { className: styles.count, children: [orders.length, " commande", orders.length !== 1 ? 's' : ''] })] }) }), error && _jsxs("p", { className: styles.errorBanner, children: ["Erreur : ", error] }), isLoading ? (_jsx("p", { className: styles.loading, children: "Chargement des commandes\u2026" })) : orders.length === 0 ? (_jsx("p", { className: styles.empty, children: "Aucune commande pour l'instant." })) : (_jsx("div", { className: styles.tableWrapper, children: _jsxs("table", { className: styles.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: styles.th, children: "R\u00E9f\u00E9rence" }), _jsx("th", { className: styles.th, children: "Date" }), _jsx("th", { className: styles.th, children: "Articles" }), _jsx("th", { className: styles.th, children: "Total" }), _jsx("th", { className: styles.th, children: "Mode" }), _jsx("th", { className: styles.th, children: "Statut" }), _jsx("th", { className: styles.th, children: "Action" })] }) }), _jsx("tbody", { children: orders.map((order) => {
                                const nextStatus = NEXT_STATUS[order.status];
                                const actionLabel = NEXT_ACTION_LABEL[order.status];
                                const isUpdating = updatingId === order.id;
                                return (_jsxs("tr", { className: styles.tr, children: [_jsx("td", { className: styles.td, children: _jsxs("span", { className: styles.orderId, children: ["#", order.id.slice(0, 8)] }) }), _jsx("td", { className: styles.td, children: new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric', month: 'short', year: 'numeric',
                                            }) }), _jsxs("td", { className: styles.td, children: [order.items.length, " article", order.items.length !== 1 ? 's' : ''] }), _jsx("td", { className: styles.td, children: _jsxs("strong", { children: [order.totalPrice.toFixed(2), " \u20AC"] }) }), _jsx("td", { className: styles.td, children: order.deliveryMode === 'pickup' ? '🏪 Retrait' : '🚚 Livraison' }), _jsx("td", { className: styles.td, children: _jsx("span", { className: `${styles.badge} ${styles[`badge_${order.status}`]}`, children: STATUS_LABEL[order.status] }) }), _jsx("td", { className: styles.td, children: nextStatus && actionLabel ? (_jsx(Button, { size: "sm", variant: "primary", disabled: isUpdating, onClick: () => handleStatusChange(order, nextStatus), children: isUpdating ? '…' : actionLabel })) : (_jsx("span", { className: styles.noAction, children: "\u2014" })) })] }, order.id));
                            }) })] }) }))] }));
}
